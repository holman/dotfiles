# FILE:     autoload/conque_term/conque_globals.py {{{
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

"""Common global constants and functions for Conque."""

import sys
import os
import re

















# shared memory size
CONQUE_SOLE_BUFFER_LENGTH = 1000
CONQUE_SOLE_INPUT_SIZE = 1000
CONQUE_SOLE_STATS_SIZE = 1000
CONQUE_SOLE_COMMANDS_SIZE = 255
CONQUE_SOLE_RESCROLL_SIZE = 255
CONQUE_SOLE_RESIZE_SIZE = 255

# interval of screen redraw
# larger number means less frequent
CONQUE_SOLE_SCREEN_REDRAW = 100

# interval of full buffer redraw
# larger number means less frequent
CONQUE_SOLE_BUFFER_REDRAW = 500

# interval of full output bucket replacement
# larger number means less frequent, 1 = every time
CONQUE_SOLE_MEM_REDRAW = 1000

# PYTHON VERSION
CONQUE_PYTHON_VERSION = sys.version_info[0]


def u(str_val, str_encoding='latin-1', errors='strict'):
    """foolhardy attempt to make unicode string syntax compatible with both python 2 and 3"""

    if not str_val:
        str_val = ''

    if CONQUE_PYTHON_VERSION == 3:
        return str_val

    else:
        return unicode(str_val, str_encoding, errors)

# Escape sequence settings  {{{

CONQUE_CTL = {
     1: 'soh', # start of heading
     2: 'stx', # start of text
     7: 'bel', # bell
     8: 'bs',  # backspace
     9: 'tab', # tab
    10: 'nl',  # new line
    13: 'cr',  # carriage return
    14: 'so',  # shift out
    15: 'si'   # shift in
}
#    11 : 'vt',  # vertical tab
#    12 : 'ff',  # form feed

# Escape sequences
CONQUE_ESCAPE = {
    'm': 'font',
    'J': 'clear_screen',
    'K': 'clear_line',
    '@': 'add_spaces',
    'A': 'cursor_up',
    'B': 'cursor_down',
    'C': 'cursor_right',
    'D': 'cursor_left',
    'G': 'cursor_to_column',
    'H': 'cursor',
    'P': 'delete_chars',
    'f': 'cursor',
    'g': 'tab_clear',
    'r': 'set_coords',
    'h': 'set',
    'l': 'reset'
}
#    'L': 'insert_lines',
#    'M': 'delete_lines',
#    'd': 'cusor_vpos',

# Alternate escape sequences, no [
CONQUE_ESCAPE_PLAIN = {
    'D': 'scroll_up',
    'E': 'next_line',
    'H': 'set_tab',
    'M': 'scroll_down'
}
#    'N': 'single_shift_2',
#    'O': 'single_shift_3',
#    '=': 'alternate_keypad',
#    '>': 'numeric_keypad',
#    '7': 'save_cursor',
#    '8': 'restore_cursor',

# Character set escape sequences, with "("
CONQUE_ESCAPE_CHARSET = {
    'A': 'uk',
    'B': 'us',
    '0': 'graphics'
}

# Uber alternate escape sequences, with # or ?
CONQUE_ESCAPE_QUESTION = {
    '1h': 'new_line_mode',
    '3h': '132_cols',
    '4h': 'smooth_scrolling',
    '5h': 'reverse_video',
    '6h': 'relative_origin',
    '7h': 'set_auto_wrap',
    '8h': 'set_auto_repeat',
    '9h': 'set_interlacing_mode',
    '1l': 'set_cursor_key',
    '2l': 'set_vt52',
    '3l': '80_cols',
    '4l': 'set_jump_scrolling',
    '5l': 'normal_video',
    '6l': 'absolute_origin',
    '7l': 'reset_auto_wrap',
    '8l': 'reset_auto_repeat',
    '9l': 'reset_interlacing_mode'
}

