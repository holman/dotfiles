require 'rubygems'
gem 'pry'
require 'pry'

class PryInput
	def readline(prompt)
		$stdout.print prompt
		$stdout.flush
		$stdin.readline
	end
end

class PryOutput
	def puts(data="")
		$stdout.puts(data.gsub('`', "'"))
		$stdout.flush
	end
end

Pry.config.input = PryInput.new()
Pry.config.output = PryOutput.new()
Pry.config.color = false
Pry.config.editor = ARGV[0]
Pry.config.auto_indent = false
Pry.config.correct_indent = false

Pry.start self
