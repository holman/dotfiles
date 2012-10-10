import platform
import subprocess

import sublime_plugin
import sublime

PLATFORM_IS_WINDOWS = platform.system() is 'Windows'


class CoffeeCompileCommand(sublime_plugin.TextCommand):

    PANEL_NAME = 'coffeecompile_output'
    COFFEE_COMMAND = 'coffee.cmd' if PLATFORM_IS_WINDOWS else 'coffee'

    def run(self, edit):
        text = self._get_text_to_compile()
        window = self.view.window()

        javascript, error = self._compile(text, window)
        self._write_output_to_panel(window, javascript, error)

    def _compile(self, text, window):
        args = [self.COFFEE_COMMAND, '--stdio', '--print', '--lint']
        startupinfo = self._get_startupinfo() if PLATFORM_IS_WINDOWS else None

        process = subprocess.Popen(args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            startupinfo=startupinfo)

        return process.communicate(text)

    def _write_output_to_panel(self, window, javascript, error):
        panel = window.get_output_panel(self.PANEL_NAME)
        panel.set_syntax_file('Packages/JavaScript/JavaScript.tmLanguage')

        output_view = window.get_output_panel(self.PANEL_NAME)
        output_view.set_read_only(False)
        edit = output_view.begin_edit()
        output_view.insert(edit, 0, javascript)
        output_view.end_edit(edit)
        output_view.sel().clear()
        output_view.set_read_only(True)

        window.run_command('show_panel', {'panel': 'output.%s' % self.PANEL_NAME})

    def _get_text_to_compile(self):
        region = self._get_selected_region() if self._editor_contains_selected_text() \
            else self._get_region_for_entire_file()
        return self.view.substr(region)

    def _get_region_for_entire_file(self):
        return sublime.Region(0, self.view.size())

    def _get_selected_region(self):
        return self.view.sel()[0]

    def _editor_contains_selected_text(self):
        for region in self.view.sel():
            if not region.empty():
                return True
        return False

    def _get_startupinfo(self):
        info = subprocess.STARTUPINFO()
        info.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        info.wShowWindow = subprocess.SW_HIDE
