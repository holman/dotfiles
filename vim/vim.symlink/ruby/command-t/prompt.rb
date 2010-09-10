# Copyright 2010 Wincent Colaiuta. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

module CommandT
  # Abuse the status line as a prompt.
  class Prompt
    attr_accessor :abbrev

    def initialize
      @abbrev     = ''  # abbreviation entered so far
      @col        = 0   # cursor position
      @has_focus  = false
    end

    # Erase whatever is displayed in the prompt line,
    # effectively disposing of the prompt
    def dispose
      ::VIM::command 'echo'
      ::VIM::command 'redraw'
    end

    # Clear any entered text.
    def clear!
      @abbrev = ''
      @col    = 0
      redraw
    end

    # Insert a character at (before) the current cursor position.
    def add! char
      left, cursor, right = abbrev_segments
      @abbrev = left + char + cursor + right
      @col += 1
      redraw
    end

    # Delete a character to the left of the current cursor position.
    def backspace!
      if @col > 0
        left, cursor, right = abbrev_segments
        @abbrev = left.chop! + cursor + right
        @col -= 1
        redraw
      end
    end

    # Delete a character at the current cursor position.
    def delete!
      if @col < @abbrev.length
        left, cursor, right = abbrev_segments
        @abbrev = left + right
        redraw
      end
    end

    def cursor_left
      if @col > 0
        @col -= 1
        redraw
      end
    end

    def cursor_right
      if @col < @abbrev.length
        @col += 1
        redraw
      end
    end

    def cursor_end
      if @col < @abbrev.length
        @col = @abbrev.length
        redraw
      end
    end

    def cursor_start
      if @col != 0
        @col = 0
        redraw
      end
    end

    def redraw
      if @has_focus
        prompt_highlight = 'Comment'
        normal_highlight = 'None'
        cursor_highlight = 'Underlined'
      else
        prompt_highlight = 'NonText'
        normal_highlight = 'NonText'
        cursor_highlight = 'NonText'
      end
      left, cursor, right = abbrev_segments
      components = [prompt_highlight, '>>', 'None', ' ']
      components += [normal_highlight, left] unless left.empty?
      components += [cursor_highlight, cursor] unless cursor.empty?
      components += [normal_highlight, right] unless right.empty?
      components += [cursor_highlight, ' '] if cursor.empty?
      set_status *components
    end

    def focus
      unless @has_focus
        @has_focus = true
        redraw
      end
    end

    def unfocus
      if @has_focus
        @has_focus = false
        redraw
      end
    end

  private

    # Returns the @abbrev string divided up into three sections, any of
    # which may actually be zero width, depending on the location of the
    # cursor:
    #   - left segment (to left of cursor)
    #   - cursor segment (character at cursor)
    #   - right segment (to right of cursor)
    def abbrev_segments
      left    = @abbrev[0, @col]
      cursor  = @abbrev[@col, 1]
      right   = @abbrev[(@col + 1)..-1] || ''
      [left, cursor, right]
    end

    def set_status *args
      # see ':help :echo' for why forcing a redraw here helps
      # prevent the status line from getting inadvertantly cleared
      # after our echo commands
      ::VIM::command 'redraw'
      while (highlight = args.shift) and  (text = args.shift) do
        text = VIM::escape_for_single_quotes text
        ::VIM::command "echohl #{highlight}"
        ::VIM::command "echon '#{text}'"
      end
      ::VIM::command 'echohl None'
    end
  end # class Prompt
end # module CommandT
