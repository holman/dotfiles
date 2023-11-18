from itertools import chain

import jedi
from ..helpers import cwd_at


def test_import_empty(Script):
    """ github #340, return the full word. """
    completion = Script("import ").completions()[0]
    definition = completion.infer()[0]
    assert definition


def check_follow_definition_types(Script, source):
    # nested import
    completions = Script(source, path='some_path.py').completions()
    defs = chain.from_iterable(c.infer() for c in completions)
    return [d.type for d in defs]


def test_follow_import_incomplete(Script, environment):
    """
    Completion on incomplete imports should always take the full completion
    to do any type inference.
    """
    datetime = check_follow_definition_types(Script, "import itertool")
    assert datetime == ['module']

    # empty `from * import` parts
    itert = jedi.Script("from itertools import ").completions()
    definitions = [d for d in itert if d.name == 'chain']
    assert len(definitions) == 1
    assert [d.type for d in definitions[0].infer()] == ['class']

    # incomplete `from * import` part
    datetime = check_follow_definition_types(Script, "from datetime import datetim")
    if environment.version_info.major == 2:
        assert datetime == ['class']
    else:
        assert set(datetime) == {'class', 'instance'}  # py3: builtin and pure py version
    # os.path check
    ospath = check_follow_definition_types(Script, "from os.path import abspat")
    assert set(ospath) == {'function'}

    # alias
    alias = check_follow_definition_types(Script, "import io as abcd; abcd")
    assert alias == ['module']


@cwd_at('test/completion/import_tree')
def test_follow_definition_nested_import(Script):
    types = check_follow_definition_types(Script, "import pkg.mod1; pkg")
    assert types == ['module']

    types = check_follow_definition_types(Script, "import pkg.mod1; pkg.mod1")
    assert types == ['module']

    types = check_follow_definition_types(Script, "import pkg.mod1; pkg.mod1.a")
    assert types == ['instance']


def test_follow_definition_land_on_import(Script):
    types = check_follow_definition_types(Script, "import datetime; datetim")
    assert types == ['module']
