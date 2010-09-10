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

require 'ostruct'
require 'command-t/settings'

module CommandT
  class MatchWindow
    @@selection_marker  = '> '
    @@marker_length     = @@selection_marker.length
    @@unselected_marker = ' ' * @@marker_length

    def initialize options = {}
      @prompt = options[:prompt]

      # save existing window dimensions so we can restore them later
      @windows = []
      (0..(::VIM::Window.count - 1)).each do |i|
        window = OpenStruct.new :index => i, :height => ::VIM::Window[i].height
        @windows << window
      end

      # global settings (must manually save and restore)
      @settings = Settings.new
      ::VIM::set_option 'timeoutlen=0'    # respond immediately to mappings
      ::VIM::set_option 'nohlsearch'      # don't highlight search strings
      ::VIM::set_option 'noinsertmode'    # don't make Insert mode the default
      ::VIM::set_option 'noshowcmd'       # don't show command info on last line
      ::VIM::set_option 'report=9999'     # don't show "X lines changed" reports
      ::VIM::set_option 'sidescroll=0'    # don't sidescroll in jumps
      ::VIM::set_option 'sidescrolloff=0' # don't sidescroll automatically
      ::VIM::set_option 'noequalalways'   # don't auto-balance window sizes

      # create match window and set it up
      split_location = options[:match_window_at_top] ? 'topleft' : 'botright'
      split_command = "silent! #{split_location} 1split GoToFile"
      [
        split_command,
        'setlocal bufhidden=delete',  # delete buf when no longer displayed
        'setlocal buftype=nofile',    # buffer is not related to any file
        'setlocal nomodifiable',      # prevent manual edits
        'setlocal noswapfile',        # don't create a swapfile
        'setlocal nowrap',            # don't soft-wrap
        'setlocal nonumber',          # don't show line numbers
        'setlocal nolist',            # don't use List mode (visible tabs etc)
        'setlocal foldcolumn=0',      # don't show a fold column at side
        'setlocal foldlevel=99',      # don't fold anything
        'setlocal nocursorline',      # don't highlight line cursor is on
        'setlocal nospell',           # spell-checking off
        'setlocal nobuflisted',       # don't show up in the buffer list
        'setlocal textwidth=0'        # don't hard-wrap (break long lines)
      ].each { |command| ::VIM::command command }

      # sanity check: make sure the buffer really was created
      raise "Can't find buffer" unless $curbuf.name.match /GoToFile/

      # syntax coloring
      if VIM::has_syntax?
        ::VIM::command "syntax match CommandTSelection \"^#{@@selection_marker}.\\+$\""
        ::VIM::command 'syntax match CommandTNoEntries "^-- NO MATCHES --$"'
        ::VIM::command 'syntax match CommandTNoEntries "^-- NO SUCH FILE OR DIRECTORY --$"'
        ::VIM::command 'highlight link CommandTSelection Visual'
        ::VIM::command 'highlight link CommandTNoEntries Error'
        ::VIM::evaluate 'clearmatches()'

        # hide cursor
        @cursor_highlight = get_cursor_highlight
        hide_cursor
      end


      @has_focus  = false
      @selection  = nil
      @abbrev     = ''
      @window     = $curwin
      @buffer     = $curbuf
    end

    def close
      ::VIM::command "bwipeout! #{@buffer.number}"
      restore_window_dimensions
      @settings.restore
      @prompt.dispose
      show_cursor
    end

    def add! char
      @abbrev += char
    end

    def backspace!
      @abbrev.chop!
    end

    def select_next
      if @selection < @matches.length - 1
        @selection += 1
        print_match(@selection - 1) # redraw old selection (removes marker)
        print_match(@selection)     # redraw new selection (adds marker)
      else
        # (possibly) loop or scroll
      end
    end

    def select_prev
      if @selection > 0
        @selection -= 1
        print_match(@selection + 1) # redraw old selection (removes marker)
        print_match(@selection)     # redraw new selection (adds marker)
      else
        # (possibly) loop or scroll
      end
    end

    def matches= matches
      if matches != @matches
        @matches =  matches
        @selection = 0
        print_matches
      end
    end

    def focus
      unless @has_focus
        @has_focus = true
        if VIM::has_syntax?
          ::VIM::command 'highlight link CommandTSelection Search'
        end
      end
    end

    def unfocus
      if @has_focus
        @has_focus = false
        if VIM::has_syntax?
          ::VIM::command 'highlight link CommandTSelection Visual'
        end
      end
    end

    def find char
      # is this a new search or the continuation of a previous one?
      now = Time.now
      if @last_key_time.nil? or @last_key_time < (now - 0.5)
        @find_string = char
      else
        @find_string += char
      end
      @last_key_time = now

      # see if there's anything up ahead that matches
      @matches.each_with_index do |match, idx|
        if match[0, @find_string.length].casecmp(@find_string) == 0
          old_selection = @selection
          @selection = idx
          print_match(old_selection)  # redraw old selection (removes marker)
          print_match(@selection)     # redraw new selection (adds marker)
          break
        end
      end
    end

    # Returns the currently selected item as a String.
    def selection
      @matches[@selection]
    end

    def print_no_such_file_or_directory
      print_error 'NO SUCH FILE OR DIRECTORY'
    end

  private

    def print_error msg
      return unless VIM::Window.select(@window)
      unlock
      clear
      @window.height = 1
      @buffer[1] = "-- #{msg} --"
      lock
    end

    def restore_window_dimensions
      # sort from tallest to shortest
      @windows.sort! { |a, b| b.height <=> a.height }

      # starting with the tallest ensures that there are no constraints
      # preventing windows on the side of vertical splits from regaining
      # their original full size
      @windows.each do |w|
        # beware: window may be nil
        window = ::VIM::Window[w.index]
        window.height = w.height if window
      end
    end

    def match_text_for_idx idx
      match = truncated_match @matches[idx]
      if idx == @selection
        prefix = @@selection_marker
        suffix = padding_for_selected_match match
      else
        prefix = @@unselected_marker
        suffix = ''
      end
      prefix + match + suffix
    end

    # Print just the specified match.
    def print_match idx
      return unless VIM::Window.select(@window)
      unlock
      @buffer[idx + 1] = match_text_for_idx idx
      lock
    end

    # Print all matches.
    def print_matches
      match_count = @matches.length
      if match_count == 0
        print_error 'NO MATCHES'
      else
        return unless VIM::Window.select(@window)
        unlock
        clear
        actual_lines = 1
        @window_width = @window.width # update cached value
        max_lines = VIM::Screen.lines - 5
        max_lines = 1 if max_lines < 0
        actual_lines = match_count > max_lines ? max_lines : match_count
        @window.height = actual_lines
        (1..actual_lines).each do |line|
          idx = line - 1
          if @buffer.count >= line
            @buffer[line] = match_text_for_idx idx
          else
            @buffer.append line - 1, match_text_for_idx(idx)
          end
        end
        lock
      end
    end

    # Prepare padding for match text (trailing spaces) so that selection
    # highlighting extends all the way to the right edge of the window.
    def padding_for_selected_match str
      len = str.length
      if len >= @window_width - @@marker_length
        ''
      else
        ' ' * (@window_width - @@marker_length - len)
      end
    end

    # Convert "really/long/path" into "really...path" based on available
    # window width.
    def truncated_match str
      len = str.length
      available_width = @window_width - @@marker_length
      return str if len <= available_width
      left = (available_width / 2) - 1
      right = (available_width / 2) - 2 + (available_width % 2)
      str[0, left] + '...' + str[-right, right]
    end

    def clear
      # range = % (whole buffer)
      # action = d (delete)
      # register = _ (black hole register, don't record deleted text)
      ::VIM::command 'silent %d _'
    end

    def get_cursor_highlight
      # as :highlight returns nothing and only prints,
      # must redirect its output to a variable
      ::VIM::command 'silent redir => g:command_t_cursor_highlight'

      # force 0 verbosity to ensure origin information isn't printed as well
      ::VIM::command 'silent! 0verbose highlight Cursor'
      ::VIM::command 'silent redir END'

      # there are 3 possible formats to check for, each needing to be
      # transformed in a certain way in order to reapply the highlight:
      #   Cursor xxx guifg=bg guibg=fg      -> :hi! Cursor guifg=bg guibg=fg
      #   Cursor xxx links to SomethingElse -> :hi! link Cursor SomethingElse
      #   Cursor xxx cleared                -> :hi! clear Cursor
      highlight = ::VIM::evaluate 'g:command_t_cursor_highlight'
      if highlight =~ /^Cursor\s+xxx\s+links to (\w+)/
        "link Cursor #{$~[1]}"
      elsif highlight =~ /^Cursor\s+xxx\s+cleared/
        'clear Cursor'
      elsif highlight =~ /Cursor\s+xxx\s+(.+)/
        "Cursor #{$~[1]}"
      else # likely cause E411 Cursor highlight group not found
        nil
      end
    end

    def hide_cursor
      if @cursor_highlight
        ::VIM::command 'highlight Cursor NONE'
      end
    end

    def show_cursor
      if @cursor_highlight
        ::VIM::command "highlight #{@cursor_highlight}"
      end
    end

    def lock
      ::VIM::command 'setlocal nomodifiable'
    end

    def unlock
      ::VIM::command 'setlocal modifiable'
    end
  end
end