CONQUE_ESCAPE_HASH = {
    '8': 'screen_alignment_test'
}
#    '3': 'double_height_top',
#    '4': 'double_height_bottom',
#    '5': 'single_height_single_width',
#    '6': 'single_height_double_width',

CONQUE_GRAPHICS_SET = [
    0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007,
    0x0008, 0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x000E, 0x000F,
    0x0010, 0x0011, 0x0012, 0x0013, 0x0014, 0x0015, 0x0016, 0x0017,
    0x0018, 0x0019, 0x001A, 0x001B, 0x001C, 0x001D, 0x001E, 0x001F,
    0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
    0x0028, 0x0029, 0x002A, 0x2192, 0x2190, 0x2191, 0x2193, 0x002F,
    0x2588, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
    0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
    0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
    0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
    0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
    0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x00A0,
    0x25C6, 0x2592, 0x2409, 0x240C, 0x240D, 0x240A, 0x00B0, 0x00B1,
    0x2591, 0x240B, 0x2518, 0x2510, 0x250C, 0x2514, 0x253C, 0xF800,
    0xF801, 0x2500, 0xF803, 0xF804, 0x251C, 0x2524, 0x2534, 0x252C,
    0x2502, 0x2264, 0x2265, 0x03C0, 0x2260, 0x00A3, 0x00B7, 0x007F,
    0x0080, 0x0081, 0x0082, 0x0083, 0x0084, 0x0085, 0x0086, 0x0087,
    0x0088, 0x0089, 0x008A, 0x008B, 0x008C, 0x008D, 0x008E, 0x008F,
    0x0090, 0x0091, 0x0092, 0x0093, 0x0094, 0x0095, 0x0096, 0x0097,
    0x0098, 0x0099, 0x009A, 0x009B, 0x009C, 0x009D, 0x009E, 0x009F,
    0x00A0, 0x00A1, 0x00A2, 0x00A3, 0x00A4, 0x00A5, 0x00A6, 0x00A7,
    0x00A8, 0x00A9, 0x00AA, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x00AF,
    0x00B0, 0x00B1, 0x00B2, 0x00B3, 0x00B4, 0x00B5, 0x00B6, 0x00B7,
    0x00B8, 0x00B9, 0x00BA, 0x00BB, 0x00BC, 0x00BD, 0x00BE, 0x00BF,
    0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C4, 0x00C5, 0x00C6, 0x00C7,
    0x00C8, 0x00C9, 0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE, 0x00CF,
    0x00D0, 0x00D1, 0x00D2, 0x00D3, 0x00D4, 0x00D5, 0x00D6, 0x00D7,
    0x00D8, 0x00D9, 0x00DA, 0x00DB, 0x00DC, 0x00DD, 0x00DE, 0x00DF,
    0x00E0, 0x00E1, 0x00E2, 0x00E3, 0x00E4, 0x00E5, 0x00E6, 0x00E7,
    0x00E8, 0x00E9, 0x00EA, 0x00EB, 0x00EC, 0x00ED, 0x00EE, 0x00EF,
    0x00F0, 0x00F1, 0x00F2, 0x00F3, 0x00F4, 0x00F5, 0x00F6, 0x00F7,
    0x00F8, 0x00F9, 0x00FA, 0x00FB, 0x00FC, 0x00FD, 0x00FE, 0x00FF
]

