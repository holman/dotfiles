def test_import_usage(Script):
    s = Script("from .. import foo", line=1, column=18, path="foo.py")
    assert [usage.line for usage in s.usages()] == [1]


def test_exclude_builtin_modules(Script):
    def get(include):
        return [(d.line, d.column) for d in Script(source, column=8).usages(include_builtins=include)]
    source = '''import sys\nprint(sys.path)'''
    places = get(include=True)
    assert len(places) > 2  # Includes stubs

    places = get(include=False)
    assert places == [(1, 7), (2, 6)]
