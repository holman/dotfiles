"""This module defines the classes used to modelize the files in which 
information is stored

One file is used for each field of the base. The values stored are first
converted into "blocks", which are bytestrings ready to be written in
physical files in the file system. Symmetrically, data is read from the
physical file as a bytestring, and can be converted into a value

To optimize the speed of the select() method, the comparison between
a searched value and a record value is made by converting the searched 
value into a "block", then compare it to the blocks in the file : this is 
much faster than converting each block in the file to a value

A consequence of this is that the conversion between value and block must
preserve the order : if value1 > value2 then block1 > block2. For instance
we can't convert an integer into its string representation by str(),
because 10 > 2 (integers) but '10' < '2' (strings). The function used here
is block = struct('>i',value+sys.maxint)

Since the "for line in _file" loop is extremely fast, whenever possible the
blocks are stored on one line (lines are separated by \n). Storage of Python
bytestrings and of Unicode objects use this format (characters \n and \r must
be escaped to keep the block on one line) ; so do date and datetime

Integers are converted into blocks of 4 characters, since one of them can be
one of the line break characters we can't use the "for line in _file" loop.
Browsing the file consists in reading 4096 blocks at a time and yielding the
blocks one after the other

Deleted blocks begin with "#", uninitialized values with '!', valid valued
with '-'
"""
import sys
import os
import tempfile
import shutil

class File:

    def __init__(self,base='',name=''):
        self.name = name
        self.base = base
        self.path = os.path.join(base,name)

    def create(self):
        if not os.path.isdir(self.base):
            os.mkdir(self.base)
        file(self.path,'w').close()
        self.fileobj = open(self.path,'r+b')
        return self

    def open(self):
        self.fileobj = open(self.path,'r+b')
        return self

    def get_end_pos(self):
        self.fileobj.seek(0,2)
        return self.fileobj.tell()

    def get_pos(self):
        return self.fileobj.tell()

    def insert(self,value):
        self.fileobj.seek(0,2)
        self.fileobj.write(self.to_block(value))
        self.fileobj.seek(0,2)

    def close(self):
        self.fileobj.close()

    def mark_as_deleted(self,pos):
        """mark the block at position pos as deleted"""
        self.fileobj.seek(pos)
        self.fileobj.write('#')
        self.fileobj.seek(pos)

    def get_value_at_pos(self,pos):
        return self.from_block(self.get_block_at_pos(pos))
   
    def write_value_at_pos(self,pos,value):
        self.fileobj.seek(pos)
        self.fileobj.write(self.to_block(value))
        self.fileobj.seek(pos)
        
    def tell(self):
        return self.fileobj.tell()
    
    def seek(self,*args):
        return self.fileobj.seek(*args)
    
    def read(self,size=-1):
        return self.fileobj.read(size)

    def write(self,data):
        self.fileobj.write(data)

class VariableLengthFile(File):
    """For variable length data (strings, unicode) blocks are strings
    on one line"""

    def get_block_at(self,num):
        self.fileobj.seek(0)
        for i,line in enumerate(self.fileobj):
            if i == num:
                return line

    def get_block_at_pos(self,pos):
        self.fileobj.seek(pos)
        return self.fileobj.readline()

    def read_block(self):
        return self.fileobj.readline()

    def __iter__(self):
        self.fileobj.seek(0)
        for line in self.fileobj:
            yield line

class FixedLengthFile(File):
    """For fixed length data blocks are strings of length block_len"""

    def get_block_at(self,num):
        self.fileobj.seek(self.block_len*num)
        return self.fileobj.read(self.block_len)

    def read_block(self):
        return self.fileobj.read(self.block_len)

    def get_block_at_pos(self,pos):
        self.fileobj.seek(pos)
        return self.fileobj.read(self.block_len)
   
    def get_block_at(self,num):
        return self.get_block_at_pos(self.block_len*num)

    def __iter__(self):
        self.fileobj.seek(0)
        chunk_size = self.block_len*(131072/self.block_len)
        while True:
            buf = self.fileobj.read(chunk_size)
            if not buf:
                raise StopIteration
            for i in range(len(buf)/self.block_len):
                yield buf[self.block_len*i:self.block_len*(i+1)]

