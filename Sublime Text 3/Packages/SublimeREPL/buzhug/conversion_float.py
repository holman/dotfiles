"""
Conversion program to upgrade databases with float fields for
version 1.1

The implementation in versions <= 1.0 caused a DeprecationWarning
for Python version 2.5. The conversion function must be changed
and this makes databases built with old versions incompatible

Use this script to upgrade to the new version : select the directory
for the database in the window, this will upgrade all float fields

For safety reasons, a backup copy of old files for these fields is
saved in the directory with current datetime appended at the end of 
file name. In case of any problem, remove new file for the field and 
rename backup file by removing the datetime string
"""
import os
import struct
import random
import math

class OldFloatFile:

    block_len = 10
    MIDSHORT = 3000 + 128*256
    MAXSHORT = 256*256
    X = MAXSHORT - MIDSHORT

    def from_block(self,block):
        if block[0]=='!':
            return None
        else:
            s = block[1:]
            if ord(s[0]) < 128:
                # negative number
                pack_exp = s[:2]
                exp = 3000 - struct.unpack('>h',pack_exp)[0]
                mant = struct.unpack('>d',chr(63)+s[2:])[0] - 1.1
            else:
                exp = self.X + struct.unpack('>h',s[:2])[0]
                mant = struct.unpack('>d',chr(63)+s[2:])[0]
            return math.ldexp(mant,exp)

class FloatFile:

    block_len = 10
    offsetneg = 16384
    offsetpos = 16384*3

    def to_block(self,value):
        if value is None:
            return '!'+chr(0)*9
        elif not isinstance(value,float):
            raise ValueError,'Bad type : expected float, got %s %s' \
                %(value,value.__class__)
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
            if ord(s[0])<128:
                # negative number
                exp = self.offsetneg-struct.unpack('>H',s[:2])[0]
                mant = struct.unpack('>d',chr(63)+s[2:])[0] - 1.1
            else:
                exp = struct.unpack('>H',s[:2])[0]-self.offsetpos
                mant = struct.unpack('>d',chr(63)+s[2:])[0]
            return math.ldexp(mant,exp)

def conv(old):
    # update base to new version
    of = OldFloatFile()
    nf = FloatFile()
    for (f,t) in old.fields.iteritems():
        if t is float:
            old_path = db._file[f].path
            new_path = os.path.join(db._file[f].base,"new_"+db._file[f].name)
            new_file = open(new_path,"wb")
            for i,r in enumerate(db._file[f]):
                v = of.from_block(r)
                if v is None:
                    new_block = r
                else:
                    new_block = nf.to_block(v)
                    if nf.from_block(new_block) != v:
                        raise ValueError,"conversion error : %s != %s" \
                            %(v,nf.from_block(new_block))
                new_file.write(new_block)
            print i,"lines"
            new_file.close()

            # double-check if values are the same between old and new file
            db._file[f].open()
            new_file = open(new_path,"rb")
            bl = db._file[f].block_len
            while True:
                old = db._file[f].read(bl)
                if not old:
                    break
                new = new_file.read(bl)
                if not of.from_block(old) == nf.from_block(new):
                    raise ValueError, "conversion error : %s != %s" \
                        %(of.from_block(old),nf.from_block(new))

            new_file.close()
            # replace old file
            db.close()
            # for safety, backup old file
            import datetime
            backup_name = db._file[f].name+datetime.datetime.now().strftime("%y%m%d%H%M%S")
            os.rename(db._file[f].path,os.path.join(db._file[f].base,backup_name))
            os.rename(new_path,old_path)            

import buzhug                
import tkFileDialog

path = tkFileDialog.askdirectory()
if path :
    db = buzhug.Base(path).open()
    conv(db)
