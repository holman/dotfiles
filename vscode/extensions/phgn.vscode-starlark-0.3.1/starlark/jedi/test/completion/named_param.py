"""
Named Params:
>>> def a(abc): pass
...
>>> a(abc=3)  # <- this stuff (abc)
"""

def a(abc):
    pass

#? 5 ['abc']
a(abc)


def a(*some_args, **some_kwargs):
    pass

#? 11 []
a(some_args)

#? 13 []
a(some_kwargs)

def multiple(foo, bar):
    pass

#? 17 ['bar']
multiple(foo, bar)

#? ['bar']
multiple(foo, bar

my_lambda = lambda lambda_param: lambda_param + 1
#? 22 ['lambda_param']
my_lambda(lambda_param)

# __call__ / __init__
class Test(object):
    def __init__(self, hello_other):
        pass

    def __call__(self, hello):
        pass

    def test(self, blub):
        pass

#? 10 ['hello_other']
Test(hello=)
#? 12 ['hello']
Test()(hello=)
#? 11 []
Test()(self=)
#? 16 []
Test().test(self=)
#? 16 ['blub']
Test().test(blub=)

# builtins

#? 12 []
any(iterable=)
