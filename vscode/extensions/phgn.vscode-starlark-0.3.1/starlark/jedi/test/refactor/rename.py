"""
Test coverage for renaming is mostly being done by testing
`Script.usages`.
"""

# --- simple
def test1():
    #? 7 blabla
    test1()
    AssertionError
    return test1, test1.not_existing
# +++
def blabla():
    blabla()
    AssertionError
    return blabla, blabla.not_existing

