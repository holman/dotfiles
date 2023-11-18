from jedi import debug
from jedi.inference.base_value import ValueSet, \
    NO_VALUES
from jedi.inference.utils import to_list
from jedi.inference.gradual.stub_value import StubModuleValue


def _stub_to_python_value_set(stub_value, ignore_compiled=False):
    stub_module_context = stub_value.get_root_context()
    if not stub_module_context.is_stub():
        return ValueSet([stub_value])

    was_instance = stub_value.is_instance()
    if was_instance:
        stub_value = stub_value.py__class__()

    qualified_names = stub_value.get_qualified_names()
    if qualified_names is None:
        return NO_VALUES

    was_bound_method = stub_value.is_bound_method()
    if was_bound_method:
        # Infer the object first. We can infer the method later.
        method_name = qualified_names[-1]
        qualified_names = qualified_names[:-1]
        was_instance = True

    values = _infer_from_stub(stub_module_context, qualified_names, ignore_compiled)
    if was_instance:
        values = ValueSet.from_sets(
            c.execute_with_values()
            for c in values
            if c.is_class()
        )
    if was_bound_method:
        # Now that the instance has been properly created, we can simply get
        # the method.
        values = values.py__getattribute__(method_name)
    return values


def _infer_from_stub(stub_module_context, qualified_names, ignore_compiled):
    from jedi.inference.compiled.mixed import MixedObject
    stub_module = stub_module_context.get_value()
    assert isinstance(stub_module, (StubModuleValue, MixedObject)), stub_module_context
    non_stubs = stub_module.non_stub_value_set
    if ignore_compiled:
        non_stubs = non_stubs.filter(lambda c: not c.is_compiled())
    for name in qualified_names:
        non_stubs = non_stubs.py__getattribute__(name)
    return non_stubs


@to_list
def _try_stub_to_python_names(names, prefer_stub_to_compiled=False):
    for name in names:
        module_context = name.get_root_context()
        if not module_context.is_stub():
            yield name
            continue

        name_list = name.get_qualified_names()
        if name_list is None:
            values = NO_VALUES
        else:
            values = _infer_from_stub(
                module_context,
                name_list[:-1],
                ignore_compiled=prefer_stub_to_compiled,
            )
        if values and name_list:
            new_names = values.goto(name_list[-1])
            for new_name in new_names:
                yield new_name
            if new_names:
                continue
        elif values:
            for c in values:
                yield c.name
            continue
        # This is the part where if we haven't found anything, just return the
        # stub name.
        yield name


def _load_stub_module(module):
    if module.is_stub():
        return module
    from jedi.inference.gradual.typeshed import _try_to_load_stub_cached
    return _try_to_load_stub_cached(
        module.inference_state,
        import_names=module.string_names,
        python_value_set=ValueSet([module]),
        parent_module_value=None,
        sys_path=module.inference_state.get_sys_path(),
    )


@to_list
def _python_to_stub_names(names, fallback_to_python=False):
    for name in names:
        module_context = name.get_root_context()
        if module_context.is_stub():
            yield name
            continue

        if name.is_import():
            for new_name in name.goto():
                # Imports don't need to be converted, because they are already
                # stubs if possible.
                if fallback_to_python or new_name.is_stub():
                    yield new_name
            continue

        name_list = name.get_qualified_names()
        stubs = NO_VALUES
        if name_list is not None:
            stub_module = _load_stub_module(module_context.get_value())
            if stub_module is not None:
                stubs = ValueSet({stub_module})
                for name in name_list[:-1]:
                    stubs = stubs.py__getattribute__(name)
        if stubs and name_list:
            new_names = stubs.goto(name_list[-1])
            for new_name in new_names:
                yield new_name
            if new_names:
                continue
        elif stubs:
            for c in stubs:
                yield c.name
            continue
        if fallback_to_python:
            # This is the part where if we haven't found anything, just return
            # the stub name.
            yield name


def convert_names(names, only_stubs=False, prefer_stubs=False):
    assert not (only_stubs and prefer_stubs)
    with debug.increase_indent_cm('convert names'):
        if only_stubs or prefer_stubs:
            return _python_to_stub_names(names, fallback_to_python=prefer_stubs)
        else:
            return _try_stub_to_python_names(names, prefer_stub_to_compiled=True)


def convert_values(values, only_stubs=False, prefer_stubs=False, ignore_compiled=True):
    assert not (only_stubs and prefer_stubs)
    with debug.increase_indent_cm('convert values'):
        if only_stubs or prefer_stubs:
            return ValueSet.from_sets(
                to_stub(value)
                or (ValueSet({value}) if prefer_stubs else NO_VALUES)
                for value in values
            )
        else:
            return ValueSet.from_sets(
                _stub_to_python_value_set(stub_value, ignore_compiled=ignore_compiled)
                or ValueSet({stub_value})
                for stub_value in values
            )


# TODO merge with _python_to_stub_names?
def to_stub(value):
    if value.is_stub():
        return ValueSet([value])

    was_instance = value.is_instance()
    if was_instance:
        value = value.py__class__()

    qualified_names = value.get_qualified_names()
    stub_module = _load_stub_module(value.get_root_context().get_value())
    if stub_module is None or qualified_names is None:
        return NO_VALUES

    was_bound_method = value.is_bound_method()
    if was_bound_method:
        # Infer the object first. We can infer the method later.
        method_name = qualified_names[-1]
        qualified_names = qualified_names[:-1]
        was_instance = True

    stub_values = ValueSet([stub_module])
    for name in qualified_names:
        stub_values = stub_values.py__getattribute__(name)

    if was_instance:
        stub_values = ValueSet.from_sets(
            c.execute_with_values()
            for c in stub_values
            if c.is_class()
        )
    if was_bound_method:
        # Now that the instance has been properly created, we can simply get
        # the method.
        stub_values = stub_values.py__getattribute__(method_name)
    return stub_values
