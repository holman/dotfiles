# -*- coding: utf-8 -*-
from textwrap import dedent
import logging
import sys

import pytest

from parso.utils import split_lines
from parso import cache
from parso import load_grammar
from parso.python.diff import DiffParser, _assert_valid_graph
from parso import parse

ANY = object()


def test_simple():
    """
    The diff parser reuses modules. So check for that.
    """
    grammar = load_grammar()
    module_a = grammar.parse('a', diff_cache=True)
    assert grammar.parse('b', diff_cache=True) == module_a


def _check_error_leaves_nodes(node):
    if node.type in ('error_leaf', 'error_node'):
        return node

    try:
        children = node.children
    except AttributeError:
        pass
    else:
        for child in children:
            x_node = _check_error_leaves_nodes(child)
            if x_node is not None:
                return x_node
    return None


class Differ(object):
    grammar = load_grammar()

    def initialize(self, code):
        logging.debug('differ: initialize')
        try:
            del cache.parser_cache[self.grammar._hashed][None]
        except KeyError:
            pass

        self.lines = split_lines(code, keepends=True)
        self.module = parse(code, diff_cache=True, cache=True)
        assert code == self.module.get_code()
        _assert_valid_graph(self.module)
        return self.module

    def parse(self, code, copies=0, parsers=0, expect_error_leaves=False):
        logging.debug('differ: parse copies=%s parsers=%s', copies, parsers)
        lines = split_lines(code, keepends=True)
        diff_parser = DiffParser(
            self.grammar._pgen_grammar,
            self.grammar._tokenizer,
            self.module,
        )
        new_module = diff_parser.update(self.lines, lines)
        self.lines = lines
        assert code == new_module.get_code()

        _assert_valid_graph(new_module)

        error_node = _check_error_leaves_nodes(new_module)
        assert expect_error_leaves == (error_node is not None), error_node
        if parsers is not ANY:
            assert diff_parser._parser_count == parsers
        if copies is not ANY:
            assert diff_parser._copy_count == copies
        return new_module


@pytest.fixture()
def differ():
    return Differ()


def test_change_and_undo(differ):
    func_before = 'def func():\n    pass\n'
    # Parse the function and a.
    differ.initialize(func_before + 'a')
    # Parse just b.
    differ.parse(func_before + 'b', copies=1, parsers=1)
    # b has changed to a again, so parse that.
    differ.parse(func_before + 'a', copies=1, parsers=1)
    # Same as before parsers should not be used. Just a simple copy.
    differ.parse(func_before + 'a', copies=1)

    # Now that we have a newline at the end, everything is easier in Python
    # syntax, we can parse once and then get a copy.
    differ.parse(func_before + 'a\n', copies=1, parsers=1)
    differ.parse(func_before + 'a\n', copies=1)

    # Getting rid of an old parser: Still no parsers used.
    differ.parse('a\n', copies=1)
    # Now the file has completely changed and we need to parse.
    differ.parse('b\n', parsers=1)
    # And again.
    differ.parse('a\n', parsers=1)


def test_positions(differ):
    func_before = 'class A:\n pass\n'
    m = differ.initialize(func_before + 'a')
    assert m.start_pos == (1, 0)
    assert m.end_pos == (3, 1)

    m = differ.parse('a', copies=1)
    assert m.start_pos == (1, 0)
    assert m.end_pos == (1, 1)

    m = differ.parse('a\n\n', parsers=1)
    assert m.end_pos == (3, 0)
    m = differ.parse('a\n\n ', copies=1, parsers=2)
    assert m.end_pos == (3, 1)
    m = differ.parse('a ', parsers=1)
    assert m.end_pos == (1, 2)


def test_if_simple(differ):
    src = dedent('''\
    if 1:
        a = 3
    ''')
    else_ = "else:\n    a = ''\n"

    differ.initialize(src + 'a')
    differ.parse(src + else_ + "a", copies=0, parsers=1)

    differ.parse(else_, parsers=1, copies=1, expect_error_leaves=True)
    differ.parse(src + else_, parsers=1)


