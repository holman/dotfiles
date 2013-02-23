"""Pure-Python database engine

Licence : BSD
Author : Pierre Quentel (pierre.quentel@gmail.com)

Access by list comprehension or generator expression or select

Syntax overview :
    from buzhug import Base
    db = Base('dummy')
    db.create(name=str,age=int,birthday=date)
    db.open()

    db.insert(name='homer',age=23,birthday=date(1994,10,7))
    # select names for age > 20
    # list comprehension
    res = [ r.name for r in db if r.age > 20 ]
    # select method (faster)
    res = db.select(['name'],'age > v',v=20)
    # select for update, then update
    recs = db.select_for_update(['name'],'age > v',v=20)
    for record in recs:
        db.update(record,name=record.name.upper())
    # direct access by __id__
    record = db[_id]

    # delete a list of records
    db.delete(selected_records)
    # delete one record identified by id
    del db[_id]

Concurrency control : at update time the version number of the
record is checked, if it has changed since selecting an exception is raised

Implementation overview
- all files are in a directory called like the base
- in this directory there are files with general information, and one file 
  per field ("field file") ; storage format and methods for storing and
  retrieving depend on the field type. Uses the classes in buzhug_classes
- all selections are made by "brutal" browsing of the files (no indexing) ; 
  for string fields, the very fast "for line in file" loop is used

Version 0.4
- fixed bug in delete : following inserts would make __getitem__ return
previously deleted items
Version 0.5 :
- client / server mode added
- option "mode" for the create() method
Version 0.7 :
- minor changes for compatibility with Python 2.3
- method "update" on records
Version 0.9 :
- prevent adding a field with the same name as an existing one
- add a close() method to close all files
Version 1.0
- make sort_by compatible with Python 2.3
- support for the datetime.time types (by Nicolas Pinault)
Version 1.1
- implementation change for floats : this change makes existing bases with
float fields incompatible. Use script conversion_float to upgrade
Version 1.2
- method close() forgot to close _id_pos and _del_rows
- fix a bug for links to other dbs when their path has spaces
Version 1.3
- fix a bug in buzhug_algos when selecting by range
Version 1.4
- add boolean type
- default value for fields can be specified in create() and modified by
  set_default(field_name,default)
- change conversion of float 0.0 (diidn't preserve order for small positive 
floats)
- move methods to manage db information to new module buzhug_info.py
- add negative indexing. db[-1] returns the last inserted record
Version 1.5
- add thread-safe version class TS_Base
- introduce syntax db(key1=value2[,key2=value2...])
- allow an iterable of records for update
- fix bug in Base.has_key(), UnicodeFile.from_block()
Version 1.6
- minor bug fix in conversion_float.py
- add licence text
Version 1.7
- fix bug in thread-safe version
Version 1.8
- bug in select_for_update if used with a list of fields instead of None
- bug in __init__.py
"""

import os
import threading
import cStringIO
import itertools
import token
import tokenize
import re
import tempfile
import shutil
import urllib

import time
from datetime import date,datetime, time as dtime

# compatibility with Python 2.3
try:
    set([1])
except NameError:
    from sets import Set as set

from buzhug_files import *
import buzhug_algos
import buzhug_info

version = "1.8"

# ------------------------
# The following classes are used to modelize the objects in the
# database
#
# Each record is an instance of the class Record, which is a list
# supporting lookup by attributes. The list of attributes is defined in the
# class attribute 'fields', the list of the types of the attributes
# is defined in the list 'types'. Lookup by index returns the
# raw blocks read from the files ; lookup by attribute returns original
# values with their type. For instance, if fields = ['age'] and
# types = [ int ], record[0] will return a string representation
# of the age, record.age will return the original age (an integer)
# ------------------------

class Record(list):
    """Generic class for records"""

    def __getattr__(self,k):
        try:
            ix = self.fields.index(k)
        except ValueError:
            raise AttributeError,'No attribute named %s' %k
        try:
            return self.db.f_decode[self.types[ix]](list.__getitem__(self,ix))
        except:
            print 'error for key %s type %s value %s' %(k,self.types[ix],
                list.__getitem__(self,ix))
            raise

    def __setattr__(self,k,v):
        try:
            ix = self.fields.index(k)
            self[ix] = self.db.f_encode[self.types[ix]](v)
        except ValueError:
            list.__setattr__(self,k,v)

    def __repr__(self):
        elts = []
        for k in self.fields:
            if not isinstance(getattr(self,k),unicode):
                elts.append('%s:%s' %(k,getattr(self,k)))
            else:
                elts.append(('%s:%s' %(k,getattr(self,k))).encode('utf-8'))
        return '<' + ' '.join(elts) +'>'

    def update(self,**kw):
        self.db.update(self,**kw)

