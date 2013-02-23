"""
base execnet gateway code send to the other side for bootstrapping.

NOTE: aims to be compatible to Python 2.3-3.1, Jython and IronPython

(C) 2004-2009 Holger Krekel, Armin Rigo, Benjamin Peterson, and others
"""
import sys, os, weakref
import threading, traceback, struct
try:
    import queue
except ImportError:
    import Queue as queue

try:
    from io import BytesIO
except:
    from StringIO import StringIO as BytesIO

ISPY3 = sys.version_info >= (3, 0)
if ISPY3:
    exec("def do_exec(co, loc): exec(co, loc)\n"
         "def reraise(cls, val, tb): raise val\n")
    unicode = str
    _long_type = int
    from _thread import interrupt_main
else:
    exec("def do_exec(co, loc): exec co in loc\n"
         "def reraise(cls, val, tb): raise cls, val, tb\n")
    bytes = str
    _long_type = long
    try:
        from thread import interrupt_main
    except ImportError:
        interrupt_main = None

sysex = (KeyboardInterrupt, SystemExit)


DEBUG = os.environ.get('EXECNET_DEBUG')
pid = os.getpid()
if DEBUG == '2':
    def trace(*msg):
        try:
            line = " ".join(map(str, msg))
            sys.stderr.write("[%s] %s\n" % (pid, line))
            sys.stderr.flush()
        except Exception:
            pass # nothing we can do, likely interpreter-shutdown
elif DEBUG:
    import tempfile, os.path
    fn = os.path.join(tempfile.gettempdir(), 'execnet-debug-%d' % pid)
    #sys.stderr.write("execnet-debug at %r" %(fn,))
    debugfile = open(fn, 'w')
    def trace(*msg):
        try:
            line = " ".join(map(str, msg))
            debugfile.write(line + "\n")
            debugfile.flush()
        except Exception:
            try:
                v = sys.exc_info()[1]
                sys.stderr.write(
                    "[%s] exception during tracing: %r\n" % (pid, v))
            except Exception:
                pass # nothing we can do, likely interpreter-shutdown
else:
    notrace = trace = lambda *msg: None

class Popen2IO:
    error = (IOError, OSError, EOFError)

    def __init__(self, outfile, infile):
        # we need raw byte streams
        self.outfile, self.infile = outfile, infile
        if sys.platform == "win32":
            import msvcrt
            try:
                msvcrt.setmode(infile.fileno(), os.O_BINARY)
                msvcrt.setmode(outfile.fileno(), os.O_BINARY)
            except (AttributeError, IOError):
                pass
        self._read = getattr(infile, "buffer", infile).read
        self._write = getattr(outfile, "buffer", outfile).write

    def read(self, numbytes):
        """Read exactly 'numbytes' bytes from the pipe. """
        # a file in non-blocking mode may return less bytes, so we loop
        buf = bytes()
        while numbytes > len(buf):
            data = self._read(numbytes-len(buf))
            if not data:
                raise EOFError("expected %d bytes, got %d" %(numbytes, len(buf)))
            buf += data
        return buf

    def write(self, data):
        """write out all data bytes. """
        assert isinstance(data, bytes)
        self._write(data)
        self.outfile.flush()

    def close_read(self):
        self.infile.close()

    def close_write(self):
        self.outfile.close()

class Message:
    """ encapsulates Messages and their wire protocol. """
    _types = []

    def __init__(self, msgcode, channelid=0, data=''):
        self.msgcode = msgcode
        self.channelid = channelid
        self.data = data

    @staticmethod
    def from_io(io):
        try:
            header = io.read(9) # type 1, channel 4, payload 4
        except EOFError:
            e = sys.exc_info()[1]
            raise EOFError('couldnt load message header, ' + e.args[0])
        msgtype, channel, payload = struct.unpack('!bii', header)
        return Message(msgtype, channel, io.read(payload))

    def to_io(self, io):
        header = struct.pack('!bii', self.msgcode, self.channelid, len(self.data))
        io.write(header+self.data)

    def received(self, gateway):
        self._types[self.msgcode](self, gateway)

    def __repr__(self):
        class FakeChannel(object):
            _strconfig = False, False # never transform, never fail
            def __init__(self, id):
                self.id = id
            def __repr__(self):
                return '<Channel %s>' % self.id
        FakeChannel.new = FakeChannel
        FakeChannel.gateway = FakeChannel
        name = self._types[self.msgcode].__name__.upper()
        try:
            data = loads_internal(self.data, FakeChannel)
        except LoadError:
            data = self.data
        r = repr(data)
        if len(r) > 90:
            return "<Message.%s channelid=%d len=%d>" %(name,
                        self.channelid, len(r))
        else:
            return "<Message.%s channelid=%d %s>" %(name,
                        self.channelid, r)

