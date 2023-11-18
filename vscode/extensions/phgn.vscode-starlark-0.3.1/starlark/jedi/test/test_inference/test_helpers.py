from textwrap import dedent

from jedi import names
from jedi.inference import helpers


def test_call_of_leaf_in_brackets(environment):
    s = dedent("""
    x = 1
    type(x)
    """)
    last_x = names(s, references=True, definitions=False, environment=environment)[-1]
    name = last_x._name.tree_name

    call = helpers.call_of_leaf(name)
    assert call == name
