import sublime
import sublime_plugin
import re, inspect, os
import shared

class OpenRspecFileCommand(sublime_plugin.WindowCommand):

	def run(self):
		if not self.window.active_view():
			return

		self.views = []
		window = self.window
		current_file_path = self.window.active_view().file_name()

		if re.search(r"\w+\.rb$", current_file_path):

			current_file = re.search(r"([\w\.]+)$", current_file_path).group(1)
			base_name = re.search(r"(\w+)\.(\w+)$", current_file).group(1)
			base_name = re.sub('_spec', '', base_name)

			source_matcher = re.compile("[/\\\\]" + base_name + "\.rb$")
			test_matcher   = re.compile("[/\\\\]" + base_name + "_spec\.rb$")

			target_group = shared.other_group_in_pair(window)

			print "Current file: " + current_file
			if  re.search(re.compile(base_name + "_spec\.rb$"), current_file):
				self.open_project_file(source_matcher, window, target_group)
			elif re.search(re.compile(base_name + "\.rb$"), current_file):
				self.open_project_file(test_matcher, window, target_group)
			else:
	 			print "Current file is not valid for RSpec switch file!"

	def open_project_file(self, file_matcher, window, group=-1):
		for root, dirs, files in os.walk(window.folders()[0]):
			for f in files:
				if re.search(r"\.rb$", f):
					cur_file = os.path.join(root, f)
					# print "Assessing: " + cur_file
					if file_matcher.search(cur_file):
						file_view = window.open_file(os.path.join(root, f))
						if group >= 0: # don't set the view unless specified
							window.run_command('move_to_group', {'group': group})
						self.views.append(file_view)
						print("Opened: " + f)
						return
		print("No matching files!")