def _setupmessages():
    def status(message, gateway):
        # we use the channelid to send back information
        # but don't instantiate a channel object
        active_channels = gateway._channelfactory.channels()
        numexec = 0
        for ch in active_channels:
            if getattr(ch, '_executing', False):
                numexec += 1
        d = {'execqsize': gateway._execqueue.qsize(),
             'numchannels': len(active_channels),
             'numexecuting': numexec
        }
        gateway._send(Message.CHANNEL_DATA, message.channelid, dumps_internal(d))

    def channel_exec(message, gateway):
        channel = gateway._channelfactory.new(message.channelid)
        gateway._local_schedulexec(channel=channel,sourcetask=message.data)

    def channel_data(message, gateway):
        gateway._channelfactory._local_receive(message.channelid, message.data)

    def channel_close(message, gateway):
        gateway._channelfactory._local_close(message.channelid)

    def channel_close_error(message, gateway):
        remote_error = RemoteError(loads_internal(message.data))
        gateway._channelfactory._local_close(message.channelid, remote_error)

    def channel_last_message(message, gateway):
        gateway._channelfactory._local_close(message.channelid, sendonly=True)

    def gateway_terminate(message, gateway):
        gateway._terminate_execution()
        raise SystemExit(0)

    def reconfigure(message, gateway):
        if message.channelid == 0:
            target = gateway
        else:
            target = gateway._channelfactory.new(message.channelid)
        target._strconfig = loads_internal(message.data, gateway)

    types = [
        status, reconfigure, gateway_terminate,
        channel_exec, channel_data, channel_close,
        channel_close_error, channel_last_message,
    ]
    for i, handler in enumerate(types):
        Message._types.append(handler)
        setattr(Message, handler.__name__.upper(), i)

_setupmessages()

def geterrortext(excinfo,
    format_exception=traceback.format_exception, sysex=sysex):
    try:
        l = format_exception(*excinfo)
        errortext = "".join(l)
    except sysex:
        raise
    except:
        errortext = '%s: %s' % (excinfo[0].__name__,
                                excinfo[1])
    return errortext

class RemoteError(Exception):
    """ Exception containing a stringified error from the other side. """
    def __init__(self, formatted):
        self.formatted = formatted
        Exception.__init__(self)

    def __str__(self):
        return self.formatted

    def __repr__(self):
        return "%s: %s" %(self.__class__.__name__, self.formatted)

    def warn(self):
        if self.formatted != INTERRUPT_TEXT:
            # XXX do this better
            sys.stderr.write("Warning: unhandled %r\n" % (self,))

class TimeoutError(IOError):
    """ Exception indicating that a timeout was reached. """


NO_ENDMARKER_WANTED = object()