class StringFile(VariableLengthFile):

    def to_block(self,value):
        if value is None:
            return '!\n'
        elif not isinstance(value,str):
            raise ValueError,'Bad type : expected str, got %s %s' %(value,
                    value.__class__)
        else:
            # escape CR & LF so that the block is on one line
            value = value.replace('\\','\\\\')
            value = value.replace('\n','\\n')
            value = value.replace('\r','\\r')
            return '-' + value + '\n'
    
    def from_block(self,block):
        if block == '!\n':
            return None
        else:
            # this is the fastest algo I've found to unescape CR & LF
            # patched by Jorge Vargas
            b = block[1:-1]
            res = ''
            i = 0
            while i<len(b):
                if b[i] == '\\':
                    j = i
                    while j<len(b) and b[j] == '\\':
                        j += 1
                    res += '\\'*((j-i)/2)
                    if (j-i) % 2:   # odd number of slashes
                        if b[j] == 'n':
                            res += '\n'
                        elif b[j] == 'r':
                            res += '\r'
                        i = j+1
                    else:
                        i = j
                else:
                    res += b[i]
                    i += 1
            return res
    
class UnicodeFile(StringFile):
    """Unicode strings are converted to their UTF-8 encoding"""

    def to_block(self,value):
        if value is None:
            return '!\n'
        elif not isinstance(value,unicode):
            raise ValueError,'Bad type : expected unicode, got %s %s' %(value,
                    value.__class__)
        else:
            return StringFile.to_block(self,value.encode('utf-8'))
    
    def from_block(self,block):
        if block == '!\n':
            return None
        else:
            return StringFile.from_block(self,block).decode('utf-8')


# Generic class for dates
# Although dates have a fixed length file, this class derives from 
# VariableLengthFile because select is faster this way
# block_len is set because this forces the use of the fast select algos

from datetime import date, datetime, time as dtime

class DateFile(VariableLengthFile):

    block_len = 10 # value set to force use of the fast select algos

    def to_block(self,value):
        if value is None:
            return '!xxxxxxxx\n'
        elif not isinstance(value,date):
            raise ValueError,'Bad type : expected datetime.date, got %s %s' \
                %(value,value.__class__)
        else:
            if value.year>=1900:
                return value.strftime('-%Y%m%d')+'\n'
            else:
                # strftime doesn't work for year<1900
                return "-%04d%02d%02d\n" %(value.year,value.month,value.day)
    
    def from_block(self,block):
        if block[0] == '!':
            return None
        else:
            return date(int(block[1:5]),int(block[5:7]),int(block[7:-1]))  
   
class DateTimeFile(VariableLengthFile):

    block_len = 16 # value set to force use of the fast select algos

    def to_block(self,value):
        if value is None:
            return '!xxxxxxxxxxxxxx\n'
        elif not isinstance(value,date):
            raise ValueError,'Bad type : expected datetime.date, got %s %s' \
                %(value,value.__class__)
        else:
            if value.year>=1900:
                return value.strftime('-%Y%m%d%H%M%S')+'\n'
            else:
                # strftime doesn't work for year<1900
                _date = "-%04d%02d%02d%02d%02D%02d\n" %(value.year,
                    value.month,value.day,value.hour,value.minute,
                    value.second)
                return _date
    
    def from_block(self,block):
        if block[0] == '!':
            return None
        else:
            return datetime(int(block[1:5]),int(block[5:7]),int(block[7:9]),
                int(block[9:11]),int(block[11:13]),int(block[13:15]))

class TimeFile(VariableLengthFile):

    # code by Nicolas Pinault

    block_len = 8 # value set to force use of the fast select algos

    def to_block(self,value):
        if value is None:
            return '!xxxxxx\n'
        elif not isinstance(value, dtime):
            raise ValueError,'Bad type : expected datetime.time, got %s %s' \
                %(value,value.__class__)
        else:
            return value.strftime('-%H%M%S')+'\n'
    
    def from_block(self,block):
        if block[0] == '!':
            return None
        else:
            return dtime(int(block[1:3]),int(block[3:5]),int(block[5:7]))

class BooleanFile(FixedLengthFile):

    block_len = 2

    def to_block(self,value):
        if value is None:
            return '!'+chr(0)
        elif not isinstance(value,bool):
            raise ValueError,'Bad type : expected bool, got %s %s' \
                %(value,value.__class__)
        else:
            if value:
                return '-1'
            else:
                return '-0'
    def from_block(self,block):
        if block[0]=='!':
            return None
        elif block == "-0":
            return False
        else:
            return True
    
import struct

