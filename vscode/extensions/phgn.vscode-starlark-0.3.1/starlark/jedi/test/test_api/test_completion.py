from os.path import join, sep as s, dirname
import os
import sys
from textwrap import dedent

import pytest
from ..helpers import root_dir


def test_in_whitespace(Script):
    code = dedent('''
    def x():
        pass''')
    assert len(Script(code, column=2).completions()) > 20


def test_empty_init(Script):
    """This was actually an issue."""
    code = dedent('''\
    class X(object): pass
    X(''')
    assert Script(code).completions()


def test_in_empty_space(Script):
    code = dedent('''\
    class X(object):
        def __init__(self):
            hello
            ''')
    comps = Script(code, 3, 7).completions()
    self, = [c for c in comps if c.name == 'self']
    assert self.name == 'self'
    def_, = self.infer()
    assert def_.name == 'X'


def test_indent_value(Script):
    """
    If an INDENT is the next supposed token, we should still be able to
    complete.
    """
    code = 'if 1:\nisinstanc'
    comp, = Script(code).completions()
    assert comp.name == 'isinstance'


def test_keyword_value(Script):
    def get_names(*args, **kwargs):
        return [d.name for d in Script(*args, **kwargs).completions()]

    names = get_names('if 1:\n pass\n')
    assert 'if' in names
    assert 'elif' in names


def test_os_nowait(Script):
    """ github issue #45 """
    s = Script("import os; os.P_").completions()
    assert 'P_NOWAIT' in [i.name for i in s]


def test_points_in_completion(Script):
    """At some point, points were inserted into the completions, this
    caused problems, sometimes.
    """
    c = Script("if IndentationErr").completions()
    assert c[0].name == 'IndentationError'
    assert c[0].complete == 'or'


def test_loading_unicode_files_with_bad_global_charset(Script, monkeypatch, tmpdir):
    dirname = str(tmpdir.mkdir('jedi-test'))
    filename1 = join(dirname, 'test1.py')
    filename2 = join(dirname, 'test2.py')
    if sys.version_info < (3, 0):
        data = "# coding: latin-1\nfoo = 'm\xf6p'\n"
    else:
        data = "# coding: latin-1\nfoo = 'm\xf6p'\n".encode("latin-1")

    with open(filename1, "wb") as f:
        f.write(data)
    s = Script("from test1 import foo\nfoo.",
               line=2, column=4, path=filename2)
    s.completions()


def test_fake_subnodes(Script):
    """
    Test the number of subnodes of a fake object.

    There was a bug where the number of child nodes would grow on every
    call to :func:``jedi.inference.compiled.fake.get_faked``.

    See Github PR#649 and isseu #591.
    """
    def get_str_completion(values):
        for c in values:
            if c.name == 'str':
                return c
    limit = None
    for i in range(2):
        completions = Script('').completions()
        c = get_str_completion(completions)
        str_value, = c._name.infer()
        n = len(str_value.tree_node.children[-1].children)
        if i == 0:
            limit = n
        else:
            assert n == limit


def test_generator(Script):
    # Did have some problems with the usage of generator completions this
    # way.
    s = "def abc():\n" \
        "    yield 1\n" \
        "abc()."
    assert Script(s).completions()


def test_in_comment(Script):
    assert Script(" # Comment").completions()
    # TODO this is a bit ugly, that the behaviors in comments are different.
    assert not Script("max_attr_value = int(2) # Cast to int for spe").completions()


def test_async(Script, environment):
    if environment.version_info < (3, 5):
        pytest.skip()

    code = dedent('''
        foo = 3
        async def x():
            hey = 3
              ho'''
    )
    comps = Script(code, column=4).completions()
    names = [c.name for c in comps]
    assert 'foo' in names
    assert 'hey' in names


def test_with_stmt_error_recovery(Script):
    assert Script('with open('') as foo: foo.\na', line=1).completions()


@pytest.mark.parametrize(
    'code, has_keywords', (
        ('', True),
        ('x;', True),
        ('1', False),
        ('1 ', True),
        ('1\t', True),
        ('1\n', True),
        ('1\\\n', True),
    )
)
def test_keyword_completion(Script, code, has_keywords):
    assert has_keywords == any(x.is_keyword for x in Script(code).completions())


f1 = join(root_dir, 'example.py')
f2 = join(root_dir, 'test', 'example.py')
os_path = 'from os.path import *\n'
# os.path.sep escaped
se = s * 2 if s == '\\' else s
current_dirname = os.path.basename(dirname(dirname(dirname(__file__))))