class Channel(object):
    """Communication channel between two Python Interpreter execution points."""
    RemoteError = RemoteError
    TimeoutError = TimeoutError
    _INTERNALWAKEUP = 1000
    _executing = False

    def __init__(self, gateway, id):
        assert isinstance(id, int)
        self.gateway = gateway
        #XXX: defaults copied from Unserializer
        self._strconfig = getattr(gateway, '_strconfig', (True, False))
        self.id = id
        self._items = queue.Queue()
        self._closed = False
        self._receiveclosed = threading.Event()
        self._remoteerrors = []

    def _trace(self, *msg):
        self.gateway._trace(self.id, *msg)

    def setcallback(self, callback, endmarker=NO_ENDMARKER_WANTED):
        """ set a callback function for receiving items.

            All already queued items will immediately trigger the callback.
            Afterwards the callback will execute in the receiver thread
            for each received data item and calls to ``receive()`` will
            raise an error.
            If an endmarker is specified the callback will eventually
            be called with the endmarker when the channel closes.
        """
        _callbacks = self.gateway._channelfactory._callbacks
        _receivelock = self.gateway._receivelock
        _receivelock.acquire()
        try:
            if self._items is None:
                raise IOError("%r has callback already registered" %(self,))
            items = self._items
            self._items = None
            while 1:
                try:
                    olditem = items.get(block=False)
                except queue.Empty:
                    if not (self._closed or self._receiveclosed.isSet()):
                        _callbacks[self.id] = (
                            callback,
                            endmarker,
                            self._strconfig,
                        )
                    break
                else:
                    if olditem is ENDMARKER:
                        items.put(olditem) # for other receivers
                        if endmarker is not NO_ENDMARKER_WANTED:
                            callback(endmarker)
                        break
                    else:
                        callback(olditem)
        finally:
            _receivelock.release()

    def __repr__(self):
        flag = self.isclosed() and "closed" or "open"
        return "<Channel id=%d %s>" % (self.id, flag)

    def __del__(self):
        if self.gateway is None:   # can be None in tests
            return
        self._trace("channel.__del__")
        # no multithreading issues here, because we have the last ref to 'self'
        if self._closed:
            # state transition "closed" --> "deleted"
            for error in self._remoteerrors:
                error.warn()
        elif self._receiveclosed.isSet():
            # state transition "sendonly" --> "deleted"
            # the remote channel is already in "deleted" state, nothing to do
            pass
        else:
            # state transition "opened" --> "deleted"
            if self._items is None:    # has_callback
                msgcode = Message.CHANNEL_LAST_MESSAGE
            else:
                msgcode = Message.CHANNEL_CLOSE
            try:
                self.gateway._send(msgcode, self.id)
            except (IOError, ValueError): # ignore problems with sending
                pass

    def _getremoteerror(self):
        try:
            return self._remoteerrors.pop(0)
        except IndexError:
            try:
                return self.gateway._error
            except AttributeError:
                pass
            return None

    #
    # public API for channel objects
    #
    def isclosed(self):
        """ return True if the channel is closed. A closed
            channel may still hold items.
        """
        return self._closed

    def makefile(self, mode='w', proxyclose=False):
        """ return a file-like object.
            mode can be 'w' or 'r' for writeable/readable files.
            if proxyclose is true file.close() will also close the channel.
        """
        if mode == "w":
            return ChannelFileWrite(channel=self, proxyclose=proxyclose)
        elif mode == "r":
            return ChannelFileRead(channel=self, proxyclose=proxyclose)
        raise ValueError("mode %r not availabe" %(mode,))

    def close(self, error=None):
        """ close down this channel with an optional error message.
            Note that closing of a channel tied to remote_exec happens
            automatically at the end of execution and cannot be done explicitely.
        """
        if self._executing:
            raise IOError("cannot explicitly close channel within remote_exec")
        if self._closed:
            self.gateway._trace(self, "ignoring redundant call to close()")
        if not self._closed:
            # state transition "opened/sendonly" --> "closed"
            # threads warning: the channel might be closed under our feet,
            # but it's never damaging to send too many CHANNEL_CLOSE messages
            # however, if the other side triggered a close already, we
            # do not send back a closed message.
            if not self._receiveclosed.isSet():
                put = self.gateway._send
                if error is not None:
                    put(Message.CHANNEL_CLOSE_ERROR, self.id, dumps_internal(error))
                else:
                    put(Message.CHANNEL_CLOSE, self.id)
                self._trace("sent channel close message")
            if isinstance(error, RemoteError):
                self._remoteerrors.append(error)
            self._closed = True         # --> "closed"
            self._receiveclosed.set()
            queue = self._items
            if queue is not None:
                queue.put(ENDMARKER)
            self.gateway._channelfactory._no_longer_opened(self.id)

    def waitclose(self, timeout=None):
        """ wait until this channel is closed (or the remote side
        otherwise signalled that no more data was being sent).
        The channel may still hold receiveable items, but not receive
        any more after waitclose() has returned.  Exceptions from executing
        code on the other side are reraised as local channel.RemoteErrors.
        EOFError is raised if the reading-connection was prematurely closed,
        which often indicates a dying process.
        self.TimeoutError is raised after the specified number of seconds
        (default is None, i.e. wait indefinitely).
        """
        self._receiveclosed.wait(timeout=timeout) # wait for non-"opened" state
        if not self._receiveclosed.isSet():
            raise self.TimeoutError("Timeout after %r seconds" % timeout)
        error = self._getremoteerror()
        if error:
            raise error

    def send(self, item):
        """sends the given item to the other side of the channel,
        possibly blocking if the sender queue is full.
        The item must be a simple python type and will be
        copied to the other side by value.  IOError is
        raised if the write pipe was prematurely closed.
        """
        if self.isclosed():
            raise IOError("cannot send to %r" %(self,))
        self.gateway._send(Message.CHANNEL_DATA, self.id, dumps_internal(item))

    def receive(self, timeout=-1):
        """receive a data item that was sent from the other side.
        timeout: -1 [default] blocked waiting, but wake up periodically
        to let CTRL-C through.  A positive number indicates the
        number of seconds after which a channel.TimeoutError exception
        will be raised if no item was received.
        Note that exceptions from the remotely executing code will be
        reraised as channel.RemoteError exceptions containing
        a textual representation of the remote traceback.
        """
        itemqueue = self._items
        if itemqueue is None:
            raise IOError("cannot receive(), channel has receiver callback")
        if timeout < 0:
            internal_timeout = self._INTERNALWAKEUP
        else:
            internal_timeout = timeout

        while 1:
            try:
                x = itemqueue.get(timeout=internal_timeout)
                break
            except queue.Empty:
                if timeout < 0:
                    continue
                raise self.TimeoutError("no item after %r seconds" %(timeout))
        if x is ENDMARKER:
            itemqueue.put(x)  # for other receivers
            raise self._getremoteerror() or EOFError()
        else:
            return x

    def __iter__(self):
        return self

    def next(self):
        try:
            return self.receive()
        except EOFError:
            raise StopIteration
    __next__ = next


    def reconfigure(self, py2str_as_py3str=True, py3str_as_py2str=False):
        """
        set the string coercion for this channel
        the default is to try to convert py2 str as py3 str,
        but not to try and convert py3 str to py2 str
        """
        self._strconfig = (py2str_as_py3str, py3str_as_py2str)
        data = dumps_internal(self._strconfig)
        self.gateway._send(Message.RECONFIGURE, self.id, data=data)

