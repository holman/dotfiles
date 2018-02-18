#!/usr/bin/env ruby
# Usage: gitio URL [CODE]
#
# Turns a github.com URL
#  into a git.io URL
#
# Created by @defunkt:
#  https://gist.github.com/1209316 
#
# Copies the git.io URL to your clipboard.

url  = ARGV[0]
code = ARGV[1]

if url !~ /^(https?:\/\/)?(gist\.)?github.com/
  abort "* github.com URLs only"
end

if url !~ /^http/
  url = "https://#{url}"
end

if code
  code = "-F code=#{code}"
end

output = `curl -i https://git.io -F 'url=#{url}' #{code} 2> /dev/null`
if output =~ /Location: (.+)\n?/
  puts $1
  `echo #$1 | pbcopy`
else
  puts output
end