def test_func_with_for_and_comment(differ):
    # The first newline is important, leave it. It should not trigger another
    # parser split.
    src = dedent("""\

    def func():
        pass


    for a in [1]:
        # COMMENT
        a""")
    differ.initialize(src)
    differ.parse('a\n' + src, copies=1, parsers=2)


def test_one_statement_func(differ):
    src = dedent("""\
    first
    def func(): a
    """)
    differ.initialize(src + 'second')
    differ.parse(src + 'def second():\n a', parsers=1, copies=1)


def test_for_on_one_line(differ):
    src = dedent("""\
    foo = 1
    for x in foo: pass

    def hi():
        pass
    """)
    differ.initialize(src)

    src = dedent("""\
    def hi():
        for x in foo: pass
        pass

    pass
    """)
    differ.parse(src, parsers=2)

    src = dedent("""\
    def hi():
        for x in foo: pass
        pass

        def nested():
            pass
    """)
    # The second parser is for parsing the `def nested()` which is an `equal`
    # operation in the SequenceMatcher.
    differ.parse(src, parsers=1, copies=1)


def test_open_parentheses(differ):
    func = 'def func():\n a\n'
    code = 'isinstance(\n\n' + func
    new_code = 'isinstance(\n' + func
    differ.initialize(code)

    differ.parse(new_code, parsers=1, expect_error_leaves=True)

    new_code = 'a = 1\n' + new_code
    differ.parse(new_code, parsers=2, expect_error_leaves=True)

    func += 'def other_func():\n pass\n'
    differ.initialize('isinstance(\n' + func)
    # Cannot copy all, because the prefix of the function is once a newline and
    # once not.
    differ.parse('isinstance()\n' + func, parsers=2, copies=1)


def test_open_parentheses_at_end(differ):
    code = "a['"
    differ.initialize(code)
    differ.parse(code, parsers=1, expect_error_leaves=True)


def test_backslash(differ):
    src = dedent(r"""
    a = 1\
        if 1 else 2
    def x():
        pass
    """)
    differ.initialize(src)

    src = dedent(r"""
    def x():
        a = 1\
    if 1 else 2
        def y():
            pass
    """)
    differ.parse(src, parsers=2)

    src = dedent(r"""
    def first():
        if foo \
                and bar \
                or baz:
            pass
    def second():
        pass
    """)
    differ.parse(src, parsers=1)


def test_full_copy(differ):
    code = 'def foo(bar, baz):\n pass\n bar'
    differ.initialize(code)
    differ.parse(code, copies=1)


def test_wrong_whitespace(differ):
    code = '''
    hello
    '''
    differ.initialize(code)
    differ.parse(code + 'bar\n    ', parsers=3)

    code += """abc(\npass\n    """
    differ.parse(code, parsers=2, copies=1, expect_error_leaves=True)


def test_issues_with_error_leaves(differ):
    code = dedent('''
    def ints():
        str..
        str
    ''')
    code2 = dedent('''
    def ints():
        str.
        str
    ''')
    differ.initialize(code)
    differ.parse(code2, parsers=1, copies=1, expect_error_leaves=True)


def test_unfinished_nodes(differ):
    code = dedent('''
    class a():
        def __init__(self, a):
            self.a =  a
        def p(self):
    a(1)
    ''')
    code2 = dedent('''
    class a():
        def __init__(self, a):
            self.a =  a
        def p(self):
            self
    a(1)
    ''')
    differ.initialize(code)
    differ.parse(code2, parsers=1, copies=2)


def test_nested_if_and_scopes(differ):
    code = dedent('''
    class a():
        if 1:
            def b():
                2
    ''')
    code2 = code + '    else:\n        3'
    differ.initialize(code)
    differ.parse(code2, parsers=1, copies=0)


def test_word_before_def(differ):
    code1 = 'blub def x():\n'
    code2 = code1 + ' s'
    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=0, expect_error_leaves=True)


