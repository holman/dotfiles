# --- simple
def test():
    #? 4
    a = (30 + b, c) + 1
    return test(100, a)
# +++
def test():
    return test(100, (30 + b, c) + 1)


# --- simple
if 1:
    #? 4
    a = 1, 2
    return test(100, a)
# +++
if 1:
    return test(100, (1, 2))
