# -*- coding: utf-8 -*-
"""
All character set and unicode related tests.
"""
from jedi._compatibility import u, unicode


def test_unicode_script(Script):
    """ normally no unicode objects are being used. (<=2.7) """
    s = unicode("import datetime; datetime.timedelta")
    completions = Script(s).completions()
    assert len(completions)
    assert type(completions[0].description) is unicode

    s = u("author='öä'; author")
    completions = Script(s).completions()
    x = completions[0].description
    assert type(x) is unicode

    s = u("#-*- coding: iso-8859-1 -*-\nauthor='öä'; author")
    s = s.encode('latin-1')
    completions = Script(s).completions()
    assert type(completions[0].description) is unicode


def test_unicode_attribute(Script):
    """ github jedi-vim issue #94 """
    s1 = u('#-*- coding: utf-8 -*-\nclass Person():\n'
           '    name = "e"\n\nPerson().name.')
    completions1 = Script(s1).completions()
    assert 'strip' in [c.name for c in completions1]
    s2 = u('#-*- coding: utf-8 -*-\nclass Person():\n'
           '    name = "é"\n\nPerson().name.')
    completions2 = Script(s2).completions()
    assert 'strip' in [c.name for c in completions2]


def test_multibyte_script(Script):
    """ `jedi.Script` must accept multi-byte string source. """
    try:
        code = u("import datetime; datetime.d")
        comment = u("# multi-byte comment あいうえおä")
        s = (u('%s\n%s') % (code, comment)).encode('utf-8')
    except NameError:
        pass  # python 3 has no unicode method
    else:
        assert len(Script(s, 1, len(code)).completions())


def test_goto_definition_at_zero(Script):
    """At zero usually sometimes raises unicode issues."""
    assert Script("a", 1, 1).goto_definitions() == []
    s = Script("str", 1, 1).goto_definitions()
    assert len(s) == 1
    assert list(s)[0].description == 'class str'
    assert Script("", 1, 0).goto_definitions() == []


def test_complete_at_zero(Script):
    s = Script("str", 1, 3).completions()
    assert len(s) == 1
    assert list(s)[0].name == 'str'

    s = Script("", 1, 0).completions()
    assert len(s) > 0


def test_wrong_encoding(Script, tmpdir):
    x = tmpdir.join('x.py')
    # Use both latin-1 and utf-8 (a really broken file).
    x.write_binary(u'foobar = 1\nä'.encode('latin-1') + u'ä'.encode('utf-8'))

    c, = Script('import x; x.foo', sys_path=[tmpdir.strpath]).completions()
    assert c.name == 'foobar'


def test_encoding_parameter(Script):
    name = u('hö')
    s = Script(name.encode('latin-1'), encoding='latin-1')
    assert s._module_node.get_code() == name