ENDMARKER = object()
INTERRUPT_TEXT = "keyboard-interrupted"

class ChannelFactory(object):
    def __init__(self, gateway, startcount=1):
        self._channels = weakref.WeakValueDictionary()
        self._callbacks = {}
        self._writelock = threading.Lock()
        self.gateway = gateway
        self.count = startcount
        self.finished = False
        self._list = list # needed during interp-shutdown

    def new(self, id=None):
        """ create a new Channel with 'id' (or create new id if None). """
        self._writelock.acquire()
        try:
            if self.finished:
                raise IOError("connexion already closed: %s" % (self.gateway,))
            if id is None:
                id = self.count
                self.count += 2
            try:
                channel = self._channels[id]
            except KeyError:
                channel = self._channels[id] = Channel(self.gateway, id)
            return channel
        finally:
            self._writelock.release()

    def channels(self):
        return self._list(self._channels.values())

    #
    # internal methods, called from the receiver thread
    #
    def _no_longer_opened(self, id):
        try:
            del self._channels[id]
        except KeyError:
            pass
        try:
            callback, endmarker, strconfig = self._callbacks.pop(id)
        except KeyError:
            pass
        else:
            if endmarker is not NO_ENDMARKER_WANTED:
                callback(endmarker)

    def _local_close(self, id, remoteerror=None, sendonly=False):
        channel = self._channels.get(id)
        if channel is None:
            # channel already in "deleted" state
            if remoteerror:
                remoteerror.warn()
            self._no_longer_opened(id)
        else:
            # state transition to "closed" state
            if remoteerror:
                channel._remoteerrors.append(remoteerror)
            queue = channel._items
            if queue is not None:
                queue.put(ENDMARKER)
            self._no_longer_opened(id)
            if not sendonly: # otherwise #--> "sendonly"
                channel._closed = True          # --> "closed"
            channel._receiveclosed.set()

    def _local_receive(self, id, data):
        # executes in receiver thread
        try:
            callback, endmarker, strconfig= self._callbacks[id]
            channel = self._channels.get(id)
        except KeyError:
            channel = self._channels.get(id)
            queue = channel and channel._items
            if queue is None:
                pass    # drop data
            else:
                queue.put(loads_internal(data, channel))
        else:
            try:
                data = loads_internal(data, channel, strconfig)
                callback(data)   # even if channel may be already closed
            except KeyboardInterrupt:
                raise
            except:
                excinfo = sys.exc_info()
                self.gateway._trace("exception during callback: %s" % excinfo[1])
                errortext = self.gateway._geterrortext(excinfo)
                self.gateway._send(Message.CHANNEL_CLOSE_ERROR, id, dumps_internal(errortext))
                self._local_close(id, errortext)

    def _finished_receiving(self):
        self._writelock.acquire()
        try:
            self.finished = True
        finally:
            self._writelock.release()
        for id in self._list(self._channels):
            self._local_close(id, sendonly=True)
        for id in self._list(self._callbacks):
            self._no_longer_opened(id)

