# -*- coding: utf-8 -*-
# Copyright (c) 2011, Wojciech Bederski (wuub.net)
# All rights reserved.
# See LICENSE.txt for details.

import subprocess
import os
import re
import repl
import signal
import killableprocess
from sublime import load_settings
from autocomplete_server import AutocompleteServer

from subprocess_repl import Unsupported, win_find_executable
import subprocess_repl

# PowerShell in interactive mode shows no prompt, so we must hold it by hand.
# Every command prepended with other command, which will output only one character ('.')
# When user command leads to no output (for example, 'cd ..'), we get only this character,
# and then we send command to show prompt explicitly.
# No output at all means, that PowerShell needs more input (multiline mode).
# In this case we proceeds sending user input without modifications.

class PowershellRepl(subprocess_repl.SubprocessRepl):
    TYPE = "powershell"
    PREPENDER = "."

    def __init__(self, encoding = None, external_id=None, cmd_postfix="\n", suppress_echo=False, cmd=None,
                 env=None, cwd=None, extend_env=None, soft_quit="", autocomplete_server=False):
        if not encoding:
            # Detect encoding
            chcp = os.popen('chcp')
            chcp_encoding = re.match(r'[^\d]+(\d+)$', chcp.read())
            if not chcp_encoding:
                raise LookupError("Can't detect encoding from chcp")
            encoding = "cp" + chcp_encoding.groups()[0]
            print(encoding)

        super(PowershellRepl, self).__init__(encoding, external_id, cmd_postfix, suppress_echo, cmd, env, cwd, extend_env, soft_quit, autocomplete_server)

        # Using this to detect whether PowerShell returns some output or it needs more input
        # PowerShell in interactive mode doesn't show prompt, so we must hold it by hand
        # It's a hack and, for example, we can send 'Write-Host "" -NoNewLine' with no output, but in outhr cases it may work well
        self.got_output = True
        self.multiline = False

        self.prompt()

    def read_bytes(self):
        # this is windows specific problem, that you cannot tell if there
        # are more bytes ready, so we read only 1 at a times
        result = self.popen.stdout.read(1)

        # Consumes output (it must be equal to PREPENDER)
        if result and not self.got_output:
            self.got_output = True
            self.multiline = False
            self.prompt()
            # Don't return PREPENDER, read another input
            return self.read_bytes()

        return result

    def write_bytes(self, bytes):
        # Drop flag on new input
        self.got_output = False
        if not self.multiline:
            # Turn multiline mode on, it will be turned off, when PowerShell returns some output
            self.multiline = True
            self.prepend()
        self.do_write(bytes)

    def do_write(self, bytes):
        super(PowershellRepl, self).write_bytes(bytes)

    def prompt(self):
        """ Sends command to get prompt """
        self.do_write('Write-Host ("PS " + (gl).Path + "> ") -NoNewline\n')

    def prepend(self):
        """ Command to prepend every output with special mark to detect multiline mode """
        self.do_write('Write-Host "' + PowershellRepl.PREPENDER + '" -NoNewLine; ')
