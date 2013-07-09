"""
gateway code for initiating popen, socket and ssh connections.
(c) 2004-2009, Holger Krekel and others
"""

import sys, os, inspect, types, linecache
import textwrap
import execnet
from execnet.gateway_base import Message
from execnet.gateway_io import Popen2IOMaster
from execnet import gateway_base
importdir = os.path.dirname(os.path.dirname(execnet.__file__))

class Gateway(gateway_base.BaseGateway):
    """ Gateway to a local or remote Python Intepreter. """

    def __init__(self, io, id):
        super(Gateway, self).__init__(io=io, id=id, _startcount=1)
        self._initreceive()

    @property
    def remoteaddress(self):
        return self._io.remoteaddress

    def __repr__(self):
        """ return string representing gateway type and status. """
        try:
            r = (self.hasreceiver() and 'receive-live' or 'not-receiving')
            i = len(self._channelfactory.channels())
        except AttributeError:
            r = "uninitialized"
            i = "no"
        return "<%s id=%r %s, %s active channels>" %(
                self.__class__.__name__, self.id, r, i)

    def exit(self):
        """ trigger gateway exit.  Defer waiting for finishing
        of receiver-thread and subprocess activity to when
        group.terminate() is called.
        """
        self._trace("gateway.exit() called")
        if self not in self._group:
            self._trace("gateway already unregistered with group")
            return
        self._group._unregister(self)
        self._trace("--> sending GATEWAY_TERMINATE")
        try:
            self._send(Message.GATEWAY_TERMINATE)
            self._io.close_write()
        except IOError:
            v = sys.exc_info()[1]
            self._trace("io-error: could not send termination sequence")
            self._trace(" exception: %r" % v)

    def reconfigure(self, py2str_as_py3str=True, py3str_as_py2str=False):
        """
        set the string coercion for this gateway
        the default is to try to convert py2 str as py3 str,
        but not to try and convert py3 str to py2 str
        """
        self._strconfig = (py2str_as_py3str, py3str_as_py2str)
        data = gateway_base.dumps_internal(self._strconfig)
        self._send(Message.RECONFIGURE, data=data)


    def _rinfo(self, update=False):
        """ return some sys/env information from remote. """
        if update or not hasattr(self, '_cache_rinfo'):
            ch = self.remote_exec(rinfo_source)
            self._cache_rinfo = RInfo(ch.receive())
        return self._cache_rinfo

    def hasreceiver(self):
        """ return True if gateway is able to receive data. """
        return self._receiverthread.isAlive() # approxmimation

    def remote_status(self):
        """ return information object about remote execution status. """
        channel = self.newchannel()
        self._send(Message.STATUS, channel.id)
        statusdict = channel.receive()
        # the other side didn't actually instantiate a channel
        # so we just delete the internal id/channel mapping
        self._channelfactory._local_close(channel.id)
        return RemoteStatus(statusdict)

    def remote_exec(self, source, **kwargs):
        """ return channel object and connect it to a remote
            execution thread where the given ``source`` executes.

            * ``source`` is a string: execute source string remotely
              with a ``channel`` put into the global namespace.
            * ``source`` is a pure function: serialize source and
              call function with ``**kwargs``, adding a
              ``channel`` object to the keyword arguments.
            * ``source`` is a pure module: execute source of module
              with a ``channel`` in its global namespace

            In all cases the binding ``__name__='__channelexec__'``
            will be available in the global namespace of the remotely
            executing code.
        """
        call_name = None
        if isinstance(source, types.ModuleType):
            linecache.updatecache(inspect.getsourcefile(source))
            source = inspect.getsource(source)
        elif isinstance(source, types.FunctionType):
            call_name = source.__name__
            source = _source_of_function(source)
        else:
            source = textwrap.dedent(str(source))

        if call_name is None and kwargs:
            raise TypeError("can't pass kwargs to non-function remote_exec")

        channel = self.newchannel()
        self._send(Message.CHANNEL_EXEC,
                   channel.id,
                   gateway_base.dumps_internal((source, call_name, kwargs)))
        return channel

    def remote_init_threads(self, num=None):
        """ start up to 'num' threads for subsequent
            remote_exec() invocations to allow concurrent
            execution.
        """
        if hasattr(self, '_remotechannelthread'):
            raise IOError("remote threads already running")
        from execnet import threadpool
        source = inspect.getsource(threadpool)
        self._remotechannelthread = self.remote_exec(source)
        self._remotechannelthread.send(num)
        status = self._remotechannelthread.receive()
        assert status == "ok", status

class RInfo:
    def __init__(self, kwargs):
        self.__dict__.update(kwargs)

    def __repr__(self):
        info = ", ".join(["%s=%s" % item
                for item in self.__dict__.items()])
        return "<RInfo %r>" % info

RemoteStatus = RInfo

def rinfo_source(channel):
    import sys, os
    channel.send(dict(
        executable = sys.executable,
        version_info = sys.version_info[:5],
        platform = sys.platform,
        cwd = os.getcwd(),
        pid = os.getpid(),
    ))


def _find_non_builtin_globals(source, codeobj):
    try:
        import ast
    except ImportError:
        return None
    try:
        import __builtin__
    except ImportError:
        import builtins as __builtin__

    vars = dict.fromkeys(codeobj.co_varnames)
    all = []
    for node in ast.walk(ast.parse(source)):
        if (isinstance(node, ast.Name) and node.id not in vars and
            node.id not in __builtin__.__dict__):
            all.append(node.id)
    return all


def _source_of_function(function):
    if function.__name__ == '<lambda>':
        raise ValueError("can't evaluate lambda functions'")
    #XXX: we dont check before remote instanciation
    #     if arguments are used propperly
    args, varargs, keywords, defaults = inspect.getargspec(function)
    if args[0] != 'channel':
        raise ValueError('expected first function argument to be `channel`')

    if sys.version_info < (3,0):
        closure = function.func_closure
        codeobj = function.func_code
    else:
        closure = function.__closure__
        codeobj = function.__code__

    if closure is not None:
        raise ValueError("functions with closures can't be passed")

    try:
        source = inspect.getsource(function)
    except IOError:
        raise ValueError("can't find source file for %s" % function)

    source = textwrap.dedent(source) # just for inner functions

    used_globals = _find_non_builtin_globals(source, codeobj)
    if used_globals:
        raise ValueError(
            "the use of non-builtin globals isn't supported",
            used_globals,
        )

    return source