class ChannelFile(object):
    def __init__(self, channel, proxyclose=True):
        self.channel = channel
        self._proxyclose = proxyclose

    def isatty(self):
        return False

    def close(self):
        if self._proxyclose:
            self.channel.close()

    def __repr__(self):
        state = self.channel.isclosed() and 'closed' or 'open'
        return '<ChannelFile %d %s>' %(self.channel.id, state)

class ChannelFileWrite(ChannelFile):
    def write(self, out):
        self.channel.send(out)

    def flush(self):
        pass

class ChannelFileRead(ChannelFile):
    def __init__(self, channel, proxyclose=True):
        super(ChannelFileRead, self).__init__(channel, proxyclose)
        self._buffer = None

    def read(self, n):
        try:
            if self._buffer is None:
                self._buffer = self.channel.receive()
            while len(self._buffer) < n:
                self._buffer += self.channel.receive()
        except EOFError:
            self.close()
        if self._buffer is None:
            ret = ""
        else:
            ret = self._buffer[:n]
            self._buffer = self._buffer[n:]
        return ret

    def readline(self):
        if self._buffer is not None:
            i = self._buffer.find("\n")
            if i != -1:
                return self.read(i+1)
            line = self.read(len(self._buffer)+1)
        else:
            line = self.read(1)
        while line and line[-1] != "\n":
            c = self.read(1)
            if not c:
                break
            line += c
        return line

class BaseGateway(object):
    exc_info = sys.exc_info
    _sysex = sysex
    id = "<slave>"

    class _StopExecLoop(Exception):
        pass

    def __init__(self, io, id, _startcount=2):
        self._io = io
        self.id = id
        self._strconfig = Unserializer.py2str_as_py3str, Unserializer.py3str_as_py2str
        self._channelfactory = ChannelFactory(self, _startcount)
        self._receivelock = threading.RLock()
        # globals may be NONE at process-termination
        self.__trace = trace
        self._geterrortext = geterrortext

    def _trace(self, *msg):
        self.__trace(self.id, *msg)

    def _initreceive(self):
        self._receiverthread = threading.Thread(name="receiver",
                                 target=self._thread_receiver)
        self._receiverthread.setDaemon(1)
        self._receiverthread.start()

    def _thread_receiver(self):
        self._trace("RECEIVERTHREAD: starting to run")
        eof = False
        io = self._io
        try:
            try:
                while 1:
                    msg = Message.from_io(io)
                    self._trace("received", msg)
                    _receivelock = self._receivelock
                    _receivelock.acquire()
                    try:
                        msg.received(self)
                        del msg
                    finally:
                        _receivelock.release()
            except self._sysex:
                self._trace("RECEIVERTHREAD: doing io.close_read()")
                self._io.close_read()
            except EOFError:
                self._trace("RECEIVERTHREAD: got EOFError")
                self._trace("RECEIVERTHREAD: traceback was: ",
                    self._geterrortext(self.exc_info()))
                self._error = self.exc_info()[1]
                eof = True
            except:
                self._trace("RECEIVERTHREAD", self._geterrortext(self.exc_info()))
        finally:
            try:
                self._trace('RECEIVERTHREAD', 'entering finalization')
                if eof:
                    self._terminate_execution()
                self._channelfactory._finished_receiving()
                self._trace('RECEIVERTHREAD', 'leaving finalization')
            except:
                pass # XXX be silent at interp-shutdown

    def _terminate_execution(self):
        pass

    def _send(self, msgcode, channelid=0, data=bytes()):
        message = Message(msgcode, channelid, data)
        try:
            message.to_io(self._io)
            self._trace('sent', message)
        except (IOError, ValueError):
            e = sys.exc_info()[1]
            self._trace('failed to send', message, e)
            raise


    def _local_schedulexec(self, channel, sourcetask):
        channel.close("execution disallowed")

    # _____________________________________________________________________
    #
    # High Level Interface
    # _____________________________________________________________________
    #
    def newchannel(self):
        """ return a new independent channel. """
        return self._channelfactory.new()

    def join(self, timeout=None):
        """ Wait for receiverthread to terminate. """
        current = threading.currentThread()
        if self._receiverthread.isAlive():
            self._trace("joining receiver thread")
            self._receiverthread.join(timeout)
        else:
            self._trace("gateway.join() called while receiverthread "
                        "already finished")

