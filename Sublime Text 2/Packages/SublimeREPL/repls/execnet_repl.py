# encoding: utf-8
import repl
from Queue import Queue
import sys
import execnet

REMOTE_CODE = """
from __future__ import with_statement
from __future__ import division
from __future__ import absolute_import
#if '{activate_file}':
#    execfile('{activate_file}', dict(__file__='{activate_file}'))

import code
import sys
import time
import contextlib
import threading
try:
    from Queue import Queue
except ImportError:
    from queue import Queue  # py3

class ChannelOut(object):
    def write(self, data):
        channel.send(data)
    def flush(self):
        pass

@contextlib.contextmanager
def redirect_stdio():
    orig = (sys.stdout, sys.stderr)
    sys.stdout = sys.stderr = ChannelOut()
    yield
    (sys.stdout, sys.stderr) = orig

class InterceptingConsole(code.InteractiveConsole):
    PS1 = "{ps1}"
    PS2 = "... "
    def __init__(self):
        code.InteractiveConsole.__init__(self)
        self.input = Queue()
        self.output = channel
        self.output.send(self.PS1)

    def write(self, data):
        self.output.send(data)

    def push(self, line):
        with redirect_stdio():
            more = code.InteractiveConsole.push(self, line)
        self.output.send(self.PS2 if more else self.PS1)
        return more

    def run(self):
        while True:
            line = self.input.get()
            if line is None:
                break
            self.push(line)


ic = InterceptingConsole()
_thread = threading.Thread(target=ic.run)
_thread.start()

channel.setcallback(ic.input.put, endmarker=None)

while not channel.isclosed():
    time.sleep(1.0)
"""


class ExecnetRepl(repl.Repl):
    TYPE = "execnet_repl"

    def __init__(self, encoding, connection_string=None, activate_file="", ps1=">>> "):
        super(ExecnetRepl, self).__init__(encoding, u"python", "\n", False)
        self._connections_string = connection_string
        self._ps1 = ps1
        self._gw = execnet.makegateway(connection_string)
        remote_code = REMOTE_CODE.format(ps1=ps1, activate_file=activate_file)
        self._channel = self._gw.remote_exec(remote_code)
        self.output = Queue()
        self._channel.setcallback(self.output.put, endmarker=None)
        self._alive = True
        self._killed = False

    def name(self):
        return "execnet " + self._ps1.split()[0]

    def is_alive(self):
        return self._alive

    def write_bytes(self, bytes):
        if self._channel.isclosed():
            self._alive = False
        else:
            self._channel.send(bytes)

    def read_bytes(self):
        bytes = self.output.get()
        if bytes is None:
            self._gw.exit()
        else:
            return bytes

    def kill(self):
        self._killed = True
        self._channel.close()
        self._gw.exit()
