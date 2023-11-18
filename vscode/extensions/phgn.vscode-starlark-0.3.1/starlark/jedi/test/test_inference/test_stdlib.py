"""
Tests of various stdlib related things that could not be tested
with "Black Box Tests".
"""
from textwrap import dedent

import pytest


@pytest.mark.parametrize(['letter', 'expected'], [
    ('n', ['name']),
    ('s', ['smart']),
])
def test_namedtuple_str(letter, expected, Script):
    source = dedent("""\
        import collections
        Person = collections.namedtuple('Person', 'name smart')
        dave = Person('Dave', False)
        dave.%s""") % letter
    result = Script(source).completions()
    completions = set(r.name for r in result)
    assert completions == set(expected)


def test_namedtuple_list(Script):
    source = dedent("""\
        import collections
        Cat = collections.namedtuple('Person', ['legs', u'length', 'large'])
        garfield = Cat(4, '85cm', True)
        garfield.l""")
    result = Script(source).completions()
    completions = set(r.name for r in result)
    assert completions == {'legs', 'length', 'large'}


def test_namedtuple_content(Script):
    source = dedent("""\
        import collections
        Foo = collections.namedtuple('Foo', ['bar', 'baz'])
        named = Foo(baz=4, bar=3.0)
        unnamed = Foo(4, '')
        """)

    def d(source):
        x, = Script(source).goto_definitions()
        return x.name

    assert d(source + 'unnamed.bar') == 'int'
    assert d(source + 'unnamed.baz') == 'str'
    assert d(source + 'named.bar') == 'float'
    assert d(source + 'named.baz') == 'int'


def test_nested_namedtuples(Script):
    """
    From issue #730.
    """
    s = Script(dedent('''
        import collections
        Dataset = collections.namedtuple('Dataset', ['data'])
        Datasets = collections.namedtuple('Datasets', ['train'])
        train_x = Datasets(train=Dataset('data_value'))
        train_x.train.'''
    ))
    assert 'data' in [c.name for c in s.completions()]


def test_namedtuple_goto_definitions(Script):
    source = dedent("""
        from collections import namedtuple

        Foo = namedtuple('Foo', 'id timestamp gps_timestamp attributes')
        Foo""")

    from jedi.api import Script

    d1, = Script(source).goto_definitions()

    assert d1.get_line_code() == "class Foo(tuple):\n"
    assert d1.module_path is None


def test_re_sub(Script, environment):
    """
    This whole test was taken out of completion/stdlib.py, because of the
    version differences.
    """
    def run(code):
        defs = Script(code).goto_definitions()
        return {d.name for d in defs}

    names = run("import re; re.sub('a', 'a', 'f')")
    if environment.version_info.major == 2:
        assert names == {'str'}
    else:
        assert names == {'str'}

    # This param is missing because of overloading.
    names = run("import re; re.sub('a', 'a')")
    if environment.version_info.major == 2:
        assert names == {'str', 'unicode'}
    else:
        assert names == {'str', 'bytes'}
