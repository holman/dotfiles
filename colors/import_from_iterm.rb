#!/usr/bin/env ruby

# imports an iTerm color profile to gnome terminal
# syntax: import_from_iterm.rb <path_to_profile> <profile_name>

require 'nokogiri'
require 'nokogiri-plist'

class Color
  attr_accessor :red
  attr_accessor :green
  attr_accessor :blue

  def initialize(args={})
    args.each_pair do |k, v|
      self.send("#{k}=", v)
    end
  end

  def to_48bit_hex
    red_part   = sprintf("%04x", (red.to_f   * 65535).round)
    green_part = sprintf("%04x", (green.to_f * 65535).round)
    blue_part  = sprintf("%04x", (blue.to_f  * 65535).round)
    "##{red_part}#{green_part}#{blue_part}"
  end
end

file_path    = ARGV[0]
profile_name = ARGV[1]

unless file_path && profile_name
  puts "Syntax: import_from_iterm.rb <path_to_profile> <profile_name>"
  exit(-1)
end

if Dir.exists?("colors/#{profile_name}")
  puts "Color #{profile_name} already exists, delete it or choose a different name"
  exit(-1)
end

input = File.open(file_path)
plist = Nokogiri::PList(input)
input.close

# First of all, we need to collect values for each ansi color
# Label inside plist file is like "Ansi 0 Color"

colors = {}
(0).upto(15) do |count|
  label = "Ansi #{count} Color"
  data  = plist[label]
  colors[label] = Color.new(
    red: data['Red Component'],
    green: data['Green Component'],
    blue: data['Blue Component'],
  )
end

# Now, we need to collect other data: background color, foreground color, and bold color

['Background Color', 'Foreground Color', 'Bold Color'].each do |label|
  data  = plist[label] || {}
  colors[label] = Color.new(
    red: data['Red Component'],
    green: data['Green Component'],
    blue: data['Blue Component'],
  )
end

# Very good. Now we have all we need to generate the Gnome Terminal color profile.

# Let's start creating a directory

Dir.mkdir("colors/#{profile_name}")

# now, the palettes. Let's build it first

palette = []
(0).upto(15) do |count|
  label = "Ansi #{count} Color"
  color_code_48_bit = colors[label].to_48bit_hex
  palette << color_code_48_bit
end

# now let's write the dconf palette
File.open("colors/#{profile_name}/palette_dconf", "w") do |f|
  f.puts palette.map { |color| "'#{color}'"}.join(", ")
end

# and the gconf palette
File.open("colors/#{profile_name}/palette_gconf", "w") do |f|
  f.puts palette.join(":")
end

# bold color
File.open("colors/#{profile_name}/bd_color", "w") do |f|
  f.puts colors['Bold Color'].to_48bit_hex
end

# background color
File.open("colors/#{profile_name}/bg_color", "w") do |f|
  f.puts colors['Background Color'].to_48bit_hex
end

# Foreground color
File.open("colors/#{profile_name}/fg_color", "w") do |f|
  f.puts colors['Foreground Color'].to_48bit_hex
end

# A little README.md file
File.open("colors/#{profile_name}/README.md", "w") do |f|
  f.puts "Colorscheme #{profile_name} - imported from iterm on #{Time.now}" 
end

puts "Done!"
