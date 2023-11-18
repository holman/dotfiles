from jedi._compatibility import force_unicode


def test_module_attributes(Script):
    def_, = Script('__name__').completions()
    assert def_.name == '__name__'
    assert def_.line is None
    assert def_.column is None
    str_, = def_.infer()
    assert str_.name == 'str'


def test_module__file__(Script, environment):
    assert not Script('__file__').goto_definitions()
    def_, = Script('__file__', path='example.py').goto_definitions()
    value = force_unicode(def_._name._value.get_safe_value())
    assert value.endswith('example.py')

    def_, = Script('import antigravity; antigravity.__file__').goto_definitions()
    value = force_unicode(def_._name._value.get_safe_value())
    assert value.endswith('.py')
