def test_keyword_doc(Script):
    r = list(Script("or", 1, 1).goto_definitions())
    assert len(r) == 1
    assert len(r[0].doc) > 100

    r = list(Script("asfdasfd", 1, 1).goto_definitions())
    assert len(r) == 0

    k = Script("fro").completions()[0]
    imp_start = '\nThe ``import'
    assert k.raw_doc.startswith(imp_start)
    assert k.doc.startswith(imp_start)


def test_blablabla(Script):
    defs = Script("import").goto_definitions()
    assert len(defs) == 1 and [1 for d in defs if d.doc]
    # unrelated to #44


def test_operator_doc(Script):
    r = list(Script("a == b", 1, 3).goto_definitions())
    assert len(r) == 1
    assert len(r[0].doc) > 100


def test_lambda(Script):
    defs = Script('lambda x: x', column=0).goto_definitions()
    assert [d.type for d in defs] == ['keyword']
