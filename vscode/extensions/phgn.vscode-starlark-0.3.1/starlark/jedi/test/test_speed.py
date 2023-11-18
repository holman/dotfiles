"""
Speed tests of Jedi. To prove that certain things don't take longer than they
should.
"""

import time
import functools

from .helpers import cwd_at
import jedi


def _check_speed(time_per_run, number=4, run_warm=True):
    """ Speed checks should typically be very tolerant. Some machines are
    faster than others, but the tests should still pass. These tests are
    here to assure that certain effects that kill jedi performance are not
    reintroduced to Jedi."""
    def decorated(func):
        @functools.wraps(func)
        def wrapper(Script, **kwargs):
            if run_warm:
                func(Script=Script, **kwargs)
            first = time.time()
            for i in range(number):
                func(Script=Script, **kwargs)
            single_time = (time.time() - first) / number
            message = 'speed issue %s, %s' % (func, single_time)
            assert single_time < time_per_run, message
        return wrapper
    return decorated


@_check_speed(0.5)
def test_os_path_join(Script):
    s = "from posixpath import join; join('', '')."
    assert len(Script(s).completions()) > 10  # is a str completion


@_check_speed(0.15)
def test_scipy_speed(Script):
    s = 'import scipy.weave; scipy.weave.inline('
    script = Script(s, 1, len(s), '')
    script.call_signatures()


@_check_speed(0.8)
@cwd_at('test')
def test_precedence_slowdown(Script):
    """
    Precedence calculation can slow down things significantly in edge
    cases. Having strange recursion structures increases the problem.
    """
    with open('speed/precedence.py') as f:
        line = len(f.read().splitlines())
    assert Script(line=line, path='speed/precedence.py').goto_definitions()


@_check_speed(0.1)
def test_no_repr_computation(Script):
    """
    For Interpreter completion aquisition of sourcefile can trigger
    unwanted computation of repr(). Exemple : big pandas data.
    See issue #919.
    """
    class SlowRepr:
        "class to test what happens if __repr__ is very slow."
        def some_method(self):
            pass

        def __repr__(self):
            time.sleep(0.2)
    test = SlowRepr()
    jedi.Interpreter('test.som', [locals()]).completions()
