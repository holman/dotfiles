# -*- coding: utf-8 -*-
# Copyright (c) 2011, Wojciech Bederski (wuub.net) 
# All rights reserved. 
# See LICENSE.txt for details.

import telnetlib
import repl

class TelnetRepl(repl.Repl):
    TYPE = "telnet"

    def __init__(self, encoding, external_id=None, host="localhost", port=23, cmd_postfix="\n", suppress_echo=False):
        """Create new TelnetRepl with the following initial values:
        encoding: one of python accepted encoding used to encode commands and decode responses
        external_id: external, persisten name of this repl used to find it later
        host: telnet host to connect to
        port: telnet port to connect to
        cmd_postfix: some REPLS require you to end a command with a postfix to begin execution,
          think ';' or '.', you can force repl to add it automatically"""
        super(TelnetRepl, self).__init__(encoding, external_id, cmd_postfix, suppress_echo)
        self._telnet = telnetlib.Telnet()
        #convert to int for user's sake, we don't care if it's an float or string 
        # as long as it can be turned into an INT
        self._telnet.open(host, int(port)) 
        self._alive = True
        self._killed = False

    def name(self):
        return "%s:%s" % (self._telnet.host, self._telnet.port)

    def is_alive(self):
        return self._alive

    def read_bytes(self):
        return self._telnet.read_some()

    def write_bytes(self, bytes):
        self._telnet.write(bytes)

    def kill(self):
        self._killed = True
        self._telnet.close()
        self._alive = False