def makeRecordClass(db,record_class,field_names):
    """Generate a subclass of record_class, specifying a Base instance 
    and a list of field names and types"""

    class _Record(record_class):
        pass

    setattr(_Record,'db',db)
    setattr(_Record,'fields',list(field_names))
    setattr(_Record,'types',[ db.fields[f] for f in field_names ])
    return _Record

# -----------------------------------
# The result of selections is an instance of RecordSet, which is a list
# with an attribute "names" (the name of the fields specified in the
# selection). The items in the list are instances of the class Record
#
# Instances of ResultSet support a method sort_by(order), which returns
# the list sorted as specified in the string 'order'
# -----------------------------------
class ResultSet(list):

    def __init__(self,names,_list):
        list.__init__(self,_list)
        self.names = names
    
    def pp(self,width=70):
        """pretty print"""
        col_width = width/len(self.names)
        fmt = '%%-%ss' %col_width
        print '|'.join([fmt %name for name in self.names])
        print '|'.join([fmt %('-'*col_width) for name in self.names])
        for rec in self:
            line = []
            for name in self.names:
                v = fmt %getattr(rec,name)
                if not isinstance(getattr(rec,name),unicode):
                    line.append(v)
                else:
                    enc = line.append(v.encode('latin-1'))
            print '|'.join(line)

    def sort_by(self,order):
        """order is a string with field names separated by + or -
        For instance, sort_by('name + surname - age') sorts by ascending 
        name, ascending surname and descending age"""
        
        # parse the order string
        e = cStringIO.StringIO(order).readline
        cond = []
        order = '+'
        for t in tokenize.generate_tokens(e):
            tt = token.tok_name[t[0]]
            ts = t[1]
            if tt == 'OP':
                if not ts in ['+','-']:
                    raise SyntaxError,"Bad operator in sort condition: %s" %ts
                order = ts
            elif tt == 'NAME':
                if not ts in self.names:
                    raise ValueError,"Unknown sort field :%s" %ts
                cond.append((self.names.index(ts),order))
        # build the function order_func used to sort records
        o_f = "def order_func(rec):\n"
        o_f += "    return ["
        elts = []
        for (ix,order) in cond:
            if order == '+':
                elts.append("rec[%s]" %ix)
            else:
                elts.append("buzhug_algos.rev(rec[%s])" %ix)
        o_f += ",".join(elts) +"]"        
        exec o_f in globals()  # this creates the global function order_func

        # apply the key
        try:
            self.sort(key=order_func)
        except TypeError: # for Python 2.3
            self.sort(lambda x,y: cmp(order_func(x),order_func(y)))
        return self
        
REGEXPTYPE = type(re.compile('a'))
class Pattern:

    def __init__(self,pattern):
        self.pattern = pattern

    def match(self,s):
        return self.pattern.match(s[1:-1])
        
    def search(self,s):
        return self.pattern.search(s[1:-1])
        
# -----------------------
# The class Base is an abstraction of the database. It supports all the
# usual functions : create a new base, open an existing base, insert
# a record, delete a record, select a set of records matching a condition,
# update the values of an existing record, destroy a base
# Each record has an integer attribute called '__id__', a unique and 
# unchangeable identifier
# Deleted records are physically marked for deletion, but not immediately
# removed. When many records have been deleted, they take useless place in 
# the files and slow down the queries ; the cleanup() method gets rid of them
#
# Record selection
# -----------------------
# 1. List comprehensions or generator expressions
# A base supports iteration, allowing for queries using the Python list
# comprehension syntax : [ r.name for r in db if r.age > 20 ]. This is the
# most natural way to express a query and should be used when the response
# time is not crucial. But since it requires a conversion into the original
# values for each line in each file, it is slower than using select
#
# 2. The select method
# The first argument to the select method is always the list of the fields
# to return in the result set. If the empty list is passed, all fields are
# returned
# For simple requests that test equality of a set of fields to a set of 
# values, the syntax is like this : 
#     select(['name','age'],firstname = 'pierre')
# returns the records with attributes name and age for which the first name
# is 'pierre'
# If the value is a 2-item list, select will return the records for which
# the field is between these values :
#    select(['name'],age=[30,35])
# For more complex requests, pass the select function a string with a
# valid Python test on the field names. For internal reasons, no literal
# value should be included in the string ; use variable names and append
# keyword arguments to specifiy their values
# For instance :
#     select(['name','age'],
#            'firstname in c1 and (country = c2 or age > c3)',
#            c1 = ('pierre','paul'),c2='France',c3=30)
# returns the records representing the persons called 'pierre' or 'paul', 
# either from France or older than 30 years
#
# 3. Selection by record id
# Returned by db[id]. The implementation makes lookup by id almost immediate,
# regardless of the size of the file
# -----------------------

