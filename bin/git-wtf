#!/usr/bin/env ruby

HELP = <<EOS
git-wtf displays the state of your repository in a readable, easy-to-scan
format. It's useful for getting a summary of how a branch relates to a remote
server, and for wrangling many topic branches.

git-wtf can show you:
- How a branch relates to the remote repo, if it's a tracking branch.
- How a branch relates to integration branches, if it's a feature branch.
- How a branch relates to the feature branches, if it's an integration
  branch.

git-wtf is best used before a git push, or between a git fetch and a git
merge. Be sure to set color.ui to auto or yes for maximum viewing pleasure.
EOS

KEY = <<EOS
KEY:
() branch only exists locally
{} branch only exists on a remote repo
[] branch exists locally and remotely

x merge occurs both locally and remotely
~ merge occurs only locally
  (space) branch isn't merged in

(It's possible for merges to occur remotely and not locally, of course, but
that's a less common case and git-wtf currently doesn't display anything
special for it.)
EOS

USAGE = <<EOS
Usage: git wtf [branch+] [options]

If [branch] is not specified, git-wtf will use the current branch. The possible
[options] are:

  -l, --long          include author info and date for each commit
  -a, --all           show all branches across all remote repos, not just
                      those from origin
  -A, --all-commits   show all commits, not just the first 5
  -s, --short         don't show commits
  -k, --key           show key
  -r, --relations     show relation to features / integration branches
      --dump-config   print out current configuration and exit

git-wtf uses some heuristics to determine which branches are integration
branches, and which are feature branches. (Specifically, it assumes the
integration branches are named "master", "next" and "edge".) If it guesses
incorrectly, you will have to create a .git-wtfrc file.

To start building a configuration file, run "git-wtf --dump-config >
.git-wtfrc" and edit it. The config file is a YAML file that specifies the
integration branches, any branches to ignore, and the max number of commits to
display when --all-commits isn't used.  git-wtf will look for a .git-wtfrc file
starting in the current directory, and recursively up to the root.

IMPORTANT NOTE: all local branches referenced in .git-wtfrc must be prefixed
with heads/, e.g. "heads/master". Remote branches must be of the form
remotes/<remote>/<branch>.
EOS

COPYRIGHT = <<EOS
git-wtf Copyright 2008--2009 William Morgan <wmorgan at the masanjin dot nets>.
This program is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
more details.

You can find the GNU General Public License at: http://www.gnu.org/licenses/
EOS

require 'yaml'
CONFIG_FN = ".git-wtfrc"

class Numeric; def pluralize s; "#{to_s} #{s}" + (self != 1 ? "s" : "") end end

if ARGV.delete("--help") || ARGV.delete("-h")
  puts USAGE
  exit
end

## poor man's trollop
$long = ARGV.delete("--long") || ARGV.delete("-l")
$short = ARGV.delete("--short") || ARGV.delete("-s")
$all = ARGV.delete("--all") || ARGV.delete("-a")
$all_commits = ARGV.delete("--all-commits") || ARGV.delete("-A")
$dump_config = ARGV.delete("--dump-config")
$key = ARGV.delete("--key") || ARGV.delete("-k")
$show_relations = ARGV.delete("--relations") || ARGV.delete("-r")
ARGV.each { |a| abort "Error: unknown argument #{a}." if a =~ /^--/ }

## search up the path for a file
def find_file fn
  while true
    return fn if File.exist? fn
    fn2 = File.join("..", fn)
    return nil if File.expand_path(fn2) == File.expand_path(fn)
    fn = fn2
  end
end

want_color = `git config color.wtf`
want_color = `git config color.ui` if want_color.empty?
$color = case want_color.chomp
  when "true"; true
  when "auto"; $stdout.tty?
end

def red s; $color ? "\033[31m#{s}\033[0m" : s end
def green s; $color ? "\033[32m#{s}\033[0m" : s end
def yellow s; $color ? "\033[33m#{s}\033[0m" : s end
def cyan s; $color ? "\033[36m#{s}\033[0m" : s end
def grey s; $color ? "\033[1;30m#{s}\033[0m" : s end
def purple s; $color ? "\033[35m#{s}\033[0m" : s end