class IntegerFile(FixedLengthFile):

    MIDINT = 2**30
    block_len = 5

    def to_block(self,value):
        if value is None:
            return '!'+chr(0)*4
        elif not isinstance(value,int):
            raise ValueError,'Bad type : expected int, got %s %s' \
                %(value,value.__class__)
        else:
            if value <= -sys.maxint/2:
                raise OverflowError,"Integer value must be > %s, got %s" \
                    %(-sys.maxint/2,value)
            if value > sys.maxint/2:
                raise OverflowError,"Integer value must be <= %s, got %s" \
                    %(sys.maxint/2,value)
            return '-'+struct.pack('>i',value+self.MIDINT)

    def from_block(self,block):
        if block[0]=='!':
            return None
        else:
            return struct.unpack('>i',block[1:])[0]-self.MIDINT

import math

class FloatFile(FixedLengthFile):

    """Conversion of float numbers :
    1. take the mantissa and exponent of value : value = mant * 2**exp
    Mantissa is always such that 0.5 <= abs(mant) < 1
    The range for exp is (probably) platform-dependant ; typically from -2048
    to +2048
    2. exponent is converted to a positive integer e1 : 0<=e1<=65535
    If value is negative : e1 = 16384 - exp (decreases when mantissa
       increases, to preserve order)
    If value is positive : e1 = 16384*3 + exp
    
    This conversion will work in all cases if abs(exp) < 16384
    
    3. e1 is converted into a 2-byte string by struct.pack('>H',e1)
    
    4. mantissa conversion :
    - if value is positive : struct.pack('>d',mant)
    - if value is negative : struct.pack('>d',1.1 + mant)
    This conversion preserves order, and since all results begin with the same
    byte chr(63), this first byte can be stripped

    This implementation has changed in version 1.1. Use script conversion_float
    to upgrade databases made with older versions
    """
    
    block_len = 10
    offsetneg = 16384
    offsetpos = 16384*3

    def to_block(self,value):
        if value is None:
            return '!'+chr(0)*9
        elif not isinstance(value,float):
            raise ValueError,'Bad type : expected float, got %s %s' \
                %(value,value.__class__)
        elif value == 0.0:
            return '-'+chr(128)+chr(0)*8
        else:
            # get mantissa and exponent
            # f = mant*2**exp, 0.5 <= abs(mant) < 1
            mant,exp = math.frexp(value)
            if value>=0:
                pack_exp = struct.pack('>H',exp+self.offsetpos)
                return '-'+pack_exp+struct.pack('>d',mant)[1:]
            else:
                pack_exp = struct.pack('>H',self.offsetneg-exp)
                return '-'+pack_exp+struct.pack('>d',1.1+mant)[1:]

    def from_block(self,block):
        if block[0]=='!':
            return None
        else:
            s = block[1:]
            if ord(s[0])==128:
                return 0.0
            elif ord(s[0])<128:
                # negative number
                exp = self.offsetneg-struct.unpack('>H',s[:2])[0]
                mant = struct.unpack('>d',chr(63)+s[2:])[0] - 1.1
            else:
                exp = struct.unpack('>H',s[:2])[0]-self.offsetpos
                mant = struct.unpack('>d',chr(63)+s[2:])[0]
            return math.ldexp(mant,exp)