class ConflictError(Exception):
    """Raised if trying to update a record that has changed since selection"""
    pass

class UpdateError(Exception):
    """Raised if update is called on a record not selected for update"""
    pass

class TimeFormatError(Exception):
    """Raised if an invalid time format is provided to set_string_format"""
    pass


class Base:

    BLOCKSIZE = 131072
    

    types_map = [ (int,IntegerFile),(float,FloatFile),
            (str,StringFile),(unicode,UnicodeFile),
            (date,DateFile),(datetime,DateTimeFile), (dtime, TimeFile),
            (bool,BooleanFile)]

    def __init__(self,basename,thread_safe=False):
        self.name = self.__name__ = basename
        self.types = {} # key = data class name, value = data class
        self.file_types = {} # key = data class, value = file class
        self.f_encode = {} # key = data class, value = function to_block
        self.f_decode = {} # key = data class, value = function from_block
        self.info_name = os.path.join(basename,'__info__')
        self.pos_name = os.path.join(basename,'__pos__')
        for (c_obj,c_file) in self.types_map:
                self._register_class(c_obj,c_file)
        # from_string[_class] is the function used to convert a string
        # into an instance of _class
        self.from_string = { str:lambda x:x, int:int,
            float:float}
        # class used for the records. Default is Record, but it can 
        # be changed by set_record_class()
        self.record_class = Record

    def set_record_class(self,record_class):
        """Set the base class for records"""
        self.record_class = record_class
        self._full_rec = makeRecordClass(self,self.record_class,
            self.field_names)
        
    def _register_class(self,class_obj,class_file):
        """Register a data type
        class_obj is the data class (eg int)
        class_file is the class used to manage the file that holds
           the data of this class (eg IntegerFile in buzhug_files)
        """
        self.types.update({class_obj.__name__:class_obj})
        self.file_types.update({ class_obj:class_file })
        self.f_encode.update({class_obj:class_file().to_block})
        self.f_decode.update({class_obj:class_file().from_block})

    def _register_base(self,base):
        """Register another base for external references"""
        class ExtFile(ExternalFile):
            pass
        setattr(ExtFile,'db',base)
        self._register_class(base,ExtFile)

    def create(self,*fields,**kw):
        """Creates a database instance and returns a reference to it
        fields are tuples (field_name,field_type[,default_value])
        field_name must not begin by _
        field_type can be one of the values in the dictionary self.types
        A keyword 'mode' can be specified:
           'override' : if the base already exists, remove it and create
                        a new one
           'open' : if the base already exists, open it
        If mode is not set, if the base exists, raise IOError
        In any case, if a directory of the same name exists, raise an
        exception
        """
        mode = kw.get('mode',None)
        if os.path.exists(self.name):
            if os.path.exists(self.info_name):
                if mode == 'override':
                    pass
                elif mode == 'open':
                    return self.open()
                else:
                    raise IOError,"Base %s already exists" %self.name
            else:
                if mode != 'open':
                    raise IOError,"Directory %s already exists" %self.name
                else:
                    raise IOError,"Mode 'open' : " \
                        "Directory %s already exists but no info file found" \
                        %self.name

        self.field_names = [ f[0] for f in fields ]
        self.fields = dict([(f[0],f[1]) for f in fields])
        # set general info about field definition
        buzhug_info.set_info(self,fields)

        self.field_names = ['__id__','__version__'] + self.field_names
        self.fields['__id__'] = int
        self.fields['__version__'] = int
        # create the directory used for the base
        if not os.path.exists(self.name):
            os.mkdir(self.name)
        # create index file
        self._id_pos = IntegerFile(self.name,'_id_pos').create()
        # create positions file
        open(self.pos_name,'wb').close()
        self._pos = PositionFile(self).create()
        # create the file holding a list of the deleted rows (the line number
        # of deleted records in field files)
        self._del_rows = DeletedRowsFile(self.name,"__del_rows__").create()
        # create field files abstractions
        self._file = {}
        for f in self.field_names:
            self._file[f] = self.file_types[self.fields[f]](self.name,f)
            self._file[f].create()
        # save information in files __info__ and __defaults__
        buzhug_info.save_info(self)
        # create class for records with all values set
        self._full_rec = makeRecordClass(self,self.record_class,self.field_names)
        return self

    def open(self):
        """Open an existing database and return a reference to it
        Raise IOError if no base is found for the path entered in __init__
        """
        if not os.path.exists(self.name) or not os.path.isdir(self.name):
            raise IOError,"Base %s doesn't exist" %self.name
        try:
            _info = open(self.info_name,'rb')
        except IOError:
            raise IOError,"No buzhug base in directory %s" %self.name
        return self._open(_info)
        
    def _open(self,info):
        fields = [ f.split(':',1) for f in info.read().split() ]
        info.close()
        self.fields = {}
        for (k,v) in fields:
            if v.startswith('<base>'):
                # reference to an external base
                base_path = urllib.unquote(v[6:])
                ext_db = Base(base_path).open()
                self._register_base(ext_db)
                self.fields[k] = ext_db
            else:
                self.fields[k] = self.types[v]
        self.field_names = [ k for (k,v) in fields ]
        self.encode = dict([(k,self.f_encode[self.fields[k]]) 
            for k in self.field_names])
        self.decode = dict([(k,self.f_decode[self.fields[k]]) 
            for k in self.field_names])
        self._open_files()
        # read default values
        self.defaults = buzhug_info.read_defaults(self)
        return self

    def _open_files(self):
        self._file = {}
        for f in self.field_names:
            self._file[f] = self.file_types[self.fields[f]](self.name,f)
            self._file[f].open()
        self._id_pos = IntegerFile(self.name,'_id_pos').open()
        self._pos = PositionFile(self).open()
        self._del_rows = DeletedRowsFile(self.name,"__del_rows__").open()
        self._full_rec = makeRecordClass(self,self.record_class,
            self.field_names)

    def close(self):
        """Close all files"""
        for f in self._file.values():
            f.close()
        self._pos.close()
        self._id_pos.close()
        self._del_rows.close()

    def destroy(self):
        """Destroy an existing base"""
        for dirpath,dirnames,filenames in os.walk(self.name):
            for filename in filenames:
                os.remove(os.path.join(dirpath,filename))
        os.rmdir(self.name)

    def set_default(self,field_name,default):
        """Set a default value for a field"""
        fields = []
        for f in self.field_names[2:]:
            if f==field_name:
                fields.append((f,self.fields[f],default))
            elif self.defaults[f] is None:
                fields.append((f,self.fields[f]))
            else:
                fields.append((f,self.fields[f],self.defaults[f]))
        buzhug_info.set_info(self,fields)

    def insert(self,*args,**kw):
        """Public method to insert a record
        Data can be entered as a list of values ordered like in create(),
        or as keyword arguments
        Explicit setting of the id and version is forbidden
        If some of the fields are missing the value is set to None
        Return the identifier of the newly inserted record
        """
        if args and kw:
            raise SyntaxError,"Can't use both positional and keyword arguments"
        if args:
            # insert a list of values ordered like in the base definition
            if not len(args) == len(self.field_names)-2:
                raise TypeError,"Expected %s arguments, found %s" \
                   %(len(self.field_names)-2,len(args))
            return self.insert(**dict(zip(self.field_names[2:],args)))
        if '__id__' in kw.keys():
            raise NameError,"Specifying the __id__ is not allowed"
        if '__version__' in kw.keys():
            raise NameError,"Specifying the __version__ is not allowed"
        rec = dict([(f,self.defaults[f]) for f in self.field_names[2:]])
        for (k,v) in kw.iteritems():
            self._validate(k,v)
            rec[k] = v
        # initial version = 0
        rec['__version__'] = 0
        # get position in field files
        pos = [ self._file[f].get_end_pos() for f in self.field_names ]
        # insert values in field files for field names except __id__
        for f in self.field_names[1:]:
            self._file[f].insert(rec[f])
        # insert positions in the position file
        _id,line_num = [ int(v) for v in self._pos.insert(pos) ]
        # insert id value in file __id__
        self._file['__id__'].insert(_id)
        # line_num is the line number in the position file
        self._id_pos.insert(line_num)
        return _id

    def set_string_format(self,class_,format):
        """Specify the format used to convert a string into an instance
        of the class. class_ can be:
        - unicode : the format is the encoding
        - date, datetime : format = the format string as defined in strftime
        """
        if class_ is unicode:
            # test encoding ; will raise LookupError if invalid
            unicode('a').encode(format)
            # create the conversion function bytestring -> unicode string
            def _from_string(us):
                return unicode(us,format)
            self.from_string[unicode] = _from_string
        elif class_ is date:
            # test date format
            d = date(1994,10,7)
            t = time.strptime(d.strftime(format),format)
            if not t[:3] == d.timetuple()[:3]:
                raise TimeFormatError,'%s is not a valid date format' %format
            else:
                # create the conversion function string -> date
                def _from_string(ds):
                    return date(*time.strptime(ds,format)[:3])
                self.from_string[date] = _from_string
        elif class_ is datetime:
            # test datetime format
            dt = datetime(1994,10,7,8,30,15)
            t = time.strptime(dt.strftime(format),format)
            if not t[:6] == dt.timetuple()[:6]:
                raise TimeFormatError,'%s is not a valid datetime format' \
                    %format
            else:
                # create the conversion function string -> date
                def _from_string(dts):
                    return datetime(*time.strptime(dts,format)[:6])
                self.from_string[datetime] = _from_string
        elif class_ is dtime:
            # test datetime format
            dt = dtime(8,30,15)
            t = time.strptime(dt.strftime(format),format)
            if not t[3:6] == (dt.hour, dt.minute, dt.second):
                raise TimeFormatError,'%s is not a valid datetime.time format' \
                    %format
            else:
                # create the conversion function string -> dtime
                def _from_string(dts):
                    return dtime(*time.strptime(dts,format)[3:6])
                self.from_string[dtime] = _from_string
        else:
            raise ValueError,"Can't specify a format for class %s" %class_

    def insert_as_strings(self,*args,**kw):
        """Insert a record with values provided as strings. They must be
        converted into their original types according to the conversion
        functions defined in the dictionary from_string
        """
        if args and kw:
            raise SyntaxError,"Can't use both positional and keyword arguments"
        if args:
            # insert a list of strings ordered like in the base definition
            if not len(args) == len(self.field_names)-2:
                raise TypeError,"Expected %s arguments, found %s" \
                   %(len(self.field_names)-2,len(args))
            return self.insert_as_strings(**dict(zip(self.field_names[2:],
                args)))
        return self.insert(**self.apply_types(**kw))

    def apply_types(self,**kw):
        """Transform the strings in kw values to their type
        Return a dictionary with the same keys and converted values"""
        or_kw = {}
        for k in kw.keys():
            try:
                t = self.fields[k]
            except KeyError:
                raise NameError,"No field named %s" %k
            if not self.from_string.has_key(t):
                raise Exception,'No string format defined for %s' %t
            else:
                try:
                    or_kw[k] = self.from_string[t](kw[k])
                except:
                    raise TypeError,"Can't convert %s into %s" %(kw[k],t)
        return or_kw

    def commit(self):
        """Save all changes on disk"""
        self.close()
        self._open_files()
        
    def delete(self,records):
        """Remove the items in the iterable records"""
        if issubclass(records.__class__,Record):
            # individual record
            records = [records]
        _ids = [ r.__id__ for r in records ]
        _ids.sort()

        # mark blocks in field files as deleted
        for _id in _ids:
            # get the line number in the position file
            _line_in_pos = self._id_pos.get_value_at_pos(_id*5)
            # get the positions in field files
            delete_pos = self._pos.from_block(
                self._pos.get_block_at(_line_in_pos))
            # mark the items in field files as deleted
            for dp,f in zip(delete_pos,self.field_names):
                self._file[f].mark_as_deleted(dp)
            # the line number in field files is saved in _del_rows
            self._del_rows.insert(delete_pos[0]/5)
            # mark line in position file as deleted
            self._pos.remove(_line_in_pos)
            # mark line in _id_pos as deleted
            self._id_pos.mark_as_deleted(_id*5)
        self._pos.deleted_lines.sort()

    def cleanup(self):
        """Physically remove the deleted items in field files
        This is required after many records have been deleted and
        occupy useless space on disk
        """
        temp_files = [tempfile.TemporaryFile() for f in self.field_names]
        # count number of lines in position file
        lnum = 0
        for l in self._pos:
            lnum += 1
        for _id in range(lnum):
            pos_block = self._pos.get_block_at(_id)
            if not pos_block[0] == '#':
                positions = self._pos.from_block(pos_block)
                new_pos = [] 
                for i,f in enumerate(self.field_names):
                    new_pos.append(temp_files[i].tell())
                    block = self._file[f].get_block_at_pos(positions[i])
                    temp_files[i].write(block)
                self._pos.update_positions(_id,new_pos)

        # delete old files, replace them by temp files
        for i,f in enumerate(self.field_names):
            self._file[f].close()
            self._file[f].create()
            temp_files[i].seek(0)
            shutil.copyfileobj(temp_files[i],self._file[f])
            # explicitely close the temporary file
            temp_files[i].close()
        self.commit()
        # reset deleted rows file
        self._del_rows = DeletedRowsFile(self.name,"__del_rows__").create()

    def select(self,names=None,request=None,**args):
        """Select the records in the base that verify a predicate and return
        the specified names. If names is [] or None then all the fields are 
        returned
        
        The predicate can be expressed :
        - by a request string and keyword arguments for the values
        - by field_name = value keywords to test equality of fields to values

        Return an instance of ResultSet
        
        Examples :
        db.select() # return all the records in the base
        db.select(['name']) # return the value of field name 
                            # for all the records in the base
        db.select(None,age=30) # return the records with age = 30 
                               # with all fields set
        db.select(['name'],age=30) # return the same list with only the
                               # field 'name' set (faster)
        db.select(['name'],'age > c',c=30) # records with age > 30 and
                               # only field 'name' set
        """
        res,names = self._select(names,request,**args)
        return ResultSet(names,res.values())
    
    def select_for_update(self,names=None,request=None,**args):
        """Same syntax as select, only checks that the field __version__
        is returned. This field is used for concurrency control ; if
        a user selects a record, then updates it, the program checks if the
        version on disk is the same as the users's version ; if another
        user has updated it in the meantime it will have changed
        
        select_for_update takes a little more time than select, this is
        why there are two different methods"""
        if not names:
            names = self.field_names
        else:
            names += [ f for f in ['__id__','__version__'] if not f in names ]
        res,names = self._select(names,request,**args)
        return ResultSet(names,res.values())

    def __call__(self,**kw):
        return self.select_for_update(**kw)

    def _select(self,_names,_request,**args):
        """Private method that performs actual selection
        The field files are browsed line by line. A test function is built
        to compare the raw data found in these files to the arguments
        The arguments are first converted to a string that can be compared
        to the raw data found in the files
        This is much faster than converting the raw data into their
        original type and compare the result to the arguments
        """

        if not _names: # names unspecified or None
            _names = self.field_names

        _namespace = {}
        if args.has_key('_namespace'):
            _namespace = args['_namespace']
            del args['_namespace']

        # If there are regular expression objects in the keywords,
        # transform them into instances of the class Pattern
        # The methods match and search of these instances will return
        # the return value of match and search applied to the string
        # stripped from its first and last character
        regexps = []
        for k,v in args.iteritems():
            if type(v) is REGEXPTYPE:
                _namespace[k] = Pattern(v)
                regexps.append(k)

        # remove these keywords from args, they are in _namespace
        for k in regexps:
            del args[k]

        if _request is None:
            f_args = [ k for k in args.keys() 
                if hasattr(self._file[k],'block_len') ]
            # if there is at least one fixed length field to search, use the
            # fast_select algorithm
            if f_args:
                res,names = buzhug_algos.fast_select(self,_names,**args)
                _Record = makeRecordClass(self,self.record_class,names)
                for k in res.keys():
                    res[k] = _Record(res[k])
                return res,names
            conds = []
            for i,k in enumerate(args.keys()):
                conds.append('%s == _c[%s]' %(k,i))
            _request = ' and '.join(conds)
            _c = []
            for (k,v) in args.iteritems():
                t = self.fields[k]  # field type
                if isinstance(v,(tuple,list)):
                    _c.append([self.f_encode[t](x) for x in v])
                else:
                    _c.append(self.f_encode[t](v))
            for n in args.keys():
                if not n in _names:
                    _names.append(n)
        else:
            for (k,v) in args.iteritems():
                if isinstance(v,Record):
                    # comparison with a record of another base
                    ft = self.file_types[self.types[v.db.name]]
                    args[k] = ft().to_block(v)
                elif isinstance(v,(tuple,list)):
                    args[k] = [ self.f_encode[x.__class__](x) for x in v ]
                else:
                    args[k] = self.file_types[v.__class__]().to_block(v)

        w1 = [ re.compile(r'\b(?P<name>%s)\b' %f) for f in self.field_names ]
        # get field names in _request and not in names
        for n in w1:
            mo = n.search(_request)
            if mo:
                name = mo.group('name')
                if not name in _names:
                    _names.append(name)

        # replace field names by their rank in record
        def repl(mo):
            return '_rec[%s]' %_names.index(mo.group('name'))

        w = [ re.compile(r'\b(?P<name>%s)\b' %f) for f in _names ]
        for n in w:
            _request = n.sub(repl,_request)

        # generate the loop to browse the files and test each set of results
        _res = {}
        loop = "for num,_rec in enumerate(self._iterate(*_names)):\n"
        if _request:
            loop +="    if %s:\n" %_request
        else:
            # _request is empty : select all items 
            # except those marked as deleted
            loop +="    if _rec[0][0] != '#':\n"
        loop +="        _res[num] = _rec"

        # prepare namespace
        args.update(_namespace)

        # execute the loop
        exec loop in locals(),args

        # exclude deleted rows from the results
        if self._del_rows.deleted_rows:
            _to_delete = set(_res.keys()) & set(self._del_rows.deleted_rows)
            for k in _to_delete:
                del _res[k]
        
        # return the list of selected items, with return fields set
        return _res,_names

    def update(self,record,**kw):
        """Update the record with the values in kw
        If only fixed length fields have changed, simply put the new values
        at the same position in field files
        Otherwise, remove existing record then insert the new version"""
        if not isinstance(record,Record) \
            and isinstance(record,(list,tuple)):
            for rec in record:
                self.update(rec,**kw)
            return
        only_fixed_length = True
        if '__id__' in kw.keys():
            raise NameError,"Can't update __id__"
        if '__version__' in kw.keys():
            raise NameError,"Can't update __version__"
        for (k,v) in kw.iteritems():
            self._validate(k,v)
            setattr(record,k,v)
            if not hasattr(self.file_types[self.fields[k]],
                'block_len'):
                only_fixed_length = False

        if not hasattr(record,'__id__') or not hasattr(record,'__version__'):
            # refuse to update a record that was not selected for update
            raise UpdateError,'The record was not selected for update'

        _id = record.__id__
        # line number of the record in position file
        _line_in_pos = self._id_pos.get_value_at_pos(5*_id)
        
        # if the record was selected for update it has a __version__
        # attribute. If the version for the same id in the position
        # file is not the same, refuse to update
        current_version = self[_id].__version__
        if not record.__version__ == current_version:
            raise ConflictError,'The record has changed since selection'

        # increment version
        record.__version__ += 1
        # position of blocks in field files
        field_pos = self._pos.from_block(self._pos.get_block_at(_line_in_pos))

        if only_fixed_length:
            # only fixed length fields modified : just change the values
            kw['__version__'] = record.__version__
            for k,v in kw.iteritems():
                ix = self.field_names.index(k)
                self._file[k].write_value_at_pos(field_pos[ix],v)
        else:
            # the record to update may not have all the database fields
            # for missing fields, just write a copy at the end of field file
            new_pos = {}
            missing_fields = [ (i,f) for (i,f) in enumerate(self.field_names)
                if not hasattr(record,f) ]
            for i,f in missing_fields:
                pos = field_pos[i]
                block = self._file[f].get_block_at_pos(pos)
                new_pos[f] = self._file[f].get_end_pos()
                self._file[f].write(block)
                self._file[f].seek(0,2)

            # record fields
            set_fields = [ f for f in self.field_names if hasattr(record,f) ]
            # write new values in field files
            for f in set_fields:
                new_pos[f] = self._file[f].get_end_pos()
                self._file[f].insert(getattr(record,f))

            # update positions in the position file
            pos = [ new_pos[f] for f in self.field_names ]
            self._pos.update(_line_in_pos,pos)

            # for previous version of the record, 
            # mark row in field files as deleted
            for dp,f in zip(field_pos,self.field_names):
                self._file[f].mark_as_deleted(dp)
            # add a deleted row
            self._del_rows.insert(field_pos[0]/5)

    def add_field(self,field_name,field_type,after=None,default=None):
        """Add a new field after the specified field, or in the beginning if
        no field is specified"""
        if field_name in self.field_names:
            raise NameError,"Field %s already exists" %field_name
        field_def = [field_name,field_type]
        if default is not None:
            field_def.append(default)

        # validate field and update dictionary defaults
        buzhug_info.validate_field(self,field_def)

        if after is None:
            indx = 2 # insert after __version__
        elif not after in self.field_names:
            raise NameError,"No field named %s" %after
        else:
            indx = 1+self.field_names.index(after)
        self.field_names.insert(indx,field_name)
        self.fields[field_name] = field_type
        # create field file
        self._file[field_name] = \
            self.file_types[self.fields[field_name]](self.name,field_name)
        self._file[field_name].create()
        # populate field file with default value and update position file
        self._pos.add_field(field_name,indx,default)
        buzhug_info.save_info(self)
        self._full_rec = makeRecordClass(self,self.record_class,
            self.field_names)

    def drop_field(self,field_name):
        """Remove the specified field name"""
        if not field_name in self.field_names:
            raise NameError,"No field named %s" %field_name
        if field_name == '__id__':
            raise ValueError,"Field __id__ can't be removed"
        if field_name == '__version__':
            raise ValueError,"Field __version__ can't be removed"
        indx = self.field_names.index(field_name)
        self.field_names.remove(field_name)
        del self.defaults[field_name]
        buzhug_info.save_info(self)
        del self.fields[field_name]
        del self._file[field_name]
        self._pos.drop_field(field_name,indx)
        self._full_rec = makeRecordClass(self,self.record_class,
            self.field_names)

    def _validate(self,k,v):
        """Validate the couple key,value"""
        if not k in self.fields.keys():
            raise NameError,"No field named %s" %k
        if v is None:
            return
        # if self.fields[k] is an instance of Base, the value must be an
        # instance of a subclass of Record with its class attribute 
        # db == self.fields[k]
        if isinstance(self.fields[k],Base):
            if not issubclass(v.__class__,Record):
                raise TypeError,"Bad type for %s : expected %s, got %s %s" \
                      %(k,self.fields[k],v,v.__class__)
            if v.__class__.db.name != self.fields[k].name:
                raise TypeError,"Bad base for %s : expected %s, got %s" \
                      %(k,self.fields[k].name,v.__class__.db.name)
        else:
            if not isinstance(v,self.fields[k]):
                raise TypeError,"Bad type for %s : expected %s, got %s %s" \
                      %(k,self.fields[k],v,v.__class__)

    def _iterate(self,*names):
        """_iterate on the specified names only"""
        Record = makeRecordClass(self,self.record_class,names)
        files = [ self._file[f] for f in names ]
        for record in itertools.izip(*files):
            yield Record(record)

    def __getitem__(self,num):
        """Direct access by record id"""
        if num<0:
            num = len(self)+num
        # first find the line in position file
        block_pos = self._id_pos.get_block_at_pos(5*num)
        if block_pos[0] == '#':
            raise IndexError,'No item at position %s' %num
        else:
            _id_pos = self._id_pos.from_block(block_pos)
        # block in position file
        p_block = self._pos.get_block_at(_id_pos)
        pos = self._pos.from_block(p_block)
        record = [ self._file[f].get_block_at_pos(p)
            for (f,p) in zip(self.field_names,pos) ]
        rec = self._full_rec(record)
        return rec

    def __delitem__(self,num):
        """Delete the item at id num"""
        self.delete([self[num]])

    def __len__(self):
        return self._pos._count

    def has_key(self,num):
        # first find the line in position file
        block_pos = self._id_pos.get_block_at_pos(5*num)
        if not block_pos or block_pos[0] == '#':
            return False
        return True

    def __contains__(self,num):
        return self.has_key(num)

    def keys(self):
        return [ r.__id__ for r in self.select(['__id__']) ]

    def __iter__(self):
        """Iterate on all records
        XXX TO DO : optimize : if no deleted record, 
        remove the test record[0][0] != "#"
        """
        files = [ self._file[f] for f in self.field_names ]
        for record in itertools.izip(*files):
            if record[0][0] != "#":
                r = self._full_rec(record)
                yield r

# thread-safe base ; copied from the logging module
_lock = None

def _acquireLock():
    """
    Acquire the module-level lock for serializing access to shared data.

    This should be released with _releaseLock().
    """
    global _lock
    if (not _lock):
        _lock = threading.RLock()
    if _lock:
        _lock.acquire()

def _releaseLock():
    """
    Release the module-level lock acquired by calling _acquireLock().
    """
    if _lock:
        _lock.release()

class TS_Base(Base):

    def create(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.create(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def open(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.open(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def close(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.close(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def destroy(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.destroy(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def set_default(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.set_default(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def insert(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.insert(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def update(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.update(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def delete(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.delete(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def cleanup(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.cleanup(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def commit(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.commit(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def add_field(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.add_field(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    def drop_field(self,*args,**kw):
        _acquireLock()
        try:
            res = Base.drop_field(self,*args,**kw)
        finally:
            _releaseLock()
        return res

    