class SlaveGateway(BaseGateway):
    def _local_schedulexec(self, channel, sourcetask):
        sourcetask = loads_internal(sourcetask)
        self._execqueue.put((channel, sourcetask))

    def _terminate_execution(self):
        # called from receiverthread
        self._trace("putting None to execqueue")
        self._execqueue.put(None)
        if interrupt_main:
            self._trace("calling interrupt_main()")
            interrupt_main()
        self._execfinished.wait(10.0)
        if not self._execfinished.isSet():
            self._trace("execution did not finish in 10 secs, calling os._exit()")
            os._exit(1)

    def serve(self, joining=True):
        try:
            try:
                self._execqueue = queue.Queue()
                self._execfinished = threading.Event()
                self._initreceive()
                while 1:
                    item = self._execqueue.get()
                    if item is None:
                        break
                    try:
                        self.executetask(item)
                    except self._StopExecLoop:
                        break
            finally:
                self._execfinished.set()
                self._trace("io.close_write()")
                self._io.close_write()
                self._trace("slavegateway.serve finished")
            if joining:
                self.join()
        except KeyboardInterrupt:
            # in the slave we can't really do anything sensible
            self._trace("swallowing keyboardinterrupt in main-thread")

    def executetask(self, item):
        try:
            channel, (source, call_name, kwargs) = item
            if not ISPY3 and kwargs:
                # some python2 versions do not accept unicode keyword params
                # note: Unserializer generally turns py2-str to py3-str objects
                newkwargs = {}
                for name, value in kwargs.items():
                    if isinstance(name, unicode):
                        name = name.encode('ascii')
                    newkwargs[name] = value
                kwargs = newkwargs
            loc = {'channel' : channel, '__name__': '__channelexec__'}
            self._trace("execution starts[%s]: %s" %
                            (channel.id, repr(source)[:50]))
            channel._executing = True
            try:
                co = compile(source+'\n', '', 'exec')
                do_exec(co, loc)
                if call_name:
                    self._trace('calling %s(**%60r)' % (call_name, kwargs))
                    function = loc[call_name]
                    function(channel, **kwargs)
            finally:
                channel._executing = False
                self._trace("execution finished")
        except self._StopExecLoop:
            channel.close()
            raise
        except KeyboardInterrupt:
            channel.close(INTERRUPT_TEXT)
            raise
        except:
            excinfo = self.exc_info()
            self._trace("got exception: %s" % (excinfo[1],))
            errortext = self._geterrortext(excinfo)
            channel.close(errortext)
        else:
            channel.close()

#
# Cross-Python pickling code, tested from test_serializer.py
#

class DataFormatError(Exception):
    pass

class DumpError(DataFormatError):
    """Error while serializing an object."""

class LoadError(DataFormatError):
    """Error while unserializing an object."""

if ISPY3:
    def bchr(n):
        return bytes([n])
else:
    bchr = chr

DUMPFORMAT_VERSION = bchr(1)

FOUR_BYTE_INT_MAX = 2147483647

FLOAT_FORMAT = "!d"
FLOAT_FORMAT_SIZE = struct.calcsize(FLOAT_FORMAT)

class _Stop(Exception):
    pass