class PositionFile(FixedLengthFile):
    """A position file is used to reference records by their id
    The information stored about a record is the position of the 
    record fields in the respective field files
    """

    def __init__(self,baseobj):
        """Creates a position file for baseobj, an instance of buzhug.Base
        """
        self.baseobj = baseobj
        self.base = baseobj.name
        self.path = os.path.join(self.base,'__pos__')
        self.deleted_lines = []
        self.block_len = 1+4*len(baseobj.field_names)
        self._count = 0 # number of records in the base
        self.next_id = 0
    
    def open(self):
        self.fileobj = open(self.path,'r+b')
        # get deleted items, identified by a leading '#'
        self.deleted_lines, self._count = [],0
        for line_num,line in enumerate(self):
            if line[0]=='#':
                self.deleted_lines.append(line_num)
            else:
                self._count += 1
        # the file with a mapping between id and line in the
        # position file. Has as many blocks of 5 bytes as already
        # attributed ids
        _id_pos = self.baseobj._id_pos
        _id_pos.seek(0,2)
        self.next_id = _id_pos.tell()/5
        return self

    def insert(self,value):
        """Method called when a record is inserted in the base. value
        is the list of the positions in field files
        Return the id of the inserted record and the line number in 
        the position file
        """
        if self.deleted_lines:
            # reuse the first deleted record available
            num = self.deleted_lines.pop(0)
            pos = num*self.block_len
            block = self.get_block_at(num)
        else:
            # append a new record at the end of the file
            self.fileobj.seek(0,2)
            pos = self.fileobj.tell()
            num = pos/self.block_len
        _id = self.next_id
        self.fileobj.seek(pos)
        self.fileobj.write(self.to_block(value))
        self.fileobj.seek(0,2)
        self._count += 1
        self.next_id += 1
        return _id,num

    def update(self,_line,new_positions):
        """Method used if the record identified by _line has changed with 
        variable length fields modified : in this case the new fields are 
        appended at the end of the field files and their new positions must 
        be updated"""
        pos = _line*self.block_len
        self.fileobj.seek(pos)
        self.fileobj.write(self.to_block(new_positions))
        self.fileobj.seek(0,2)

    def update_positions(self,_line,new_positions):
        """Only update positions in field files for record at _line"""
        pos = _line*self.block_len
        # skip flag
        self.fileobj.seek(pos+1)
        self.fileobj.write(''.join([struct.pack('>i',v) 
            for v in new_positions]))
        self.fileobj.seek(pos+3)

    def remove(self,_line):
        self.fileobj.seek(_line*self.block_len)
        if self.fileobj.read(1) == '#':
            return  # if record is already removed, ignore silently
        self.fileobj.seek(_line*self.block_len)
        self.fileobj.write('#')
        self.fileobj.seek(_line*self.block_len)
        self.deleted_lines.append(_line)
        self._count -= 1

    def add_field(self,field_name,indx,default):
        """Update the file to insert the new field at specified index"""
        ff = self.baseobj._file[field_name]
        tf = tempfile.TemporaryFile()
        self.fileobj.seek(0)
        pos = 1 + 4*indx   # the place to insert positions in the field file
        while True:
            line = self.fileobj.read(self.block_len)
            if not line:
                break
            line = line[:pos] + struct.pack('>i',ff.tell()) + line[pos:]
            tf.write(line)
            ff.insert(default)
        tf.seek(0)
        self.create()
        shutil.copyfileobj(tf,self.fileobj)
        tf.close()
        self.block_len += 4

    def drop_field(self,field_name,indx):
        """Update the file to remove the field"""
        tf = tempfile.TemporaryFile()
        self.fileobj.seek(0)
        pos = 1 + 4*indx   # the position for the field in the block
        while True:
            line = self.fileobj.read(self.block_len)
            if not line:
                break
            line = line[:pos] + line[pos+4:]
            tf.write(line)
        tf.seek(0)
        self.create()
        shutil.copyfileobj(tf,self.fileobj)
        tf.close()
        self.block_len -= 4

    def to_block(self,value):
        # value = positions in field files
        return '-'+''.join([struct.pack('>i',v) for v in value])

    def from_block(self,block):
        """Returns a list : position of field in their files"""
        return list(struct.unpack('>'+'i'*(len(block[1:])/4),block[1:]))

class DeletedRowsFile(VariableLengthFile):
    """File that references the deleted rows. Stores integers on variable
    length format because it's faster and we don't need a conversion that
    preserves the order"""

    def create(self):
        VariableLengthFile.create(self)
        self.deleted_rows = []
        return self

    def open(self):
        self.fileobj = open(self.path,'r+b')
        self.deleted_rows = [ int(line[:-1]) for line in self ]
        return self
    
    def insert(self,value):
        VariableLengthFile.insert(self,value)
        self.deleted_rows.append(value)

    def to_block(self,value):
        return str(value)+'\n'
    
    def from_block(self,block):
        return int(block[:-1])

class ExternalFile(FixedLengthFile):
    """Class for references to another base"""

    block_len = 5
    
    def to_block(self,value):
        if value is None:
            return '!'+chr(0)*4
        else:
            v = [ value.__id__ ]
            return '-'+struct.pack('>i',value.__id__)

    def from_block(self,block):
        if block[0]=='!':
            return None
        _id = struct.unpack('>i',block[1:])[0]
        try:
            return self.db[_id]
        except IndexError:
            # if the referenced record has been deleted, return
            # an uninitialized record (all fields set to None,
            # including __id__)
            rec = ['!']*len(self.db.field_names)
            return self.db._full_rec(rec)