## the set of commits in 'to' that aren't in 'from'.
## if empty, 'to' has been merged into 'from'.
def commits_between from, to
  if $long
    `git log --pretty=format:"- %s [#{yellow "%h"}] (#{purple "%ae"}; %ar)" #{from}..#{to}`
  else
    `git log --pretty=format:"- %s [#{yellow "%h"}]" #{from}..#{to}`
  end.split(/[\r\n]+/)
end

def show_commits commits, prefix="    "
  if commits.empty?
    puts "#{prefix} none"
  else
    max = $all_commits ? commits.size : $config["max_commits"]
    max -= 1 if max == commits.size - 1 # never show "and 1 more"
    commits[0 ... max].each { |c| puts "#{prefix}#{c}" }
    puts grey("#{prefix}... and #{commits.size - max} more (use -A to see all).") if commits.size > max
  end
end

def ahead_behind_string ahead, behind
  [ahead.empty? ? nil : "#{ahead.size.pluralize 'commit'} ahead",
   behind.empty? ? nil : "#{behind.size.pluralize 'commit'} behind"].
   compact.join("; ")
end

def widget merged_in, remote_only=false, local_only=false, local_only_merge=false
  left, right = case
    when remote_only; %w({ })
    when local_only; %w{( )}
    else %w([ ])
  end
  middle = case
    when merged_in && local_only_merge; green("~")
    when merged_in; green("x")
    else " "
  end
  print left, middle, right
end

