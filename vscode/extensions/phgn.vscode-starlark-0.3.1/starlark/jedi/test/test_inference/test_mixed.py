import jedi


def test_on_code():
    from functools import wraps
    i = jedi.Interpreter("wraps.__code__", [{'wraps':wraps}])
    assert i.goto_definitions()