def test_classes_with_error_leaves(differ):
    code1 = dedent('''
        class X():
            def x(self):
                blablabla
                assert 3
                self.

        class Y():
            pass
    ''')
    code2 = dedent('''
        class X():
            def x(self):
                blablabla
                assert 3
                str(

        class Y():
            pass
    ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=1, expect_error_leaves=True)


def test_totally_wrong_whitespace(differ):
    code1 = '''
        class X():
            raise n

        class Y():
            pass
    '''
    code2 = '''
        class X():
            raise n
            str(

        class Y():
            pass
    '''

    differ.initialize(code1)
    differ.parse(code2, parsers=4, copies=0, expect_error_leaves=True)


def test_node_insertion(differ):
    code1 = dedent('''
        class X():
            def y(self):
                a = 1
                b = 2

                c = 3
                d = 4
    ''')
    code2 = dedent('''
        class X():
            def y(self):
                a = 1
                b = 2
                str

                c = 3
                d = 4
    ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=2)


def test_whitespace_at_end(differ):
    code = dedent('str\n\n')

    differ.initialize(code)
    differ.parse(code + '\n', parsers=1, copies=1)


def test_endless_while_loop(differ):
    """
    This was a bug in Jedi #878.
    """
    code = '#dead'
    differ.initialize(code)
    module = differ.parse(code, parsers=1)
    assert module.end_pos == (1, 5)

    code = '#dead\n'
    differ.initialize(code)
    module = differ.parse(code + '\n', parsers=1)
    assert module.end_pos == (3, 0)


def test_in_class_movements(differ):
    code1 = dedent("""\
        class PlaybookExecutor:
            p
            b
            def run(self):
                1
                try:
                    x
                except:
                    pass
    """)
    code2 = dedent("""\
        class PlaybookExecutor:
            b
            def run(self):
                1
                try:
                    x
                except:
                    pass
    """)

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=1)


def test_in_parentheses_newlines(differ):
    code1 = dedent("""
    x = str(
        True)

    a = 1

    def foo():
        pass

    b = 2""")

    code2 = dedent("""
    x = str(True)

    a = 1

    def foo():
        pass

    b = 2""")

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=1)


def test_indentation_issue(differ):
    code1 = dedent("""
        import module
    """)

    code2 = dedent("""
        class L1:
            class L2:
                class L3:
                    def f(): pass
                def f(): pass
            def f(): pass
        def f(): pass
    """)

    differ.initialize(code1)
    differ.parse(code2, parsers=1)


def test_endmarker_newline(differ):
    code1 = dedent('''\
        docu = None
        # some comment
        result = codet
        incomplete_dctassign = {
            "module"

        if "a":
            x = 3 # asdf
    ''')

    code2 = code1.replace('codet', 'coded')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=1, expect_error_leaves=True)


def test_newlines_at_end(differ):
    differ.initialize('a\n\n')
    differ.parse('a\n', copies=1)


def test_end_newline_with_decorator(differ):
    code = dedent('''\
        @staticmethod
        def spam():
            import json
            json.l''')

    differ.initialize(code)
    module = differ.parse(code + '\n', copies=1, parsers=1)
    decorated, endmarker = module.children
    assert decorated.type == 'decorated'
    decorator, func = decorated.children
    suite = func.children[-1]
    assert suite.type == 'suite'
    newline, first_stmt, second_stmt = suite.children
    assert first_stmt.get_code() == '    import json\n'
    assert second_stmt.get_code() == '    json.l\n'


def test_invalid_to_valid_nodes(differ):
    code1 = dedent('''\
    def a():
        foo = 3
        def b():
            la = 3
            else:
                la
            return
        foo
    base
    ''')
    code2 = dedent('''\
    def a():
        foo = 3
        def b():
            la = 3
            if foo:
                latte = 3
            else:
                la
            return
        foo
    base
    ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=3)


def test_if_removal_and_reappearence(differ):
    code1 = dedent('''\
        la = 3
        if foo:
            latte = 3
        else:
            la
        pass
    ''')

    code2 = dedent('''\
        la = 3
            latte = 3
        else:
            la
        pass
    ''')

    code3 = dedent('''\
        la = 3
        if foo:
            latte = 3
        else:
            la
    ''')
    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=4, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=1)
    differ.parse(code3, parsers=1, copies=1)


def test_add_error_indentation(differ):
    code = 'if x:\n 1\n'
    differ.initialize(code)
    differ.parse(code + '  2\n', parsers=1, copies=0, expect_error_leaves=True)


def test_differing_docstrings(differ):
    code1 = dedent('''\
        def foobar(x, y):
            1
            return x

        def bazbiz():
            foobar()
        lala
        ''')

    code2 = dedent('''\
        def foobar(x, y):
            2
            return x + y

        def bazbiz():
            z = foobar()
        lala
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=3, copies=1)
    differ.parse(code1, parsers=3, copies=1)


