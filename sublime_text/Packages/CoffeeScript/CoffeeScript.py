import sublime
import sys
from os import path
from subprocess import Popen, PIPE
from sublime_plugin import TextCommand, WindowCommand

settings = sublime.load_settings('CoffeeScript.sublime-settings')

def run(cmd, args = [], source="", cwd = None, env = None):
	if not type(args) is list:
		args = [args]
	if sys.platform == "win32":
		proc = Popen([cmd]+args, env=env, cwd=cwd, stdout=PIPE, stdin=PIPE, stderr=PIPE, shell=True)
		stat = proc.communicate(input=source)
	else:
		if env is None:
			env = {"PATH": settings.get('binDir', '/usr/local/bin')}
		if source == "":
			command = [cmd]+args
		else:
			command = [cmd]+args+[source]
		proc = Popen(command, env=env, cwd=cwd, stdout=PIPE, stderr=PIPE)
		stat = proc.communicate()
	okay = proc.returncode == 0
	return {"okay": okay, "out": stat[0], "err": stat[1]}

def brew(args, source):
	if sys.platform == "win32":
		args.append("-s")
	else:
		args.append("-e")
	return run("coffee", args=args, source=source)

def cake(task, cwd):
	return run("cake", args=task, cwd=cwd)

def isCoffee(view = None):
	if view is None:
		view = sublime.active_window().active_view()
	return 'source.coffee' in view.scope_name(0)

class Text():
	@staticmethod
	def all(view):
		return view.substr(sublime.Region(0, view.size()))
	@staticmethod
	def sel(view):
		text = []
		for region in view.sel():
			if region.empty():
				continue
			text.append(view.substr(region))
		return "".join(text)

	@staticmethod
	def get(view):
		text = Text.sel(view)
		if len(text) > 0:
			return text
		return Text.all(view)

class CompileCommand(TextCommand):
	def is_enabled(self):
		return isCoffee(self.view)

	def run(self, *args, **kwargs):
		result = run("coffee", args=['-b', '-c', self.view.file_name()])

		if result['okay'] is True:
			status = 'Compilation Succeeded'
		else:
			status = 'Compilation Failed'

		sublime.status_message(status)

class CompileAndDisplayCommand(TextCommand):
	def is_enabled(self):
		return isCoffee(self.view)

	def run(self, edit, **kwargs):
		opt = kwargs["opt"]
		res = brew(['-b', opt], Text.get(self.view))
		output = self.view.window().new_file()
		output.set_scratch(True)
		if opt == '-p':
			output.set_syntax_file('Packages/JavaScript/JavaScript.tmLanguage')
		if res["okay"] is True:
			output.insert(edit, 0, res["out"])
		else:
			output.insert(edit, 0, res["err"].split("\n")[0])

class CheckSyntaxCommand(TextCommand):
	def is_enabled(self):
		return isCoffee(self.view)

	def run(self, edit):
		res = brew(['-b', '-p'], Text.get(self.view))
		if res["okay"] is True:
			status = 'Valid'
		else:
			status = res["err"].split("\n")[0]
		sublime.status_message('Syntax %s' % status)

class RunScriptCommand(WindowCommand):
	def finish(self, text):
		if text == '':
			return
		text = "{puts, print} = require 'util'\n" + text
		res = brew(['-b'], text)
		if res["okay"] is True:
			output = self.window.new_file()
			output.set_scratch(True)
			edit = output.begin_edit()
			output.insert(edit, 0, res["out"])
			output.end_edit(edit)
		else:
			sublime.status_message('Syntax %s' % res["err"].split("\n")[0])

	def run(self):
		sel = Text.sel(sublime.active_window().active_view())
		if len(sel) > 0:
			if not isCoffee(): return
			self.finish(sel)
		else:
			self.window.show_input_panel('Coffee >', '', self.finish, None, None)

class RunCakeTaskCommand(WindowCommand):
	def finish(self, task):
		if task == '':
			return

		if not self.window.folders():
			cakepath = path.dirname(self.window.active_view().file_name())
		else:
			cakepath = path.join(self.window.folders()[0], 'Cakefile')
			if not path.exists(cakepath):
				cakepath = path.dirname(self.window.active_view().file_name())

		if not path.exists(cakepath):
			return sublime.status_message("Cakefile not found.")

		res = cake(task, cakepath)
		if res["okay"] is True:
			if "No such task" in res["out"]:
				msg = "doesn't exist"
			else:
				msg = "suceeded"
		else:
			msg = "failed"
		sublime.status_message("Task %s - %s." % (task, msg))

	def run(self):
		self.window.show_input_panel('Cake >', '', self.finish, None, None)
