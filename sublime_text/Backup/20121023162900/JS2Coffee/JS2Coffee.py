import sublime
import sublime_plugin
import subprocess


class JsCoffeeCommand(sublime_plugin.WindowCommand):
    def run(self, new_file):
        self.new_file = new_file
        self.view = self.window.active_view()
        input_region = self.select_all(self.view)

        contents = self.view.substr(input_region)
        output = self.js2coffee(contents)

        if output:
            if self.new_file:
                view = self.window.new_file()
                output_region = self.select_all(view)
            else:
                view = self.view
                output_region = input_region

            edit = view.begin_edit()
            view.replace(edit, output_region, output)
            view.set_syntax_file('Packages/CoffeeScript/CoffeeScript.tmLanguage')
            view.end_edit(edit)

    def select_all(self, view):
        """returns a region containing the whole view"""
        return sublime.Region(0, self.view.size())

    def js2coffee(self, contents):
        js2coffee = subprocess.Popen(
            'js2coffee',
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True
        )
        output, error = js2coffee.communicate(contents)

        if error:
            self.write_to_console(error)
            self.window.run_command("show_panel", {"panel": "output.exec"})
            return None
        return output

    def write_to_console(self, str):
        self.output_view = self.window.get_output_panel("exec")
        selection_was_at_end = (
            len(self.output_view.sel()) == 1 and
            self.output_view.sel()[0] == sublime.Region(self.output_view.size())
        )
        self.output_view.set_read_only(False)
        edit = self.output_view.begin_edit()
        self.output_view.insert(edit, self.output_view.size(), str)
        if selection_was_at_end:
            self.output_view.show(self.output_view.size())
        self.output_view.end_edit(edit)
        self.output_view.set_read_only(True)
