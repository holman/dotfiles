import sublime
import sublime_plugin
import subprocess
import re
import os


class JsCoffeeCommand(sublime_plugin.TextCommand):
    def view_contents(self):
        whole_file = sublime.Region(0, self.view.size())
        return self.view.substr(whole_file)

    def run(self, edit):
        self.edit = edit
        self.js_file = self.view.file_name()

        # unsaved buffer -> new buffer
        if not self.js_file:
            return self.new_buffer(self.view_contents())

        coffee_file = re.sub(r'/js/(.*)\.js$', r'/coffee/\1.coffee', self.js_file)
        if os.path.isfile(coffee_file):
            # file -> buffer (no overwrite)
            if not sublime.ok_cancel_dialog('File %s exists. Overwrite?' % coffee_file):
                return self.new_buffer()

        # make output dir if needed
        output_dir = os.path.dirname(coffee_file)
        if not os.path.isdir(output_dir):
            os.makedirs(output_dir)


        # file -> file
        with open(coffee_file, 'w') as coffee:
            coffee.write(self.js2coffee())

            sublime.active_window().open_file(coffee_file)

    def js2coffee(self, contents=None):
        if contents:
            js2coffee = subprocess.Popen('js2coffee', 
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE, 
                shell=True)
            output, error = js2coffee.communicate(contents)
        else:
            with open(self.js_file, 'r') as js:
                js2coffee = subprocess.Popen('js2coffee', 
                    stdin=js,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE, 
                    shell=True)
                output, error = js2coffee.communicate()
        if error:
            raise OSError(error)
        return output

    def new_buffer(self, contents=None):
        view = sublime.active_window().new_file()
        view.insert(self.edit, 0, self.js2coffee(contents))
