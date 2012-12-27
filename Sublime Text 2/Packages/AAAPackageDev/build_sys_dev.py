import sublime_plugin

from sublime_lib.path import root_at_packages


BUILD_SYSTEM_SYNTAX = 'Packages/AAAPackageDev/Support/Sublime Text Build System.tmLanguage'


# Adding "2" to avoid name clash with shipped command.
class NewBuildSystem2Command(sublime_plugin.WindowCommand):
    def run(self):
        v = self.window.new_file()
        v.settings().set('default_dir', root_at_packages('User'))
        v.set_syntax_file(BUILD_SYSTEM_SYNTAX)
        v.set_name('untitled.sublime-build')

        template = """{\n\t"cmd": ["${0:make}"]\n}"""
        v.run_command("insert_snippet", {"contents": template})
