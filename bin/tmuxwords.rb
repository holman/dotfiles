#!/usr/bin/env ruby

require 'optparse'
require 'set'

opts = { :panes => :visible }
op = OptionParser.new do |o|
  o.banner = "usage: #{$0} [OPTIONS]"
  o.separator ''
  o.on('-A', '--all', 'All panes')              { |v| opts[:panes] = :all }
  o.on('-a', '--all-but-current',
       'All panes but the active one')          { |v| opts[:panes] = :others }
  o.on('-s NUM', '--scroll NUM', 'Scroll back') { |v| opts[:scroll] = v }
  o.on('-p STR', '--prefix STR', 'Prefix')      { |v| opts[:prefix] = v }
  o.on('-m NUM', '--min NUM', 'Minimum length') { |v| opts[:min] = v.to_i }
  o.separator ''
  o.on('-h', '--help', 'Show this message')     { puts o; exit }
  o.separator ''
end

begin
  op.parse!
rescue OptionParser::InvalidOption => x
  $stderr.puts x
  $stderr.puts op
  exit 1
end

def list_panes cond
  fmt = '#{window_active}#{pane_active} #{pane_id}'
  `tmux list-panes -a -F '#{fmt}'`.split($/).map { |e| e.split }.select { |pair|
    status = pair.first
    case cond
    when :all     then true
    when :visible then status =~ /^1/
    when :others  then status !~ /^11/
    end
  }.map { |pair| pair.last }
end

system "tmux capture-pane -p &> /dev/null"
if $?.exitstatus == 0
  def capture_pane pane_id, scroll
    `tmux capture-pane #{"-S -#{scroll}" if scroll} -t #{pane_id} -p`
  end
else
  def capture_pane pane_id, scroll
    `tmux capture-pane #{"-S -#{scroll}" if scroll} -t #{pane_id} &&
     tmux show-buffer && tmux delete-buffer`
  end
end

def tokenize str, prefix, min
  set = Set.new
  set.merge(chunks = str.split(/\s+/))
  set.merge(strip_chunks = chunks.map { |t| t.gsub(/^\W+|\W+$/, '') })
  set.merge(lines = str.split($/).map { |e| e.strip })
  set.merge(words = str.gsub(/\W/, ' ').split(/\s+/))

  prefix &&= /^#{Regexp.escape prefix}/
  case
  when prefix && min
    set.select { |t| t =~ prefix && t.length >= min }
  when prefix
    set.select { |t| t =~ prefix }
  when min
    set.select { |t| t.length >= min }
  else
    set
  end
rescue
  []
end

list_panes(opts[:panes]).inject(Set.new) { |set, pane_id|
  tokens = tokenize(capture_pane(pane_id, opts[:scroll]),
                    opts[:prefix], opts[:min])
  set.merge tokens
}.each do |token|
  puts token
end
