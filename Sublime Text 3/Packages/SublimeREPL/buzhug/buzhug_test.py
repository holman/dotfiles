import os
import random
import re

from datetime import date, datetime, time as dtime
from buzhug import Base, TS_Base, Record
import buzhug,buzhug_files


names = ['pierre','claire','simon','camille','jean',
    'florence','marie-anne']
fr_names = [ 'andr\x82','fran\x87ois','h\x82l\x8ane' ] # latin-1 encoding

def run_test(thread_safe=False):

    if not thread_safe:
        db = Base(r'dummy') 
    else:
        db = TS_Base('dummy')

    db.create(('name',str), ('fr_name',unicode),
        ('age',int),
        ('size',int,300),
        ('birth',date,date(1994,1,14)),
        ('afloat',float,1.0),
        ('birth_hour', dtime,dtime(10,10,10)),
        mode='override')

    # test float conversions
    if thread_safe is False:
        f = db._file["afloat"]
        def all(v):
            return [ord(c) for c in v]

        for i in range(10):
            afloat = random.uniform(-10**random.randint(-307,307),
                    10**random.randint(-307,307))
            try:
                assert cmp(afloat,0.0) == cmp(f.to_block(afloat),f.to_block(0.0))
            except:
                print afloat
                print "afloat > 0.0 ?",afloat>0.0
                print "blocks ?",f.to_block(afloat)>f.to_block(0.0)
                print all(f.to_block(afloat)),all(f.to_block(0.0))
                raise

    assert db.defaults["age"] == None
    assert db.defaults["size"] == 300
    assert db.defaults["afloat"] == 1.0
    assert db.defaults["birth_hour"] == dtime(10,10,10)
    assert db.defaults["birth"] == date(1994,1,14)

    for i in range(100):
        db.insert(name=random.choice(names),
             fr_name = unicode(random.choice(fr_names),'latin-1'),
             age=random.randint(7,47),size=random.randint(110,175),
             birth=date(random.randint(1858,1999),random.randint(1,12),10),
             afloat = random.uniform(-10**random.randint(-307,307),
                10**random.randint(-307,307)),
             birth_hour = dtime(random.randint(0, 23), random.randint(0, 59), random.randint(0, 59)))

    assert len(db)==100
    assert isinstance(db[50].fr_name,unicode)
    print db[50].fr_name.encode('latin-1')

    db.open()
    # test if default values have not been modified after open()
    assert db.defaults["age"] == None
    assert db.defaults["size"] == 300
    assert db.defaults["afloat"] == 1.0
    assert db.defaults["birth_hour"] == dtime(10,10,10)
    assert db.defaults["birth"] == date(1994,1,14)

    for i in range(5):
        # insert a list
        db.insert(random.choice(names),
             unicode(random.choice(fr_names),'latin-1'),
             random.randint(7,47),random.randint(110,175),
             date(random.randint(1958,1999),random.randint(1,12),10),
             random.uniform(-10**random.randint(-307,307),
                10**random.randint(-307,307)),
             dtime(random.randint(0, 23), random.randint(0, 59), random.randint(0, 59)))
        db.insert(name=random.choice(names)) # missing fields
        for field in db.field_names[2:]:
            if field == "name":
                continue
            try:
                assert getattr(db[-1],field) == db.defaults[field]
            except:
                print "attribute %s not set to default value %s" %(field,db[-1])
                raise

    # insert as string
    db.set_string_format(unicode,'latin-1')
    db.set_string_format(date,'%d-%m-%y')
    db.set_string_format(dtime,'%H-%M-%S')
    db.insert_as_strings(name="testname",fr_name=random.choice(fr_names),
        age=10,size=123,birth="07-10-95", birth_hour="20-53-3")

    assert db[-1].birth == date(1995,10,7)
    assert db[-1].name == "testname"
    assert db[-1].age == 10
    assert db[-1].afloat == db.defaults["afloat"]

    db.insert_as_strings("testname",random.choice(fr_names),
        11,134,"09-12-94",1.0, "5-6-13")

    assert db[len(db)-1].birth == date(1994,12,9)
    assert db[-1].name == "testname"
    assert db[-1].age == 11
    assert db[-1].size == 134
    assert db[-1].afloat == 1.0

    # search between 2 dates
    print '\nBirth between 1960 and 1970'
    for r in db.select(None,birth=[date(1960,1,1),date(1970,12,13)]):
        print r.name,r.birth

    print "sorted"
    for r in db.select(None,birth=[date(1960,1,1),date(1970,12,13)]).sort_by('+name-birth'):
        print r.name,r.birth

    f = buzhug_files.FloatFile().to_block
    def all(v):
        return [ord(c) for c in f(v)]

    # search between 2 floats

    # selection by list comprehension
    s1 = [ r for r in db if 0.0 <= r.afloat <= 1e50 ]
    # selection by select
    s2 = db.select(None,'x<=afloat<=y',x=0.0,y=1e50)
    # selction by select with interval
    s3 = db.select(None,afloat=[0.0,1e50])

    try:
        assert len(s1) == len(s2) == len(s3)
    except:
        print "%s records by list comprehension, " %len(s1)
        print "%s by select by formula," %len(s2)
        print "%s by select by interval" %len(s3)

    for r in s1:
        try:
            assert r in s2
        except:
            print all(r.afloat)

    for r in s2:
        try:
            assert r in s1
        except:
            print "in select but not in list comprehension",r
            raise
    r = db[0]
    assert r.__class__.db is db

    fr=random.choice(fr_names)
    s1 = [ r for r in db if r.age == 30 and r.fr_name == unicode(fr,'latin-1')]
    s2 = db.select(['name','fr_name'],age=30,fr_name = unicode(fr,'latin-1'))

    assert len(s1)==len(s2)

    # different ways to count the number of items
    assert len(db)  == sum([1 for r in db]) == len(db.select(['name']))

    # check if version number is correctly incremented
    for i in range(5):
        recs = db.select_for_update(['name'],'True')
        version = recs[0].__version__
        recs[0].update()
        assert db[0].__version__ == version + 1

    # check if cleanup doesn't change db length
    length_before = len(db)
    db.cleanup()
    assert len(db) == length_before

    # check if selection by select on __id__ returns the same as direct
    # access by id
    recs = db.select([],'__id__ == c',c=20)
    assert recs[0] == db[20]

    # check that has_key returns False for invalid hey
    assert not db.has_key(1000)

    # drop field
    db.drop_field('name')
    # check if field was actually removed from base definition and rows
    assert not "name" in db.fields
    assert not hasattr(db[20],"name")

    # add field
    db.add_field('name',str,default="marcel")
    # check if field was added with the correct default value
    assert "name" in db.fields
    assert hasattr(db[20],"name")
    assert db[20].name == "marcel"

    # change default value
    db.set_default("name","julie")
    db.insert(age=20)
    assert db[-1].name == "julie"

    # delete a record

    db.delete([db[10]])
    # check if record has been deleted
    try:
        print db[10]
        raise Exception,"Row 10 should have been deleted"
    except IndexError:
        pass

    assert 10 not in db
    assert len(db) == length_before

    # selections    

    # selection by generator expression
    # age between 30 et 32
    d_ids = []
    for r in [r for r in db if 33> r.age >= 30]:
        d_ids.append(r.__id__)

    length = len(db)
    # remove these items
    db.delete([r for r in db if 33> r.age >= 30])
    # check if correct number of records removed
    assert len(db) == length - len(d_ids)
    # check if all records have been removed
    assert not [r for r in db if 33> r.age >= 30]

    # updates
    # select name = pierre
    s1 = db.select(['__id__','name','age','birth'],name='pierre')
    # make 'pierre' uppercase
    for record in db.select_for_update(None,'name == x',x='pierre'):
        db.update(record,name = record.name.upper())
    # check if attribute was correctly updated
    for rec in s1:
        assert db[rec.__id__] == "Pierre"

    # increment ages
    for record in db.select_for_update([],'True'):
        age = record.age
        if not record.age is None:
            db.update(record,age = record.age+1)
            # check
            assert db[record.__id__].age == age + 1

    for record in [r for r in db]:
        age = record.age
        if not record.age is None:
            db.update(record,age = record.age+1)
            # check
            assert db[record.__id__].age == age + 1

    # change dates
    for record in db.select_for_update([],'age>v',v=35):
        db.update(record,birth = date(random.randint(1958,1999),
                                random.randint(1,12),10))

    db.commit()

    # check length after commit
    assert sum([1 for r in db]) == len(db)

    # insert new records
    for i in range(50):
        db.insert(name=random.choice(names),
             age=random.randint(7,47),size=random.randint(110,175))

    # check that record 10 is still deleted
    try:
        print db[10]
        raise Exception,"Row 10 should have been deleted"
    except IndexError:
        pass

    print db.keys()
    print "has key 10 ?",db.has_key(10)
    assert 10 not in db
    #raw_input()

    # check that deleted_lines was cleared by commit()
    assert not db._pos.deleted_lines
    print db._del_rows.deleted_rows

    length = len(db) # before cleanup

    # physically remove the deleted items    
    db.cleanup()
    # check that deleted_lines and deleted_rows are clean
    assert not db._pos.deleted_lines
    assert not db._del_rows.deleted_rows

    # check that record 10 is still deleted
    try:
        print db[10]
        raise Exception,"Row 10 should have been deleted"
    except IndexError:
        pass

    assert 10 not in db

    # check that length was not changed by cleanup
    assert len(db) == length
    assert len([ r for r in db]) == length

    # age > 30
    for r in db.select(['__id__','name','age'],
        'name == c1 and age > c2',
        c1 = 'pierre',c2 = 30):
        assert r.name == "pierre"
        assert r.age > 30

    # name =="PIERRE" and age > 30
    for r in db.select(['__id__','name','age','birth'],
                'name == c1 and age > c2',
                c1 = 'PIERRE',c2 = 30):
        assert r.name == 'PIERRE'
        assert r.age > 30

    # test with !=
    for r in db.select(['__id__'],'name != c1',c1='claire'):
        assert r.name != 'claire'

    # age > id
    # with select
    s1 = db.select(['name','__id__','age'],'age > __id__')
    for r in s1:
        assert r.age > r.__id__
    # with iter
    s2 = [ r for r in db if r.age > r.__id__ ]
    for r in s2:
        assert r.age > r.__id__

    assert len(s1) == len(s2)

    # birth > date(1978,1,1)
    # with select
    s1 = db.select(['name','__id__','age'],'birth > v',v=date(1978,1,1))
    for r in s1:
        assert r.birth > date(1978,1,1)
    # with iter

    s2 = [ r for r in db if r.birth and r.birth > date(1978,1,1) ]
    for r in s2:
        assert r.birth > date(1978,1,1)

    assert len(s1) == len(s2)

    # test with floats
    for i in range(10):
        x = random.uniform(-10**random.randint(-307,307),
                10**random.randint(-307,307))
        s1 = [ r for r in db if r.afloat > x ]
        s2 = db.select(['name'],'afloat > v',v=x)
        assert len(s1)==len(s2)

    # base with external link
    houses = Base('houses')
    houses.create(('address',str),('flag',bool),('resident',db,db[0]),mode="override")

    addresses = ['Giono','Proust','Mauriac','Gide','Bernanos','Racine',
        'La Fontaine']
    ks = db.keys()
    for i in range(50):
        x = random.choice(ks)
        address = random.choice(addresses)
        houses.insert(address=address,flag = address[0]>"H",resident=db[x])

    # houses with jean
    s1 = []
    for h in houses:
        if h.resident.name == 'jean':
            s1.append(h)

    # by select : ???
    #s2 = houses.select([],'resident.name == v',v='jean')
    # assert len(s1) == len(s2)

    h1 = Base('houses')
    h1.open()

    l1 = len(h1.select([],flag=True))
    l2 = len(h1.select([],flag=False))
    assert l1 + l2 == len(h1)

    class DictRecord(Record):
        def __getitem__(self, k):
            item = self
            names = k.split('.')
            for name in names:
                item = getattr(item, name)
            return item

    h1.set_record_class(DictRecord)
    print '\nrecord_class = DictRecord, h1[0]'
    print h1[0]
    print "\nResident name: %(resident.name)s\nAddress: %(address)s" % h1[0]

if __name__ == "__main__":
    run_test(thread_safe = True)
    run_test(thread_safe = False)