def test_one_call_in_function_change(differ):
    code1 = dedent('''\
        def f(self):
            mro = [self]
            for a in something:
                yield a

        def g(self):
            return C(
                a=str,
                b=self,
            )
        ''')

    code2 = dedent('''\
        def f(self):
            mro = [self]

        def g(self):
            return C(
                a=str,
                t
                b=self,
            )
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=1, expect_error_leaves=True)
    differ.parse(code1, parsers=2, copies=1)


def test_function_deletion(differ):
    code1 = dedent('''\
        class C(list):
            def f(self):
                def iterate():
                    for x in b:
                        break

                return list(iterate())
        ''')

    code2 = dedent('''\
        class C():
            def f(self):
                    for x in b:
                        break

                return list(iterate())
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=0, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=0)


def test_docstring_removal(differ):
    code1 = dedent('''\
        class E(Exception):
            """
            1
            2
            3
            """

        class S(object):
            @property
            def f(self):
                return cmd
            def __repr__(self):
                return cmd2
        ''')

    code2 = dedent('''\
        class E(Exception):
            """
            1
            3
            """

        class S(object):
            @property
            def f(self):
                return cmd
                return cmd2
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=2)
    differ.parse(code1, parsers=2, copies=1)


def test_paren_in_strange_position(differ):
    code1 = dedent('''\
        class C:
            """ ha """
            def __init__(self, message):
                self.message = message
        ''')

    code2 = dedent('''\
        class C:
            """ ha """
                    )
            def __init__(self, message):
                self.message = message
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=2, expect_error_leaves=True)
    differ.parse(code1, parsers=0, copies=2)


def insert_line_into_code(code, index, line):
    lines = split_lines(code, keepends=True)
    lines.insert(index, line)
    return ''.join(lines)


def test_paren_before_docstring(differ):
    code1 = dedent('''\
        # comment
        """
        The
        """
        from parso import tree
        from parso import python
        ''')

    code2 = insert_line_into_code(code1, 1, ' ' * 16 + 'raise InternalParseError(\n')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=1, expect_error_leaves=True)
    differ.parse(code1, parsers=2, copies=1)


def test_parentheses_before_method(differ):
    code1 = dedent('''\
        class A:
            def a(self):
                pass

        class B:
            def b(self):
                if 1:
                    pass
        ''')

    code2 = dedent('''\
        class A:
            def a(self):
                pass
                Exception.__init__(self, "x" %

            def b(self):
                if 1:
                    pass
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=1, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=1)


def test_indentation_issues(differ):
    code1 = dedent('''\
        class C:
            def f():
                1
                if 2:
                    return 3

            def g():
                to_be_removed
                pass
        ''')

    code2 = dedent('''\
        class C:
            def f():
                1
        ``something``, very ``weird``).
                if 2:
                    return 3

            def g():
                to_be_removed
                pass
        ''')

    code3 = dedent('''\
        class C:
            def f():
                1
                if 2:
                    return 3

            def g():
                pass
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=2, expect_error_leaves=True)
    differ.parse(code1, copies=2)
    differ.parse(code3, parsers=2, copies=1)
    differ.parse(code1, parsers=1, copies=2)