class Unserializer(object):
    num2func = {} # is filled after this class definition
    py2str_as_py3str = True # True
    py3str_as_py2str = False  # false means py2 will get unicode

    def __init__(self, stream, channel_or_gateway=None, strconfig=None):
        gateway = getattr(channel_or_gateway, 'gateway', channel_or_gateway)
        strconfig = getattr(channel_or_gateway, '_strconfig', strconfig)
        if strconfig:
            self.py2str_as_py3str, self.py3str_as_py2str = strconfig
        self.stream = stream
        self.channelfactory = getattr(gateway, '_channelfactory', gateway)

    def load(self, versioned=False):
        if versioned:
            ver = self.stream.read(1)
            if ver != DUMPFORMAT_VERSION:
                raise LoadError("wrong dumpformat version")
        self.stack = []
        try:
            while True:
                opcode = self.stream.read(1)
                if not opcode:
                    raise EOFError
                try:
                    loader = self.num2func[opcode]
                except KeyError:
                    raise LoadError("unkown opcode %r - "
                        "wire protocol corruption?" % (opcode,))
                loader(self)
        except _Stop:
            if len(self.stack) != 1:
                raise LoadError("internal unserialization error")
            return self.stack.pop(0)
        else:
            raise LoadError("didn't get STOP")

    def load_none(self):
        self.stack.append(None)

    def load_true(self):
        self.stack.append(True)

    def load_false(self):
        self.stack.append(False)

    def load_int(self):
        i = self._read_int4()
        self.stack.append(i)

    def load_longint(self):
        s = self._read_byte_string()
        self.stack.append(int(s))

    if ISPY3:
        load_long = load_int
        load_longlong = load_longint
    else:
        def load_long(self):
            i = self._read_int4()
            self.stack.append(long(i))

        def load_longlong(self):
            l = self._read_byte_string()
            self.stack.append(long(l))

    def load_float(self):
        binary = self.stream.read(FLOAT_FORMAT_SIZE)
        self.stack.append(struct.unpack(FLOAT_FORMAT, binary)[0])

    def _read_int4(self):
        return struct.unpack("!i", self.stream.read(4))[0]

    def _read_byte_string(self):
        length = self._read_int4()
        as_bytes = self.stream.read(length)
        return as_bytes

    def load_py3string(self):
        as_bytes = self._read_byte_string()
        if not ISPY3 and self.py3str_as_py2str:
            # XXX Should we try to decode into latin-1?
            self.stack.append(as_bytes)
        else:
            self.stack.append(as_bytes.decode("utf-8"))

    def load_py2string(self):
        as_bytes = self._read_byte_string()
        if ISPY3 and self.py2str_as_py3str:
            s = as_bytes.decode("latin-1")
        else:
            s = as_bytes
        self.stack.append(s)

    def load_bytes(self):
        s = self._read_byte_string()
        self.stack.append(s)

    def load_unicode(self):
        self.stack.append(self._read_byte_string().decode("utf-8"))

    def load_newlist(self):
        length = self._read_int4()
        self.stack.append([None] * length)

    def load_setitem(self):
        if len(self.stack) < 3:
            raise LoadError("not enough items for setitem")
        value = self.stack.pop()
        key = self.stack.pop()
        self.stack[-1][key] = value

    def load_newdict(self):
        self.stack.append({})

    def _load_collection(self, type_):
        length = self._read_int4()
        if length:
            res = type_(self.stack[-length:])
            del self.stack[-length:]
            self.stack.append(res)
        else:
            self.stack.append(type_())

    def load_buildtuple(self):
        self._load_collection(tuple)

    def load_set(self):
        self._load_collection(set)

    def load_frozenset(self):
        self._load_collection(frozenset)

    def load_stop(self):
        raise _Stop

    def load_channel(self):
        id = self._read_int4()
        newchannel = self.channelfactory.new(id)
        self.stack.append(newchannel)

# automatically build opcodes and byte-encoding

class opcode:
    """ container for name -> num mappings. """

def _buildopcodes():
    l = []
    for name, func in Unserializer.__dict__.items():
        if name.startswith("load_"):
            opname = name[5:].upper()
            l.append((opname, func))
    l.sort()
    for i,(opname, func) in enumerate(l):
        assert i < 26, "xxx"
        i = bchr(64+i)
        Unserializer.num2func[i] = func
        setattr(opcode, opname, i)

_buildopcodes()

def dumps(obj):
    """ return a serialized bytestring of the given obj.

    The obj and all contained objects must be of a builtin
    python type (so nested dicts, sets, etc. are all ok but
    not user-level instances).
    """
    return _Serializer().save(obj, versioned=True)

def loads(bytestring, py2str_as_py3str=False, py3str_as_py2str=False):
    """ return the object as deserialized from the given bytestring.

    py2str_as_py3str: if true then string (str) objects previously
                      dumped on Python2 will be loaded as Python3
                      strings which really are text objects.
    py3str_as_py2str: if true then string (str) objects previously
                      dumped on Python3 will be loaded as Python2
                      strings instead of unicode objects.

    if the bytestring was dumped with an incompatible protocol
    version or if the bytestring is corrupted, the
    ``execnet.DataFormatError`` will be raised.
    """
    strconfig=(py2str_as_py3str, py3str_as_py2str)
    io = BytesIO(bytestring)
    return Unserializer(io, strconfig=strconfig).load(versioned=True)

def loads_internal(bytestring, channelfactory=None, strconfig=None):
    io = BytesIO(bytestring)
    return Unserializer(io, channelfactory, strconfig).load()

def dumps_internal(obj):
    return _Serializer().save(obj)


