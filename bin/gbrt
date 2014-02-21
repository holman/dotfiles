#!/usr/bin/env ruby

def format_commit_info timestamp, time_desc, commit_id, message, ref_name
  [
    "#{timestamp.strftime("%y %b %d")}, #{timestamp.strftime("%l:%M%p").downcase}",
    "(#{time_desc})",
    commit_id,
    message,
    ref_name
  ]
end

def render_commit_info timestamp, time_desc, commit_id, message, ref_name, merged
  [
    timestamp,
    time_desc,
    "\e[32m#{ref_name}\e[0m",
    (merged ? "  #{commit_id}" : "+ \e[33m#{commit_id}\e[0m"),
    "\e[#{message[/^Temp/] ? 31 : 90}m#{message.strip}\e[0m"
  ].join(' ')
end

commit_info = `git branch #{ARGV.join(' ')} | cut -c 3-`.strip.split("\n").reject {|ref_name|
  ref_name[' -> ']
}.map {|ref_name|
  `git log --no-walk --pretty=format:"%ct\n%cr\n%h\n%s" '#{ref_name}' --`.strip.split("\n").push(ref_name)
}.map {|commit_info|
  [Time.at(commit_info.shift.to_i)].concat(commit_info)
}.sort_by {|commit_info|
  commit_info.first # unix timestamp
}.reverse.map {|commit_info|
  format_commit_info(*commit_info)
}.transpose.map {|column|
  max_col_length = column.sort_by {|i| i.length }.last.length
  column.map {|i| i.ljust(max_col_length) }
}.transpose.map {|commit_info|
  commit_info.push(
    `git merge-base HEAD #{commit_info[2]}`.chomp[0...7] == commit_info[2]
  )
}.each {|commit_info|
  puts render_commit_info(*commit_info)
}
