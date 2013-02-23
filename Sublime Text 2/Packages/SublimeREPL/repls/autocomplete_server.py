# -*- coding: utf-8 -*-

import json
import socket
import threading
import sublime

def read_netstring(s):
    size = 0
    while True:
        ch = s.recv(1)
        if ch == ':':
            break
        size = size * 10 + int(ch)
    msg = ""
    while size != 0:
        msg += s.recv(size)
        size -= len(msg)
    ch = s.recv(1)
    assert ch == ','
    return msg

def send_netstring(s, msg):
    payload = "".join([str(len(msg)), ':', msg, ','])
    s.sendall(payload)


class AutocompleteServer(object):
    def __init__(self, repl, server_ip="127.0.0.1"):
        self._repl = repl
        self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._cli_sock = None
        self._server_ip = server_ip

    def start(self):
        self._sock.bind((self._server_ip, 0))
        threading.Thread(target=self._wait).start()

    def _wait(self):
        self._sock.listen(1)
        s, address = self._sock.accept()
        self._cli_sock = s

    def port(self):
        return self._sock.getsockname()[1]

    def connected(self):
        return bool(self._cli_sock)

    def complete(self, whole_line, pos_in_line, prefix, whole_prefix, locations):
        req = json.dumps({"text": "", "line": whole_line, "cursor_pos": pos_in_line})
        send_netstring(self._cli_sock, req)
        self._cli_sock.settimeout(4)
        msg = read_netstring(self._cli_sock)
        self._cli_sock.settimeout(None)
        res = json.loads(msg)
        if not res:
            return []
        return [(x, x) for x in res[1]]
