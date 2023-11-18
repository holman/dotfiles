# --- simple
def test():
    #? 35 a
    return test(100, (30 + b, c) + 1)

# +++
def test():
    a = (30 + b, c) + 1
    return test(100, a)


# --- simple #2
def test():
    #? 25 a
    return test(100, (30 + b, c) + 1)

# +++
def test():
    a = 30 + b
    return test(100, (a, c) + 1)


# --- multiline
def test():
    #? 30 x
    return test(1, (30 + b, c) 
                            + 1)
# +++
def test():
    x = ((30 + b, c) 
                            + 1)
    return test(1, x
)


# --- multiline #2
def test():
    #? 25 x
    return test(1, (30 + b, c) 
                            + 1)
# +++
def test():
    x = 30 + b
    return test(1, (x, c) 
                            + 1)


