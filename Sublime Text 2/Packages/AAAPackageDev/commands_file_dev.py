import sublime_plugin

from sublime_lib import path


tpl = """[
    { "caption": "${1:My Caption for the Comand Palette}", "command": "${2:my_command}" }$0
]"""

SYNTAX_DEF = 'Packages/AAAPackageDev/Support/Sublime Commands.tmLanguage'


class NewCommandsFileCommand(sublime_plugin.WindowCommand):
    def run(self):
        v = self.window.new_file()
        v.run_command('insert_snippet', {'contents': tpl})
        v.settings().set('default_dir', path.root_at_packages('User'))
        v.set_syntax_file(SYNTAX_DEF)


