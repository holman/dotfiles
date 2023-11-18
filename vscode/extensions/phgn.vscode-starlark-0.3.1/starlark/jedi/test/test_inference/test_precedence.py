from jedi.inference.compiled import CompiledObject

import pytest


@pytest.mark.parametrize('source', [
    pytest.param('1 == 1'),
    pytest.param('1.0 == 1'),
    # Unfortunately for now not possible, because it's a typeshed object.
    pytest.param('... == ...', marks=pytest.mark.xfail),
])
def test_equals(Script, environment, source):
    if environment.version_info.major < 3:
        pytest.skip("Ellipsis does not exists in 2")
    script = Script(source)
    node = script._module_node.children[0]
    first, = script._get_module_context().infer_node(node)
    assert isinstance(first, CompiledObject) and first.get_safe_value() is True