class _Serializer(object):
    _dispatch = {}

    def __init__(self):
        self._streamlist = []

    def _write(self, data):
        self._streamlist.append(data)

    def save(self, obj, versioned=False):
        # calling here is not re-entrant but multiple instances
        # may write to the same stream because of the common platform
        # atomic-write guaruantee (concurrent writes each happen atomicly)
        if versioned:
            self._write(DUMPFORMAT_VERSION)
        self._save(obj)
        self._write(opcode.STOP)
        s = type(self._streamlist[0])().join(self._streamlist)
        return s

    def _save(self, obj):
        tp = type(obj)
        try:
            dispatch = self._dispatch[tp]
        except KeyError:
            methodname = 'save_' + tp.__name__
            meth = getattr(self.__class__, methodname, None)
            if meth is None:
                raise DumpError("can't serialize %s" % (tp,))
            dispatch = self._dispatch[tp] = meth
        dispatch(self, obj)

    def save_NoneType(self, non):
        self._write(opcode.NONE)

    def save_bool(self, boolean):
        if boolean:
            self._write(opcode.TRUE)
        else:
            self._write(opcode.FALSE)

    def save_bytes(self, bytes_):
        self._write(opcode.BYTES)
        self._write_byte_sequence(bytes_)

    if ISPY3:
        def save_str(self, s):
            self._write(opcode.PY3STRING)
            self._write_unicode_string(s)
    else:
        def save_str(self, s):
            self._write(opcode.PY2STRING)
            self._write_byte_sequence(s)

        def save_unicode(self, s):
            self._write(opcode.UNICODE)
            self._write_unicode_string(s)

    def _write_unicode_string(self, s):
        try:
            as_bytes = s.encode("utf-8")
        except UnicodeEncodeError:
            raise DumpError("strings must be utf-8 encodable")
        self._write_byte_sequence(as_bytes)

    def _write_byte_sequence(self, bytes_):
        self._write_int4(len(bytes_), "string is too long")
        self._write(bytes_)

    def _save_integral(self, i, short_op, long_op):
        if i <= FOUR_BYTE_INT_MAX:
            self._write(short_op)
            self._write_int4(i)
        else:
            self._write(long_op)
            self._write_byte_sequence(str(i).rstrip("L").encode("ascii"))

    def save_int(self, i):
        self._save_integral(i, opcode.INT, opcode.LONGINT)

    def save_long(self, l):
        self._save_integral(l, opcode.LONG, opcode.LONGLONG)

    def save_float(self, flt):
        self._write(opcode.FLOAT)
        self._write(struct.pack(FLOAT_FORMAT, flt))

    def _write_int4(self, i, error="int must be less than %i" %
                    (FOUR_BYTE_INT_MAX,)):
        if i > FOUR_BYTE_INT_MAX:
            raise DumpError(error)
        self._write(struct.pack("!i", i))

    def save_list(self, L):
        self._write(opcode.NEWLIST)
        self._write_int4(len(L), "list is too long")
        for i, item in enumerate(L):
            self._write_setitem(i, item)

    def _write_setitem(self, key, value):
        self._save(key)
        self._save(value)
        self._write(opcode.SETITEM)

    def save_dict(self, d):
        self._write(opcode.NEWDICT)
        for key, value in d.items():
            self._write_setitem(key, value)

    def save_tuple(self, tup):
        for item in tup:
            self._save(item)
        self._write(opcode.BUILDTUPLE)
        self._write_int4(len(tup), "tuple is too long")

    def _write_set(self, s, op):
        for item in s:
            self._save(item)
        self._write(op)
        self._write_int4(len(s), "set is too long")

    def save_set(self, s):
        self._write_set(s, opcode.SET)

    def save_frozenset(self, s):
        self._write_set(s, opcode.FROZENSET)

    def save_Channel(self, channel):
        self._write(opcode.CHANNEL)
        self._write_int4(channel.id)

def init_popen_io():
    if not hasattr(os, 'dup'): # jython
        io = Popen2IO(sys.stdout, sys.stdin)
        import tempfile
        sys.stdin = tempfile.TemporaryFile('r')
        sys.stdout = tempfile.TemporaryFile('w')
    else:
        try:
            devnull = os.devnull
        except AttributeError:
            if os.name == 'nt':
                devnull = 'NUL'
            else:
                devnull = '/dev/null'
        # stdin
        stdin  = os.fdopen(os.dup(0), 'r', 1)
        fd = os.open(devnull, os.O_RDONLY)
        os.dup2(fd, 0)
        os.close(fd)

        # stdout
        stdout = os.fdopen(os.dup(1), 'w', 1)
        fd = os.open(devnull, os.O_WRONLY)
        os.dup2(fd, 1)

        # stderr for win32
        if os.name == 'nt':
            sys.stderr = os.fdopen(os.dup(2), 'w', 1)
            os.dup2(fd, 2)
        os.close(fd)
        io = Popen2IO(stdout, stdin)
        sys.stdin = os.fdopen(0, 'r', 1)
        sys.stdout = os.fdopen(1, 'w', 1)
    return io

def serve(io, id):
    trace("creating slavegateway on %r" %(io,))
    SlaveGateway(io=io, id=id, _startcount=2).serve()