@pytest.mark.parametrize(
    'file, code, column, expected', [
        # General tests / relative paths
        (None, '"comp', None, ['ile', 'lex']),  # No files like comp
        (None, '"test', None, [s]),
        (None, '"test', 4, ['t' + s]),
        ('example.py', '"test%scomp' % s, None, ['letion' + s]),
        ('example.py', 'r"comp"', None, "A LOT"),
        ('example.py', 'r"tes"', None, "A LOT"),
        ('example.py', 'r"tes"', 5, ['t' + s]),
        ('example.py', 'r" tes"', 6, []),
        ('test%sexample.py' % se, 'r"tes"', 5, ['t' + s]),
        ('test%sexample.py' % se, 'r"test%scomp"' % s, 5, ['t' + s]),
        ('test%sexample.py' % se, 'r"test%scomp"' % s, 11, ['letion' + s]),
        ('test%sexample.py' % se, '"%s"' % join('test', 'completion', 'basi'), 21, ['c.py']),
        ('example.py', 'rb"'+ join('..', current_dirname, 'tes'), None, ['t' + s]),

        # Absolute paths
        (None, '"' + join(root_dir, 'test', 'test_ca'), None, ['che.py"']),
        (None, '"%s"' % join(root_dir, 'test', 'test_ca'), len(root_dir) + 14, ['che.py']),

        # Longer quotes
        ('example.py', 'r"""test', None, [s]),
        ('example.py', 'r"""\ntest', None, []),
        ('example.py', 'u"""tes\n', (1, 7), ['t' + s]),
        ('example.py', '"""test%stest_cache.p"""' % s, 20, ['y']),
        ('example.py', '"""test%stest_cache.p"""' % s, 19, ['py"""']),

        # Adding
        ('example.py', '"test" + "%stest_cac' % se, None, ['he.py"']),
        ('example.py', '"test" + "%s" + "test_cac' % se, None, ['he.py"']),
        ('example.py', 'x = 1 + "test', None, []),
        ('example.py', 'x = f("te" + "st)', 16, [s]),
        ('example.py', 'x = f("te" + "st', 16, [s]),
        ('example.py', 'x = f("te" + "st"', 16, [s]),
        ('example.py', 'x = f("te" + "st")', 16, [s]),
        ('example.py', 'x = f("t" + "est")', 16, [s]),
        # This is actually not correct, but for now leave it here, because of
        # Python 2.
        ('example.py', 'x = f(b"t" + "est")', 17, [s]),
        ('example.py', '"test" + "', None, [s]),

        # __file__
        (f1, os_path + 'dirname(__file__) + "%stest' % s, None, [s]),
        (f2, os_path + 'dirname(__file__) + "%stest_ca' % se, None, ['che.py"']),
        (f2, os_path + 'dirname(abspath(__file__)) + sep + "test_ca', None, ['che.py"']),
        (f2, os_path + 'join(dirname(__file__), "completion") + sep + "basi', None, ['c.py"']),
        (f2, os_path + 'join("test", "completion") + sep + "basi', None, ['c.py"']),

        # inside join
        (f2, os_path + 'join(dirname(__file__), "completion", "basi', None, ['c.py"']),
        (f2, os_path + 'join(dirname(__file__), "completion", "basi)', 43, ['c.py"']),
        (f2, os_path + 'join(dirname(__file__), "completion", "basi")', 43, ['c.py']),
        (f2, os_path + 'join(dirname(__file__), "completion", "basi)', 35, ['']),
        (f2, os_path + 'join(dirname(__file__), "completion", "basi)', 33, ['on"']),
        (f2, os_path + 'join(dirname(__file__), "completion", "basi")', 33, ['on"']),

        # join with one argument. join will not get inferred and the result is
        # that directories and in a slash. This is unfortunate, but doesn't
        # really matter.
        (f2, os_path + 'join("tes', 9, ['t"']),
        (f2, os_path + 'join(\'tes)', 9, ["t'"]),
        (f2, os_path + 'join(r"tes"', 10, ['t']),
        (f2, os_path + 'join("""tes""")', 11, ['t']),

        # Almost like join but not really
        (f2, os_path + 'join["tes', 9, ['t' + s]),
        (f2, os_path + 'join["tes"', 9, ['t' + s]),
        (f2, os_path + 'join["tes"]', 9, ['t' + s]),
        (f2, os_path + 'join[dirname(__file__), "completi', 33, []),
        (f2, os_path + 'join[dirname(__file__), "completi"', 33, []),
        (f2, os_path + 'join[dirname(__file__), "completi"]', 33, []),

        # With full paths
        (f2, 'import os\nos.path.join(os.path.dirname(__file__), "completi', 49, ['on"']),
        (f2, 'import os\nos.path.join(os.path.dirname(__file__), "completi"', 49, ['on']),
        (f2, 'import os\nos.path.join(os.path.dirname(__file__), "completi")', 49, ['on']),

        # With alias
        (f2, 'import os.path as p as p\np.join(p.dirname(__file__), "completi', None, ['on"']),
        (f2, 'from os.path import dirname, join as j\nj(dirname(__file__), "completi',
         None, ['on"']),

        # Trying to break it
        (f2, os_path + 'join(["tes', 10, ['t' + s]),
        (f2, os_path + 'join(["tes"]', 10, ['t' + s]),
        (f2, os_path + 'join(["tes"])', 10, ['t' + s]),
        (f2, os_path + 'join("test", "test_cac" + x,', 22, ['he.py']),
    ]
)
def test_file_path_completions(Script, file, code, column, expected):
    line = None
    if isinstance(column, tuple):
        line, column = column
    comps = Script(code, path=file, line=line, column=column).completions()
    if expected == "A LOT":
        assert len(comps) > 100  # This is basically global completions.
    else:
        assert [c.complete for c in comps] == expected
