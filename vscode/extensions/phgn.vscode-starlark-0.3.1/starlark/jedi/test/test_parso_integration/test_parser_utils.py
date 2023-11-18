# -*- coding: utf-8 -*-
from jedi._compatibility import is_py3
from jedi import parser_utils
from parso import parse
from parso.python import tree

import pytest


class TestCallAndName:
    def get_call(self, source):
        # Get the simple_stmt and then the first one.
        node = parse(source).children[0]
        if node.type == 'simple_stmt':
            return node.children[0]
        return node

    def test_name_and_call_positions(self):
        name = self.get_call('name\nsomething_else')
        assert name.value == 'name'
        assert name.start_pos == (1, 0)
        assert name.end_pos == (1, 4)

        leaf = self.get_call('1.0\n')
        assert leaf.value == '1.0'
        assert parser_utils.safe_literal_eval(leaf.value) == 1.0
        assert leaf.start_pos == (1, 0)
        assert leaf.end_pos == (1, 3)

    def test_call_type(self):
        call = self.get_call('hello')
        assert isinstance(call, tree.Name)

    def test_literal_type(self):
        literal = self.get_call('1.0')
        assert isinstance(literal, tree.Literal)
        assert type(parser_utils.safe_literal_eval(literal.value)) == float

        literal = self.get_call('1')
        assert isinstance(literal, tree.Literal)
        assert type(parser_utils.safe_literal_eval(literal.value)) == int

        literal = self.get_call('"hello"')
        assert isinstance(literal, tree.Literal)
        assert parser_utils.safe_literal_eval(literal.value) == 'hello'


def test_hex_values_in_docstring():
    source = r'''
        def foo(object):
            """
             \xff
            """
            return 1
        '''

    doc = parser_utils.clean_scope_docstring(next(parse(source).iter_funcdefs()))
    if is_py3:
        assert doc == '\xff'
    else:
        assert doc == u'�'


@pytest.mark.parametrize(
    'code,call_signature', [
        ('def my_function(x, typed: Type, z):\n return', 'my_function(x, typed: Type, z)'),
        ('def my_function(x, y, z) -> str:\n return', 'my_function(x, y, z) -> str'),
        ('lambda x, y, z: x + y * z\n', '<lambda>(x, y, z)')
    ])
def test_get_call_signature(code, call_signature):
    node = parse(code, version='3.5').children[0]
    if node.type == 'simple_stmt':
        node = node.children[0]
    assert parser_utils.get_call_signature(node) == call_signature