# Font codes {{{
CONQUE_FONT = {
    0: {'description': 'Normal (default)', 'attributes': {'cterm': 'NONE', 'ctermfg': 'NONE', 'ctermbg': 'NONE', 'gui': 'NONE', 'guifg': 'NONE', 'guibg': 'NONE'}, 'normal': True},
    1: {'description': 'Bold', 'attributes': {'cterm': 'BOLD', 'gui': 'BOLD'}, 'normal': False},
    4: {'description': 'Underlined', 'attributes': {'cterm': 'UNDERLINE', 'gui': 'UNDERLINE'}, 'normal': False},
    5: {'description': 'Blink (appears as Bold)', 'attributes': {'cterm': 'BOLD', 'gui': 'BOLD'}, 'normal': False},
    7: {'description': 'Inverse', 'attributes': {'cterm': 'REVERSE', 'gui': 'REVERSE'}, 'normal': False},
    8: {'description': 'Invisible (hidden)', 'attributes': {'ctermfg': '0', 'ctermbg': '0', 'guifg': '#000000', 'guibg': '#000000'}, 'normal': False},
    22: {'description': 'Normal (neither bold nor faint)', 'attributes': {'cterm': 'NONE', 'gui': 'NONE'}, 'normal': True},
    24: {'description': 'Not underlined', 'attributes': {'cterm': 'NONE', 'gui': 'NONE'}, 'normal': True},
    25: {'description': 'Steady (not blinking)', 'attributes': {'cterm': 'NONE', 'gui': 'NONE'}, 'normal': True},
    27: {'description': 'Positive (not inverse)', 'attributes': {'cterm': 'NONE', 'gui': 'NONE'}, 'normal': True},
    28: {'description': 'Visible (not hidden)', 'attributes': {'ctermfg': 'NONE', 'ctermbg': 'NONE', 'guifg': 'NONE', 'guibg': 'NONE'}, 'normal': True},
    30: {'description': 'Set foreground color to Black', 'attributes': {'ctermfg': '16', 'guifg': '#000000'}, 'normal': False},
    31: {'description': 'Set foreground color to Red', 'attributes': {'ctermfg': '1', 'guifg': '#ff0000'}, 'normal': False},
    32: {'description': 'Set foreground color to Green', 'attributes': {'ctermfg': '2', 'guifg': '#00ff00'}, 'normal': False},
    33: {'description': 'Set foreground color to Yellow', 'attributes': {'ctermfg': '3', 'guifg': '#ffff00'}, 'normal': False},
    34: {'description': 'Set foreground color to Blue', 'attributes': {'ctermfg': '4', 'guifg': '#0000ff'}, 'normal': False},
    35: {'description': 'Set foreground color to Magenta', 'attributes': {'ctermfg': '5', 'guifg': '#990099'}, 'normal': False},
    36: {'description': 'Set foreground color to Cyan', 'attributes': {'ctermfg': '6', 'guifg': '#009999'}, 'normal': False},
    37: {'description': 'Set foreground color to White', 'attributes': {'ctermfg': '7', 'guifg': '#ffffff'}, 'normal': False},
    39: {'description': 'Set foreground color to default (original)', 'attributes': {'ctermfg': 'NONE', 'guifg': 'NONE'}, 'normal': True},
    40: {'description': 'Set background color to Black', 'attributes': {'ctermbg': '16', 'guibg': '#000000'}, 'normal': False},
    41: {'description': 'Set background color to Red', 'attributes': {'ctermbg': '1', 'guibg': '#ff0000'}, 'normal': False},
    42: {'description': 'Set background color to Green', 'attributes': {'ctermbg': '2', 'guibg': '#00ff00'}, 'normal': False},
    43: {'description': 'Set background color to Yellow', 'attributes': {'ctermbg': '3', 'guibg': '#ffff00'}, 'normal': False},
    44: {'description': 'Set background color to Blue', 'attributes': {'ctermbg': '4', 'guibg': '#0000ff'}, 'normal': False},
    45: {'description': 'Set background color to Magenta', 'attributes': {'ctermbg': '5', 'guibg': '#990099'}, 'normal': False},
    46: {'description': 'Set background color to Cyan', 'attributes': {'ctermbg': '6', 'guibg': '#009999'}, 'normal': False},
    47: {'description': 'Set background color to White', 'attributes': {'ctermbg': '7', 'guibg': '#ffffff'}, 'normal': False},
    49: {'description': 'Set background color to default (original).', 'attributes': {'ctermbg': 'NONE', 'guibg': 'NONE'}, 'normal': True},
    90: {'description': 'Set foreground color to Black', 'attributes': {'ctermfg': '8', 'guifg': '#000000'}, 'normal': False},
    91: {'description': 'Set foreground color to Red', 'attributes': {'ctermfg': '9', 'guifg': '#ff0000'}, 'normal': False},
    92: {'description': 'Set foreground color to Green', 'attributes': {'ctermfg': '10', 'guifg': '#00ff00'}, 'normal': False},
    93: {'description': 'Set foreground color to Yellow', 'attributes': {'ctermfg': '11', 'guifg': '#ffff00'}, 'normal': False},
    94: {'description': 'Set foreground color to Blue', 'attributes': {'ctermfg': '12', 'guifg': '#0000ff'}, 'normal': False},
    95: {'description': 'Set foreground color to Magenta', 'attributes': {'ctermfg': '13', 'guifg': '#990099'}, 'normal': False},
    96: {'description': 'Set foreground color to Cyan', 'attributes': {'ctermfg': '14', 'guifg': '#009999'}, 'normal': False},
    97: {'description': 'Set foreground color to White', 'attributes': {'ctermfg': '15', 'guifg': '#ffffff'}, 'normal': False},
    100: {'description': 'Set background color to Black', 'attributes': {'ctermbg': '8', 'guibg': '#000000'}, 'normal': False},
    101: {'description': 'Set background color to Red', 'attributes': {'ctermbg': '9', 'guibg': '#ff0000'}, 'normal': False},
    102: {'description': 'Set background color to Green', 'attributes': {'ctermbg': '10', 'guibg': '#00ff00'}, 'normal': False},
    103: {'description': 'Set background color to Yellow', 'attributes': {'ctermbg': '11', 'guibg': '#ffff00'}, 'normal': False},
    104: {'description': 'Set background color to Blue', 'attributes': {'ctermbg': '12', 'guibg': '#0000ff'}, 'normal': False},
    105: {'description': 'Set background color to Magenta', 'attributes': {'ctermbg': '13', 'guibg': '#990099'}, 'normal': False},
    106: {'description': 'Set background color to Cyan', 'attributes': {'ctermbg': '14', 'guibg': '#009999'}, 'normal': False},
    107: {'description': 'Set background color to White', 'attributes': {'ctermbg': '15', 'guibg': '#ffffff'}, 'normal': False}
}
# }}}

