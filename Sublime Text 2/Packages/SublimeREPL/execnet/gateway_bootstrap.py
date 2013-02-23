"""
code to initialize the remote side of a gateway once the io is created
"""
import os
import inspect
import execnet
from execnet import gateway_base
from execnet.gateway import Gateway
importdir = os.path.dirname(os.path.dirname(execnet.__file__))


class HostNotFound(Exception):
    pass


def bootstrap_popen(io, spec):
    sendexec(io,
        "import sys",
        "sys.path.insert(0, %r)" % importdir,
        "from execnet.gateway_base import serve, init_popen_io",
        "sys.stdout.write('1')",
        "sys.stdout.flush()",
        "serve(init_popen_io(), id='%s-slave')" % spec.id,
    )
    s = io.read(1)
    assert s == "1".encode('ascii')


def bootstrap_ssh(io, spec):
    try:
        sendexec(io,
            inspect.getsource(gateway_base),
            'io = init_popen_io()',
            "io.write('1'.encode('ascii'))",
            "serve(io, id='%s-slave')" % spec.id,
        )
        s = io.read(1)
        assert s == "1".encode('ascii')
    except EOFError:
        ret = io.wait()
        if ret == 255:
            raise HostNotFound(io.remoteaddress)


def bootstrap_socket(io, id):
    #XXX: switch to spec
    from execnet.gateway_socket import SocketIO

    sendexec(io,
        inspect.getsource(gateway_base),
        'import socket',
        inspect.getsource(SocketIO),
        "io = SocketIO(clientsock)",
        "io.write('1'.encode('ascii'))",
        "serve(io, id='%s-slave')" % id,
    )
    s = io.read(1)
    assert s == "1".encode('ascii')


def sendexec(io, *sources):
    source = "\n".join(sources)
    io.write((repr(source)+ "\n").encode('ascii'))


def bootstrap(io, spec):
    if spec.popen:
        bootstrap_popen(io, spec)
    elif spec.ssh:
        bootstrap_ssh(io, spec)
    elif spec.socket:
        bootstrap_socket(io, spec)
    else:
        raise ValueError('unknown gateway type, cant bootstrap')
    gw = Gateway(io, spec.id)
    if hasattr(io, 'popen'):
        # fix for jython 2.5.1
        if io.popen.pid is None:
            io.popen.pid = gw.remote_exec(
                "import os; channel.send(os.getpid())").receive()
    return gw


