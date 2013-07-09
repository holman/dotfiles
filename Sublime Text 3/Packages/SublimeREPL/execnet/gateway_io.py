"""
execnet io initialization code

creates io instances used for gateway io
"""
import os
import sys
from subprocess import Popen, PIPE

try:
    from execnet.gateway_base import Popen2IO, Message
except ImportError:
    from __main__ import Popen2IO, Message

class Popen2IOMaster(Popen2IO):
    def __init__(self, args):
        self.popen = p = Popen(args, stdin=PIPE, stdout=PIPE)
        Popen2IO.__init__(self, p.stdin, p.stdout)

    def wait(self):
        try:
            return self.popen.wait()
        except OSError:
            pass  # subprocess probably dead already

    def kill(self):
        killpopen(self.popen)

def killpopen(popen):
    try:
        if hasattr(popen, 'kill'):
            popen.kill()
        else:
            killpid(popen.pid)
    except EnvironmentError:
        sys.stderr.write("ERROR killing: %s\n" %(sys.exc_info()[1]))
        sys.stderr.flush()

def killpid(pid):
    if hasattr(os, 'kill'):
        os.kill(pid, 15)
    elif sys.platform == "win32" or getattr(os, '_name', None) == 'nt':
        try:
            import ctypes
        except ImportError:
            import subprocess
            # T: treekill, F: Force
            cmd = ("taskkill /T /F /PID %d" %(pid)).split()
            ret = subprocess.call(cmd)
            if ret != 0:
                raise EnvironmentError("taskkill returned %r" %(ret,))
        else:
            PROCESS_TERMINATE = 1
            handle = ctypes.windll.kernel32.OpenProcess(
                        PROCESS_TERMINATE, False, pid)
            ctypes.windll.kernel32.TerminateProcess(handle, -1)
            ctypes.windll.kernel32.CloseHandle(handle)
    else:
        raise EnvironmentError("no method to kill %s" %(pid,))



popen_bootstrapline = "import sys;exec(eval(sys.stdin.readline()))"


def popen_args(spec):
    python = spec.python or sys.executable
    args = [str(python), '-u']
    if spec is not None and spec.dont_write_bytecode:
        args.append("-B")
    # Slight gymnastics in ordering these arguments because CPython (as of
    # 2.7.1) ignores -B if you provide `python -c "something" -B`
    args.extend(['-c', popen_bootstrapline])
    return args

def ssh_args(spec):
    remotepython = spec.python or 'python'
    args = ['ssh', '-C' ]
    if spec.ssh_config is not None:
        args.extend(['-F', str(spec.ssh_config)])
    remotecmd = '%s -c "%s"' %(remotepython, popen_bootstrapline)
    args.extend([spec.ssh, remotecmd])
    return args



def create_io(spec):
    if spec.popen:
        args = popen_args(spec)
        return Popen2IOMaster(args)
    if spec.ssh:
        args = ssh_args(spec)
        io = Popen2IOMaster(args)
        io.remoteaddress = spec.ssh
        return io

RIO_KILL = 1
RIO_WAIT = 2
RIO_REMOTEADDRESS = 3
RIO_CLOSE_WRITE = 4

class RemoteIO(object):
    def __init__(self, master_channel):
        self.iochan = master_channel.gateway.newchannel()
        self.controlchan = master_channel.gateway.newchannel()
        master_channel.send((self.iochan, self.controlchan))
        self.io = self.iochan.makefile('r')


    def read(self, nbytes):
        return self.io.read(nbytes)

    def write(self, data):
        return self.iochan.send(data)

    def _controll(self, event):
        self.controlchan.send(event)
        return self.controlchan.receive()

    def close_write(self):
        self._controll(RIO_CLOSE_WRITE)

    def kill(self):
        self._controll(RIO_KILL)

    def wait(self):
        return self._controll(RIO_WAIT)

    def __repr__(self):
        return '<RemoteIO via %s>' % (self.iochan.gateway.id, )


def serve_remote_io(channel):
    class PseudoSpec(object):
        def __getattr__(self, name):
            return None
    spec = PseudoSpec()
    spec.__dict__.update(channel.receive())
    io = create_io(spec)
    io_chan, control_chan = channel.receive()
    io_target = io_chan.makefile()

    def iothread():
        initial = io.read(1)
        assert initial == '1'.encode('ascii')
        channel.gateway._trace('initializing transfer io for', spec.id)
        io_target.write(initial)
        while True:
            message = Message.from_io(io)
            message.to_io(io_target)
    import threading
    thread = threading.Thread(name='io-forward-'+spec.id,
                              target=iothread)
    thread.setDaemon(True)
    thread.start()

    def iocallback(data):
        io.write(data)
    io_chan.setcallback(iocallback)


    def controll(data):
        if data==RIO_WAIT:
            control_chan.send(io.wait())
        elif data==RIO_KILL:
            control_chan.send(io.kill())
        elif data==RIO_REMOTEADDRESS:
            control_chan.send(io.remoteaddress)
        elif data==RIO_CLOSE_WRITE:
            control_chan.send(io.close_write())
    control_chan.setcallback(controll)

if __name__ == "__channelexec__":
    serve_remote_io(channel)