def test_error_dedent_issues(differ):
    code1 = dedent('''\
        while True:
            try:
                1
            except KeyError:
                if 2:
                    3
            except IndexError:
                4

        5
        ''')

    code2 = dedent('''\
        while True:
            try:
        except KeyError:
                1
            except KeyError:
                if 2:
                    3
            except IndexError:
                4

                    something_inserted
        5
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=6, copies=2, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=0)


def test_random_text_insertion(differ):
    code1 = dedent('''\
class C:
    def f():
        return node

    def g():
        try:
            1
        except KeyError:
            2
        ''')

    code2 = dedent('''\
class C:
    def f():
        return node
Some'random text: yeah
        for push in plan.dfa_pushes:

    def g():
        try:
            1
        except KeyError:
            2
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=1, copies=1, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=1)


def test_many_nested_ifs(differ):
    code1 = dedent('''\
        class C:
            def f(self):
                def iterate():
                    if 1:
                        yield t
                    else:
                        yield
                return

        def g():
            3
        ''')

    code2 = dedent('''\
            def f(self):
                def iterate():
                    if 1:
                        yield t
        hahahaha
                        if 2:
                            else:
                                yield
                return

        def g():
            3
        ''')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=1, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=1)


@pytest.mark.skipif(sys.version_info < (3, 5), reason="Async starts working in 3.5")
@pytest.mark.parametrize('prefix', ['', 'async '])
def test_with_and_funcdef_in_call(differ, prefix):
    code1 = prefix + dedent('''\
        with x:
            la = C(
                a=1,
                b=2,
                c=3,
            )
        ''')

    code2 = insert_line_into_code(code1, 3, 'def y(self, args):\n')

    differ.initialize(code1)
    differ.parse(code2, parsers=3, expect_error_leaves=True)
    differ.parse(code1, parsers=1)


def test_wrong_backslash(differ):
    code1 = dedent('''\
        def y():
            1
            for x in y:
                continue
        ''')

    code2 = insert_line_into_code(code1, 3, '\\.whl$\n')

    differ.initialize(code1)
    differ.parse(code2, parsers=2, copies=2, expect_error_leaves=True)
    differ.parse(code1, parsers=1, copies=1)


def test_comment_change(differ):
    differ.initialize('')


def test_random_unicode_characters(differ):
    """
    Those issues were all found with the fuzzer.
    """
    differ.initialize('')
    differ.parse(u'\x1dĔBϞɛˁşʑ˳˻ȣſéÎ\x90̕ȟòwʘ\x1dĔBϞɛˁşʑ˳˻ȣſéÎ', parsers=1,
                 expect_error_leaves=True)
    differ.parse(u'\r\r', parsers=1)
    differ.parse(u"˟Ę\x05À\r   rúƣ@\x8a\x15r()\n", parsers=1, expect_error_leaves=True)
    differ.parse(u'a\ntaǁ\rGĒōns__\n\nb', parsers=1,
                 expect_error_leaves=sys.version_info[0] == 2)
    s = '        if not (self, "_fi\x02\x0e\x08\n\nle"):'
    differ.parse(s, parsers=1, expect_error_leaves=True)
    differ.parse('')
    differ.parse(s + '\n', parsers=1, expect_error_leaves=True)
    differ.parse(u'   result = (\r\f\x17\t\x11res)', parsers=2, expect_error_leaves=True)
    differ.parse('')
    differ.parse('   a( # xx\ndef', parsers=2, expect_error_leaves=True)


@pytest.mark.skipif(sys.version_info < (2, 7), reason="No set literals in Python 2.6")
def test_dedent_end_positions(differ):
    code1 = dedent('''\
        if 1:
            if b:
                2
                c = {
                     5}
        ''')
    code2 = dedent('''\
        if 1:
            if ⌟ഒᜈྡྷṭb:
                2
                 'l': ''}
                c = {
                     5}
        ''')
    differ.initialize(code1)
    differ.parse(code2, parsers=1, expect_error_leaves=True)
    differ.parse(code1, parsers=1)


def test_special_no_newline_ending(differ):
    code1 = dedent('''\
        1
        ''')
    code2 = dedent('''\
        1
         is ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=0)


def test_random_character_insertion(differ):
    code1 = dedent('''\
        def create(self):
            1
            if self.path is not None:
                return
            # 3
            # 4
        ''')
    code2 = dedent('''\
        def create(self):
            1
            if 2:
         x       return
            # 3
            # 4
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=3, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=1)