# regular expression matching (almost) all control sequences
CONQUE_SEQ_REGEX = re.compile(u("(\x1b\[?\??#?[0-9;]*[a-zA-Z0-9@=>]|\x1b\][0-9];.*?\x07|[\x01-\x0f]|\x1b\([AB0])"), re.UNICODE)
CONQUE_SEQ_REGEX_CTL = re.compile(u("^[\x01-\x0f]$"), re.UNICODE)
CONQUE_SEQ_REGEX_CSI = re.compile(u("^\x1b\["), re.UNICODE)
CONQUE_SEQ_REGEX_TITLE = re.compile(u("^\x1b\]"), re.UNICODE)
CONQUE_SEQ_REGEX_HASH = re.compile(u("^\x1b#"), re.UNICODE)
CONQUE_SEQ_REGEX_ESC = re.compile(u("^\x1b.$"), re.UNICODE)
CONQUE_SEQ_REGEX_CHAR = re.compile(u("^\x1b\("), re.UNICODE)

# match table output
CONQUE_TABLE_OUTPUT = re.compile("^\s*\|\s.*\s\|\s*$|^\s*\+[=+-]+\+\s*$")

# }}}

# Windows subprocess config {{{

CONQUE_SEQ_REGEX_VK = re.compile(u("(\x1b\[\d{1,3}VK)"), re.UNICODE)

# }}}

CONQUE_COLOR_SEQUENCE = (
    '000', '009', '090', '099', '900', '909', '990', '999',
    '000', '00f', '0f0', '0ff', 'f00', 'f0f', 'ff0', 'fff'
)

# vim:foldmethod=marker