def show b
  have_both = b[:local_branch] && b[:remote_branch]

  pushc, pullc, oosync = if have_both
    [x = commits_between(b[:remote_branch], b[:local_branch]),
     y = commits_between(b[:local_branch], b[:remote_branch]),
     !x.empty? && !y.empty?]
  end

  if b[:local_branch]
    puts "Local branch: " + green(b[:local_branch].sub(/^heads\//, ""))

    if have_both
      if pushc.empty?
        puts "#{widget true} in sync with remote"
      else
        action = oosync ? "push after rebase / merge" : "push"
        puts "#{widget false} NOT in sync with remote (you should #{action})"
        show_commits pushc unless $short
      end
    end
  end

  if b[:remote_branch]
    puts "Remote branch: #{cyan b[:remote_branch]} (#{b[:remote_url]})"

    if have_both
      if pullc.empty?
        puts "#{widget true} in sync with local"
      else
        action = pushc.empty? ? "merge" : "rebase / merge"
        puts "#{widget false} NOT in sync with local (you should #{action})"
        show_commits pullc unless $short
      end
    end
  end

  puts "\n#{red "WARNING"}: local and remote branches have diverged. A merge will occur unless you rebase." if oosync
end

def show_relations b, all_branches
  ibs, fbs = all_branches.partition { |name, br| $config["integration-branches"].include?(br[:local_branch]) || $config["integration-branches"].include?(br[:remote_branch]) }
  if $config["integration-branches"].include? b[:local_branch]
    puts "\nFeature branches:" unless fbs.empty?
    fbs.each do |name, br|
      next if $config["ignore"].member?(br[:local_branch]) || $config["ignore"].member?(br[:remote_branch])
      next if br[:ignore]
      local_only = br[:remote_branch].nil?
      remote_only = br[:local_branch].nil?
      name = if local_only
        purple br[:name]
      elsif remote_only
        cyan br[:name]
      else
        green br[:name]
      end

      ## for remote_only branches, we'll compute wrt the remote branch head. otherwise, we'll
      ## use the local branch head.
      head = remote_only ? br[:remote_branch] : br[:local_branch]

      remote_ahead = b[:remote_branch] ? commits_between(b[:remote_branch], head) : []
      local_ahead = b[:local_branch] ? commits_between(b[:local_branch], head) : []

      if local_ahead.empty? && remote_ahead.empty?
        puts "#{widget true, remote_only, local_only} #{name} #{local_only ? "(local-only) " : ""}is merged in"
      elsif local_ahead.empty?
        puts "#{widget true, remote_only, local_only, true} #{name} merged in (only locally)"
      else
        behind = commits_between head, (br[:local_branch] || br[:remote_branch])
        ahead = remote_only ? remote_ahead : local_ahead
        puts "#{widget false, remote_only, local_only} #{name} #{local_only ? "(local-only) " : ""}is NOT merged in (#{ahead_behind_string ahead, behind})"
        show_commits ahead unless $short
      end
    end
  else
    puts "\nIntegration branches:" unless ibs.empty? # unlikely
    ibs.sort_by { |v, br| v }.each do |v, br|
      next if $config["ignore"].member?(br[:local_branch]) || $config["ignore"].member?(br[:remote_branch])
      next if br[:ignore]
      local_only = br[:remote_branch].nil?
      remote_only = br[:local_branch].nil?
      name = remote_only ? cyan(br[:name]) : green(br[:name])

      ahead = commits_between v, (b[:local_branch] || b[:remote_branch])
      if ahead.empty?
        puts "#{widget true, local_only} merged into #{name}"
      else
        #behind = commits_between b[:local_branch], v
        puts "#{widget false, local_only} NOT merged into #{name} (#{ahead.size.pluralize 'commit'} ahead)"
        show_commits ahead unless $short
      end
    end
  end
end

#### EXECUTION STARTS HERE ####

## find config file and load it
$config = { "integration-branches" => %w(heads/master heads/next heads/edge), "ignore" => [], "max_commits" => 5 }.merge begin
  fn = find_file CONFIG_FN
  if fn && (h = YAML::load_file(fn)) # yaml turns empty files into false
    h["integration-branches"] ||= h["versions"] # support old nomenclature
    h
  else
    {}
  end
end

if $dump_config
  puts $config.to_yaml
  exit
end

## first, index registered remotes
remotes = `git config --get-regexp ^remote\.\*\.url`.split(/[\r\n]+/).inject({}) do |hash, l|
  l =~ /^remote\.(.+?)\.url (.+)$/ or next hash
  hash[$1] ||= $2
  hash
end

## next, index followed branches
branches = `git config --get-regexp ^branch\.`.split(/[\r\n]+/).inject({}) do |hash, l|
  case l
  when /branch\.(.*?)\.remote (.+)/
    name, remote = $1, $2

    hash[name] ||= {}
    hash[name].merge! :remote => remote, :remote_url => remotes[remote]
  when /branch\.(.*?)\.merge ((refs\/)?heads\/)?(.+)/
    name, remote_branch = $1, $4
    hash[name] ||= {}
    hash[name].merge! :remote_mergepoint => remote_branch
  end
  hash
end

## finally, index all branches
remote_branches = {}
`git show-ref`.split(/[\r\n]+/).each do |l|
  sha1, ref = l.chomp.split " refs/"

  if ref =~ /^heads\/(.+)$/ # local branch
    name = $1
    next if name == "HEAD"
    branches[name] ||= {}
    branches[name].merge! :name => name, :local_branch => ref
  elsif ref =~ /^remotes\/(.+?)\/(.+)$/ # remote branch
    remote, name = $1, $2
    remote_branches["#{remote}/#{name}"] = true
    next if name == "HEAD"
    ignore = !($all || remote == "origin")

    branch = name
    if branches[name] && branches[name][:remote] == remote
      # nothing
    else
      name = "#{remote}/#{branch}"
    end

    branches[name] ||= {}
    branches[name].merge! :name => name, :remote => remote, :remote_branch => "#{remote}/#{branch}", :remote_url => remotes[remote], :ignore => ignore
  end
end

## assemble remotes
branches.each do |k, b|
  next unless b[:remote] && b[:remote_mergepoint]
  b[:remote_branch] = if b[:remote] == "."
    b[:remote_mergepoint]
  else
    t = "#{b[:remote]}/#{b[:remote_mergepoint]}"
    remote_branches[t] && t # only if it's still alive
  end
end

show_dirty = ARGV.empty?
targets = if ARGV.empty?
  [`git symbolic-ref HEAD`.chomp.sub(/^refs\/heads\//, "")]
else
  ARGV.map { |x| x.sub(/^heads\//, "") }
end.map { |t| branches[t] or abort "Error: can't find branch #{t.inspect}." }

targets.each do |t|
  show t
  show_relations t, branches if $show_relations || t[:remote_branch].nil?
end

modified = show_dirty && `git ls-files -m` != ""
uncommitted = show_dirty &&  `git diff-index --cached HEAD` != ""

if $key
  puts
  puts KEY
end

puts if modified || uncommitted
puts "#{red "NOTE"}: working directory contains modified files." if modified
puts "#{red "NOTE"}: staging area contains staged but uncommitted files." if uncommitted

# the end!