def test_import_opening_bracket(differ):
    code1 = dedent('''\
        1
        2
        from bubu import (X,
        ''')
    code2 = dedent('''\
        11
        2
        from bubu import (X,
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=2, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=2, expect_error_leaves=True)


def test_opening_bracket_at_end(differ):
    code1 = dedent('''\
        class C:
            1
            [
        ''')
    code2 = dedent('''\
        3
        class C:
            1
            [
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=2, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=1, expect_error_leaves=True)


def test_all_sorts_of_indentation(differ):
    code1 = dedent('''\
        class C:
            1
            def f():
                    'same'

                    if foo:
                        a = b
                end
        ''')
    code2 = dedent('''\
        class C:
            1
            def f(yield await %|(
                    'same'

          \x02\x06\x0f\x1c\x11
                    if foo:
                        a = b

                end
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=4, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=3)

    code3 = dedent('''\
            if 1:
                a
                 b
                  c
                   d
        \x00
        ''')
    differ.parse(code3, parsers=2, expect_error_leaves=True)
    differ.parse('')


def test_dont_copy_dedents_in_beginning(differ):
    code1 = dedent('''\
        a
        4
        ''')
    code2 = dedent('''\
        1
         2
          3
        4
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code1, parsers=2)


def test_dont_copy_error_leaves(differ):
    code1 = dedent('''\
        def f(n):
            x
            if 2:
                3
        ''')
    code2 = dedent('''\
        def f(n):
        def if 1:
                indent
            x
            if 2:
                3
        ''')
    differ.initialize(code1)
    differ.parse(code2, parsers=1, expect_error_leaves=True)
    differ.parse(code1, parsers=2)


def test_error_dedent_in_between(differ):
    code1 = dedent('''\
        class C:
            def f():
                a
                if something:
                    x
            z
        ''')
    code2 = dedent('''\
        class C:
            def f():
                a
        dedent
                if other_thing:
                    b
                if something:
                    x
            z
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=2)


def test_some_other_indentation_issues(differ):
    code1 = dedent('''\
        class C:
            x
            def f():
                ""
                copied
        a
        ''')
    code2 = dedent('''\
        try:
            de
                a
                    b
                c
                    d
            def f():
                ""
                copied
        a
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=2, parsers=1, expect_error_leaves=True)
    differ.parse(code1, copies=2, parsers=2)


def test_open_bracket_case1(differ):
    code1 = dedent('''\
        class C:
            1
            2 # ha
        ''')
    code2 = insert_line_into_code(code1, 2, '    [str\n')
    code3 = insert_line_into_code(code2, 4, '    str\n')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code3, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code1, copies=1, parsers=1)


def test_open_bracket_case2(differ):
    code1 = dedent('''\
        class C:
            def f(self):
                (
                b
                c

            def g(self):
                d
        ''')
    code2 = dedent('''\
        class C:
            def f(self):
                (
                b
                c
                self.

            def g(self):
                d
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=2, expect_error_leaves=True)
    differ.parse(code1, copies=2, parsers=0, expect_error_leaves=True)


def test_some_weird_removals(differ):
    code1 = dedent('''\
        class C:
            1
        ''')
    code2 = dedent('''\
        class C:
            1
            @property
                A
                    return
            # x
            omega
        ''')
    code3 = dedent('''\
        class C:
            1
        ;
            omega
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1, expect_error_leaves=True)
    differ.parse(code3, copies=1, parsers=2, expect_error_leaves=True)
    differ.parse(code1, copies=1)


@pytest.mark.skipif(sys.version_info < (3, 5), reason="Async starts working in 3.5")
def test_async_copy(differ):
    code1 = dedent('''\
        async def main():
            x = 3
            print(
        ''')
    code2 = dedent('''\
        async def main():
            x = 3
            print()
        ''')
    differ.initialize(code1)
    differ.parse(code2, copies=1, parsers=1)
    differ.parse(code1, copies=1, parsers=1, expect_error_leaves=True)
