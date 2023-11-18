from textwrap import dedent
import math
import sys
from collections import Counter
from datetime import datetime

import pytest

from jedi.inference import compiled
from jedi.inference.compiled.access import DirectObjectAccess
from jedi.inference.gradual.conversion import _stub_to_python_value_set


def test_simple(inference_state, environment):
    obj = compiled.create_simple_object(inference_state, u'_str_')
    upper, = obj.py__getattribute__(u'upper')
    objs = list(upper.execute_with_values())
    assert len(objs) == 1
    if environment.version_info.major == 2:
        expected = 'unicode'
    else:
        expected = 'str'
    assert objs[0].name.string_name == expected


def test_builtin_loading(inference_state):
    string, = inference_state.builtins_module.py__getattribute__(u'str')
    from_name, = string.py__getattribute__(u'__init__')
    assert from_name.tree_node
    assert not from_name.py__doc__()  # It's a stub


def test_next_docstr(inference_state):
    next_ = compiled.builtin_from_name(inference_state, u'next')
    assert next_.tree_node is not None
    assert next_.py__doc__() == ''  # It's a stub
    for non_stub in _stub_to_python_value_set(next_):
        assert non_stub.py__doc__() == next.__doc__


def test_parse_function_doc_illegal_docstr():
    docstr = """
    test_func(o

    doesn't have a closing bracket.
    """
    assert ('', '') == compiled.value._parse_function_doc(docstr)


def test_doc(inference_state):
    """
    Even CompiledObject docs always return empty docstrings - not None, that's
    just a Jedi API definition.
    """
    str_ = compiled.create_simple_object(inference_state, u'')
    # Equals `''.__getnewargs__`
    obj, = str_.py__getattribute__(u'__getnewargs__')
    assert obj.py__doc__() == ''


def test_string_literals(Script, environment):
    def typ(string):
        d = Script("a = %s; a" % string).goto_definitions()[0]
        return d.name

    assert typ('""') == 'str'
    assert typ('r""') == 'str'
    if environment.version_info.major > 2:
        assert typ('br""') == 'bytes'
        assert typ('b""') == 'bytes'
        assert typ('u""') == 'str'
    else:
        assert typ('b""') == 'str'
        assert typ('u""') == 'unicode'


def test_method_completion(Script, environment):
    code = dedent('''
    class Foo:
        def bar(self):
            pass

    foo = Foo()
    foo.bar.__func__''')
    assert [c.name for c in Script(code).completions()] == ['__func__']


def test_time_docstring(Script):
    import time
    comp, = Script('import time\ntime.sleep').completions()
    assert comp.docstring(raw=True) == time.sleep.__doc__
    expected = 'sleep(secs: float) -> None\n\n' + time.sleep.__doc__
    assert comp.docstring() == expected


def test_dict_values(Script, environment):
    if environment.version_info.major == 2:
        # It looks like typeshed for Python 2 returns Any.
        pytest.skip()
    assert Script('import sys\nsys.modules["alshdb;lasdhf"]').goto_definitions()


def test_getitem_on_none(Script):
    script = Script('None[1j]')
    assert not script.goto_definitions()
    issue, = script._inference_state.analysis
    assert issue.name == 'type-error-not-subscriptable'


def _return_int():
    return 1


@pytest.mark.parametrize(
    'attribute, expected_name, expected_parent', [
        ('x', 'int', 'builtins'),
        ('y', 'int', 'builtins'),
        ('z', 'bool', 'builtins'),
        ('cos', 'cos', 'math'),
        ('dec', 'Decimal', 'decimal'),
        ('dt', 'datetime', 'datetime'),
        ('ret_int', '_return_int', 'test.test_inference.test_compiled'),
    ]
)
def test_parent_context(same_process_inference_state, attribute, expected_name, expected_parent):
    import decimal

    class C:
        x = 1
        y = int
        z = True
        cos = math.cos
        dec = decimal.Decimal(1)
        dt = datetime(2000, 1, 1)
        ret_int = _return_int

    o = compiled.CompiledObject(
        same_process_inference_state,
        DirectObjectAccess(same_process_inference_state, C)
    )
    x, = o.py__getattribute__(attribute)
    assert x.py__name__() == expected_name
    module_name = x.parent_context.py__name__()
    if module_name == '__builtin__':
        module_name = 'builtins'  # Python 2
    assert module_name == expected_parent
    assert x.parent_context.parent_context is None


@pytest.mark.skipif(sys.version_info[0] == 2, reason="Ignore Python 2, because EOL")
@pytest.mark.parametrize(
    'obj, expected_names', [
        ('', ['str']),
        (str, ['str']),
        (''.upper, ['str', 'upper']),
        (str.upper, ['str', 'upper']),

        (math.cos, ['cos']),

        (Counter, ['Counter']),
        (Counter(""), ['Counter']),
        (Counter.most_common, ['Counter', 'most_common']),
        (Counter("").most_common, ['Counter', 'most_common']),
    ]
)
def test_qualified_names(same_process_inference_state, obj, expected_names):
    o = compiled.CompiledObject(
        same_process_inference_state,
        DirectObjectAccess(same_process_inference_state, obj)
    )
    assert o.get_qualified_names() == tuple(expected_names)
