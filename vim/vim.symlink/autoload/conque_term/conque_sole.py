# FILE:     autoload/conque_term/conque_sole.py {{{
# AUTHOR:   Nico Raffo <nicoraffo@gmail.com>
# WEBSITE:  http://conque.googlecode.com
# MODIFIED: 2010-11-15
# VERSION:  2.0, for Vim 7.0
# LICENSE:
# Conque - Vim terminal/console emulator
# Copyright (C) 2009-2010 Nico Raffo
#
# MIT License
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE. }}}

import vim


class ConqueSole(Conque):

    window_top = None
    window_bottom = None

    color_cache = {}
    color_mode = None
    color_conceals = {}

    buffer = None

    # counters for periodic rendering
    buffer_redraw_ct = 0
    screen_redraw_ct = 0

    # *********************************************************************************************
    # start program and initialize this instance

    def open(self, command, options={}, python_exe='', communicator_py=''): # {{{

        # init size
        self.columns = vim.current.window.width
        self.lines = vim.current.window.height
        self.window_top = 0
        self.window_bottom = vim.current.window.height - 1

        # init color
        self.enable_colors = options['color']

        # open command
        self.proc = ConqueSoleWrapper()
        self.proc.open(command, {'TERM': options['TERM'], 'CONQUE': '1', 'LINES': self.lines, 'COLUMNS': self.columns}, python_exe, communicator_py)

        self.buffer = vim.current.buffer

        # }}}


    # *********************************************************************************************
    # read and update screen

    def read(self, timeout=1, set_cursor=True, return_output=False, update_buffer=True): # {{{

        try:
            stats = self.proc.get_stats()

            if not stats:
                return

            self.buffer_redraw_ct += 1
            self.screen_redraw_ct += 1

            update_top = 0
            update_bottom = 0
            lines = []

            # full buffer redraw, our favorite!
            if self.buffer_redraw_ct == CONQUE_SOLE_BUFFER_REDRAW:
                self.buffer_redraw_ct = 0
                update_top = 0
                update_bottom = stats['top_offset'] + self.lines
                (lines, attributes) = self.proc.read(update_top, update_bottom)
                if return_output:
                    output = self.get_new_output(lines, update_top, stats)
                if update_buffer:
                    for i in range(update_top, update_bottom + 1):
                        self.plain_text(i, lines[i], attributes[i], stats)

            # full screen redraw
            elif stats['cursor_y'] + 1 != self.l or stats['top_offset'] != self.window_top or self.screen_redraw_ct == CONQUE_SOLE_SCREEN_REDRAW:
                self.screen_redraw_ct = 0
                update_top = self.window_top
                update_bottom = stats['top_offset'] + self.lines + 1
                (lines, attributes) = self.proc.read(update_top, update_bottom - update_top + 1)
                if return_output:
                    output = self.get_new_output(lines, update_top, stats)
                if update_buffer:
                    for i in range(update_top, update_bottom + 1):
                        self.plain_text(i, lines[i - update_top], attributes[i - update_top], stats)


            # single line redraw
            else:
                update_top = stats['cursor_y']
                update_bottom = stats['cursor_y']
                (lines, attributes) = self.proc.read(update_top, 1)
                if return_output:
                    output = self.get_new_output(lines, update_top, stats)
                if update_buffer:
                    if lines[0].rstrip() != self.buffer[update_top].rstrip():
                        self.plain_text(update_top, lines[0], attributes[0], stats)


            # reset current position
            self.window_top = stats['top_offset']
            self.l = stats['cursor_y'] + 1
            self.c = stats['cursor_x'] + 1

            # reposition cursor if this seems plausible
            if set_cursor:
                self.set_cursor(self.l, self.c)

            if return_output:
                return output

        except:

            pass
        # }}}

    #########################################################################
    # Calculate the "new" output from this read. Fake but useful

    def get_new_output(self, lines, update_top, stats): # {{{

        if not (stats['cursor_y'] + 1 > self.l or (stats['cursor_y'] + 1 == self.l and stats['cursor_x'] + 1 > self.c)):
            return ""






        try:
            num_to_return = stats['cursor_y'] - self.l + 2

            lines = lines[self.l - update_top - 1:]


            new_output = []

            # first line
            new_output.append(lines[0][self.c - 1:].rstrip())

            # the rest
            for i in range(1, num_to_return):
                new_output.append(lines[i].rstrip())

        except:

            pass



        return "\n".join(new_output)
        # }}}

    #########################################################################
    # update the buffer

    def plain_text(self, line_nr, text, attributes, stats): # {{{





        self.l = line_nr + 1

        # remove trailing whitespace
        text = text.rstrip()

        # if we're using concealed text for color, then s- is weird
        if self.color_mode == 'conceal':

            text = self.add_conceal_color(text, attributes, stats, line_nr)


        # update vim buffer
        if len(self.buffer) <= line_nr:
            self.buffer.append(text)
        else:
            self.buffer[line_nr] = text

        if not self.color_mode == 'conceal':
            self.do_color(attributes=attributes, stats=stats)

        # }}}

    #########################################################################
    # add conceal color

    def add_conceal_color(self, text, attributes, stats, line_nr): # {{{

        # stop here if coloration is disabled
        if not self.enable_colors:
            return text

        # if no colors for this line, clear everything out
        if len(attributes) == 0 or attributes == u(chr(stats['default_attribute'])) * len(attributes):
            return text

        new_text = ''

        # if text attribute is different, call add_color()
        attr = None
        start = 0
        self.color_conceals[line_nr] = []
        ends = []
        for i in range(0, len(attributes)):
            c = ord(attributes[i])

            if c != attr:
                if attr and attr != stats['default_attribute']:

                    color = self.translate_color(attr)

                    new_text += chr(27) + 'sf' + color['fg_code'] + ';'
                    ends.append(chr(27) + 'ef' + color['fg_code'] + ';')
                    self.color_conceals[line_nr].append(start)

                    if c > 15:
                        new_text += chr(27) + 'sf' + color['bg_code'] + ';'
                        ends.append(chr(27) + 'ef' + color['bg_code'] + ';')
                        self.color_conceals[line_nr].append(start)

                new_text += text[start:i]

                # close color regions
                ends.reverse()
                for j in range(0, len(ends)):
                    new_text += ends[j]
                    self.color_conceals[line_nr].append(i)
                ends = []

                start = i
                attr = c


        if attr and attr != stats['default_attribute']:

            color = self.translate_color(attr)

            new_text += chr(27) + 'sf' + color['fg_code'] + ';'
            ends.append(chr(27) + 'ef' + color['fg_code'] + ';')

            if c > 15:
                new_text += chr(27) + 'sf' + color['bg_code'] + ';'
                ends.append(chr(27) + 'ef' + color['bg_code'] + ';')

        new_text += text[start:]

        # close color regions
        ends.reverse()
        for i in range(0, len(ends)):
            new_text += ends[i]

        return new_text

        # }}}

    #########################################################################

    def do_color(self, start=0, end=0, attributes='', stats=None): # {{{

        # stop here if coloration is disabled
        if not self.enable_colors:
            return

        # if no colors for this line, clear everything out
        if len(attributes) == 0 or attributes == u(chr(stats['default_attribute'])) * len(attributes):
            self.color_changes = {}
            self.apply_color(1, len(attributes), self.l)
            return

        # if text attribute is different, call add_color()
        attr = None
        start = 0
        for i in range(0, len(attributes)):
            c = ord(attributes[i])

            if c != attr:
                if attr and attr != stats['default_attribute']:
                    self.color_changes = self.translate_color(attr)
                    self.apply_color(start + 1, i + 1, self.l)
                start = i
                attr = c

        if attr and attr != stats['default_attribute']:
            self.color_changes = self.translate_color(attr)
            self.apply_color(start + 1, len(attributes), self.l)


        # }}}

    #########################################################################

    def translate_color(self, attr): # {{{

        # check for cached color
        if attr in self.color_cache:
            return self.color_cache[attr]






        # convert attribute integer to bit string
        bit_str = bin(attr)
        bit_str = bit_str.replace('0b', '')

        # slice foreground and background portions of bit string
        fg = bit_str[-4:].rjust(4, '0')
        bg = bit_str[-8:-4].rjust(4, '0')

        # ok, first create foreground #rbg
        red = int(fg[1]) * 204 + int(fg[0]) * int(fg[1]) * 51
        green = int(fg[2]) * 204 + int(fg[0]) * int(fg[2]) * 51
        blue = int(fg[3]) * 204 + int(fg[0]) * int(fg[3]) * 51
        fg_str = "#%02x%02x%02x" % (red, green, blue)
        fg_code = "%02x%02x%02x" % (red, green, blue)
        fg_code = fg_code[0] + fg_code[2] + fg_code[4]

        # ok, first create foreground #rbg
        red = int(bg[1]) * 204 + int(bg[0]) * int(bg[1]) * 51
        green = int(bg[2]) * 204 + int(bg[0]) * int(bg[2]) * 51
        blue = int(bg[3]) * 204 + int(bg[0]) * int(bg[3]) * 51
        bg_str = "#%02x%02x%02x" % (red, green, blue)
        bg_code = "%02x%02x%02x" % (red, green, blue)
        bg_code = bg_code[0] + bg_code[2] + bg_code[4]

        # build value for color_changes

        color = {'guifg': fg_str, 'guibg': bg_str}

        if self.color_mode == 'conceal':
            color['fg_code'] = fg_code
            color['bg_code'] = bg_code

        self.color_cache[attr] = color

        return color

        # }}}

    #########################################################################
    # write virtual key code to shared memory using proprietary escape seq

    def write_vk(self, vk_code): # {{{

        self.proc.write_vk(vk_code)

        # }}}

    # *********************************************************************************************
    # resize if needed

    def update_window_size(self): # {{{

        if vim.current.window.width != self.columns or vim.current.window.height != self.lines:

            # reset all window size attributes to default
            self.columns = vim.current.window.width
            self.lines = vim.current.window.height
            self.working_columns = vim.current.window.width
            self.working_lines = vim.current.window.height
            self.bottom = vim.current.window.height

            self.proc.window_resize(vim.current.window.height, vim.current.window.width)

        # }}}

    # *********************************************************************************************
    # resize if needed

    def set_cursor(self, line, column): # {{{

        # shift cursor position to handle concealed text
        if self.enable_colors and self.color_mode == 'conceal':
            if line - 1 in self.color_conceals:
                for c in self.color_conceals[line - 1]:
                    if c < column:
                        column += 7
                    else:
                        break

        # figure out line
        real_line = line
        if real_line > len(self.buffer):
            for l in range(len(self.buffer) - 1, real_line):
                self.buffer.append('')

        # figure out column
        real_column = column
        if len(self.buffer[real_line - 1]) < real_column:
            self.buffer[real_line - 1] = self.buffer[real_line - 1] + ' ' * (real_column - len(self.buffer[real_line - 1]))

        # python version is occasionally grumpy
        try:
            vim.current.window.cursor = (real_line, real_column - 1)
        except:
            vim.command('call cursor(' + str(real_line) + ', ' + str(real_column) + ')')
    # }}}


    # *********************************************************************************************
    # go into idle mode

    def idle(self): # {{{

        self.proc.idle()

        # }}}

    # *********************************************************************************************
    # resume from idle mode

    def resume(self): # {{{

        self.proc.resume()

        # }}}

    # *********************************************************************************************
    # end subprocess

    def close(self):
        self.proc.close()

    # *********************************************************************************************
    # end subprocess forcefully

    def abort(self):
        self.proc.close()


# vim:foldmethod=marker
