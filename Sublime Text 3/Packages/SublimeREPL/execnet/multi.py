"""
Managing Gateway Groups and interactions with multiple channels.

(c) 2008-2009, Holger Krekel and others
"""

import os, sys, atexit
import time
import execnet
from execnet.threadpool import WorkerPool

from execnet import XSpec
from execnet import gateway, gateway_io, gateway_bootstrap
from execnet.gateway_base import queue, reraise, trace, TimeoutError

NO_ENDMARKER_WANTED = object()

class Group:
    """ Gateway Groups. """
    defaultspec = "popen"
    def __init__(self, xspecs=()):
        """ initialize group and make gateways as specified. """
        # Gateways may evolve to become GC-collectable
        self._gateways = []
        self._autoidcounter = 0
        self._gateways_to_join = []
        for xspec in xspecs:
            self.makegateway(xspec)
        atexit.register(self._cleanup_atexit)

    def __repr__(self):
        idgateways = [gw.id for gw in self]
        return "<Group %r>" %(idgateways)

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._gateways[key]
        for gw in self._gateways:
            if gw == key or gw.id == key:
                return gw
        raise KeyError(key)

    def __contains__(self, key):
        try:
            self[key]
            return True
        except KeyError:
            return False

    def __len__(self):
        return len(self._gateways)

    def __iter__(self):
        return iter(list(self._gateways))

    def makegateway(self, spec=None):
        """create and configure a gateway to a Python interpreter.
        The ``spec`` string encodes the target gateway type
        and configuration information. The general format is::

            key1=value1//key2=value2//...

        If you leave out the ``=value`` part a True value is assumed.
        Valid types: ``popen``, ``ssh=hostname``, ``socket=host:port``.
        Valid configuration::

            id=<string>     specifies the gateway id
            python=<path>   specifies which python interpreter to execute
            chdir=<path>    specifies to which directory to change
            nice=<path>     specifies process priority of new process
            env:NAME=value  specifies a remote environment variable setting.

        If no spec is given, self.defaultspec is used.
        """
        if not spec:
            spec = self.defaultspec
        if not isinstance(spec, XSpec):
            spec = XSpec(spec)
        self.allocate_id(spec)
        if spec.via:
            assert not spec.socket
            master = self[spec.via]
            channel = master.remote_exec(gateway_io)
            channel.send(vars(spec))
            io = gateway_io.RemoteIO(channel)
            gw = gateway_bootstrap.bootstrap(io, spec)
        elif spec.popen or spec.ssh:
            io = gateway_io.create_io(spec)
            gw = gateway_bootstrap.bootstrap(io, spec)
        elif spec.socket:
            from execnet import gateway_socket
            io = gateway_socket.create_io(spec, self)
            gw = gateway_bootstrap.bootstrap(io, spec)
        else:
            raise ValueError("no gateway type found for %r" % (spec._spec,))
        gw.spec = spec
        self._register(gw)
        if spec.chdir or spec.nice or spec.env:
            channel = gw.remote_exec("""
                import os
                path, nice, env = channel.receive()
                if path:
                    if not os.path.exists(path):
                        os.mkdir(path)
                    os.chdir(path)
                if nice and hasattr(os, 'nice'):
                    os.nice(nice)
                if env:
                    for name, value in env.items():
                        os.environ[name] = value
            """)
            nice = spec.nice and int(spec.nice) or 0
            channel.send((spec.chdir, nice, spec.env))
            channel.waitclose()
        return gw

    def allocate_id(self, spec):
        """ allocate id for the given xspec object. """
        if spec.id is None:
            id = "gw" + str(self._autoidcounter)
            self._autoidcounter += 1
            if id in self:
                raise ValueError("already have gateway with id %r" %(id,))
            spec.id = id

    def _register(self, gateway):
        assert not hasattr(gateway, '_group')
        assert gateway.id
        assert id not in self
        self._gateways.append(gateway)
        gateway._group = self

    def _unregister(self, gateway):
        self._gateways.remove(gateway)
        self._gateways_to_join.append(gateway)

    def _cleanup_atexit(self):
        trace("=== atexit cleanup %r ===" %(self,))
        self.terminate(timeout=1.0)

    def terminate(self, timeout=None):
        """ trigger exit of member gateways and wait for termination
        of member gateways and associated subprocesses.  After waiting
        timeout seconds try to to kill local sub processes of popen-
        and ssh-gateways.  Timeout defaults to None meaning
        open-ended waiting and no kill attempts.
        """

        while self:
            from execnet.threadpool import WorkerPool
            vias = {}
            for gw in self:
                if gw.spec.via:
                    vias[gw.spec.via] = True
            for gw in self:
                if gw.id not in vias:
                    gw.exit()

            def join_wait(gw):
                gw.join()
                gw._io.wait()
            def kill(gw):
                trace("Gateways did not come down after timeout: %r" % gw)
                gw._io.kill()

            safe_terminate(timeout, [
                (lambda: join_wait(gw), lambda: kill(gw))
                for gw in self._gateways_to_join])
            self._gateways_to_join[:] = []

    def remote_exec(self, source, **kwargs):
        """ remote_exec source on all member gateways and return
            MultiChannel connecting to all sub processes.
        """
        channels = []
        for gw in self:
            channels.append(gw.remote_exec(source, **kwargs))
        return MultiChannel(channels)

class MultiChannel:
    def __init__(self, channels):
        self._channels = channels

    def __len__(self):
        return len(self._channels)

    def __iter__(self):
        return iter(self._channels)

    def __getitem__(self, key):
        return self._channels[key]

    def __contains__(self, chan):
        return chan in self._channels

    def send_each(self, item):
        for ch in self._channels:
            ch.send(item)

    def receive_each(self, withchannel=False):
        assert not hasattr(self, '_queue')
        l = []
        for ch in self._channels:
            obj = ch.receive()
            if withchannel:
                l.append((ch, obj))
            else:
                l.append(obj)
        return l

    def make_receive_queue(self, endmarker=NO_ENDMARKER_WANTED):
        try:
            return self._queue
        except AttributeError:
            self._queue = queue.Queue()
            for ch in self._channels:
                def putreceived(obj, channel=ch):
                    self._queue.put((channel, obj))
                if endmarker is NO_ENDMARKER_WANTED:
                    ch.setcallback(putreceived)
                else:
                    ch.setcallback(putreceived, endmarker=endmarker)
            return self._queue


    def waitclose(self):
        first = None
        for ch in self._channels:
            try:
                ch.waitclose()
            except ch.RemoteError:
                if first is None:
                    first = sys.exc_info()
        if first:
            reraise(*first)



def safe_terminate(timeout, list_of_paired_functions):
    workerpool = WorkerPool(len(list_of_paired_functions)*2)

    def termkill(termfunc, killfunc):
        termreply = workerpool.dispatch(termfunc)
        try:
            termreply.get(timeout=timeout)
        except IOError:
            killfunc()

    replylist = []
    for termfunc, killfunc in list_of_paired_functions:
        reply = workerpool.dispatch(termkill, termfunc, killfunc)
        replylist.append(reply)
    for reply in replylist:
        reply.get()


default_group = Group()
makegateway = default_group.makegateway

