"""
std library stuff
"""

# -----------------
# builtins
# -----------------
arr = ['']

#? str()
sorted(arr)[0]

#? str()
next(reversed(arr))
next(reversed(arr))

# should not fail if there's no return value.
def yielder():
    yield None

#? None
next(reversed(yielder()))

# empty reversed should not raise an error
#?
next(reversed())

#? str() bytes()
next(open(''))

#? int()
{'a':2}.setdefault('a', 3)

# Compiled classes should have the meta class attributes.
#? ['__itemsize__']
tuple.__itemsize__
#? []
tuple().__itemsize__

# -----------------
# type() calls with one parameter
# -----------------
#? int
type(1)
#? int
type(int())
#? type
type(int)
#? type
type(type)
#? list
type([])

def x():
    yield 1
generator = type(x())
#? generator
type(x for x in [])
#? type(x)
type(lambda: x)

import math
import os
#? type(os)
type(math)
class X(): pass
#? type
type(X)

# -----------------
# type() calls with multiple parameters
# -----------------

X = type('X', (object,), dict(a=1))

# Doesn't work yet.
#?
X.a
#?
X

if os.path.isfile():
    #? ['abspath']
    fails = os.path.abspath

# The type vars and other underscored things from typeshed should not be
# findable.
#?
os._T


with open('foo') as f:
    for line in f.readlines():
        #? str() bytes()
        line
# -----------------
# enumerate
# -----------------
for i, j in enumerate(["as", "ad"]):
    #? int()
    i
    #? str()
    j

# -----------------
# re
# -----------------
import re
c = re.compile(r'a')
# re.compile should not return str -> issue #68
#? []
c.startswith
#? int()
c.match().start()

#? int()
re.match(r'a', 'a').start()

for a in re.finditer('a', 'a'):
    #? int()
    a.start()

# -----------------
# ref
# -----------------
import weakref

#? int()
weakref.proxy(1)

#? weakref.ref()
weakref.ref(1)
#? int() None
weakref.ref(1)()

# -----------------
# functools
# -----------------
import functools

basetwo = functools.partial(int, base=2)
#? int()
basetwo()

def function(a, b):
    return a, b
a = functools.partial(function, 0)

#? int()
a('')[0]
#? str()
a('')[1]

kw = functools.partial(function, b=1.0)
tup = kw(1)
#? int()
tup[0]
#? float()
tup[1]

def my_decorator(f):
    @functools.wraps(f)
    def wrapper(*args, **kwds):
        return f(*args, **kwds)
    return wrapper

@my_decorator
def example(a):
    return a

#? str()
example('')


# -----------------
# sqlite3 (#84)
# -----------------

import sqlite3
#? sqlite3.Connection()
con = sqlite3.connect()
#? sqlite3.Cursor()
c = con.cursor()

def huhu(db):
    """
        :type db: sqlite3.Connection
        :param db: the db connection
    """
    #? sqlite3.Connection()
    db

# -----------------
# hashlib
# -----------------

import hashlib

#? ['md5']
hashlib.md5

# -----------------
# copy
# -----------------

import copy
#? int()
copy.deepcopy(1)

#?
copy.copy()

# -----------------
# json
# -----------------

# We don't want any results for json, because it depends on IO.
import json
#?
json.load('asdf')
#?
json.loads('[1]')

# -----------------
# random
# -----------------

import random
class A(object):
    def say(self): pass
class B(object):
    def shout(self): pass
cls = random.choice([A, B])
#? ['say', 'shout']
cls().s

# -----------------
# random
# -----------------

import zipfile
z = zipfile.ZipFile("foo")
#? ['upper']
z.read('name').upper

# -----------------
# contextlib
# -----------------

import contextlib
with contextlib.closing('asd') as string:
    #? str()
    string

# -----------------
# operator
# -----------------

import operator

f = operator.itemgetter(1)
#? float()
f([1.0])
#? str()
f([1, ''])

g = operator.itemgetter(1, 2)
x1, x2 = g([1, 1.0, ''])
#? float()
x1
#? str()
x2

x1, x2 = g([1, ''])
#? str()
x1
#? int() str()
x2

# -----------------
# shlex
# -----------------

# Github issue #929
import shlex
qsplit = shlex.split("foo, ferwerwerw werw werw e")
for part in qsplit:
    #? str()
    part

# -----------------
# Unknown metaclass
# -----------------

# Github issue 1321
class Meta(object):
    pass

class Test(metaclass=Meta):
    def test_function(self):
        result = super(Test, self).test_function()
        #? []
        result.

# -----------------
# Enum
# -----------------

# python >= 3.4
import enum

class X(enum.Enum):
    attr_x = 3
    attr_y = 2.0

#? ['mro']
X.mro
#? ['attr_x', 'attr_y']
X.attr_
#? str()
X.attr_x.name
#? int()
X.attr_x.value
#? str()
X.attr_y.name
#? float()
X.attr_y.value
#? str()
X().name
#? float()
X().attr_x.attr_y.value
