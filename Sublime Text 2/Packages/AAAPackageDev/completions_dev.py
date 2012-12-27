import sublime, sublime_plugin

from sublime_lib.path import root_at_packages


COMPLETIONS_SYNTAX_DEF = "Packages/AAAPackageDev/Support/Sublime Completions.tmLanguage"
TPL = """{
    "scope": "source.${1:off}",

    "completions": [
        { "trigger": "${2:some_trigger}", "contents": "${3:Hint: Use f, ff and fff plus Tab inside here.}" }$0
    ]
}"""


class NewCompletionsCommand(sublime_plugin.WindowCommand):
    def run(self):
        v = self.window.new_file()
        v.run_command('insert_snippet', {"contents": TPL})
        v.settings().set('syntax', COMPLETIONS_SYNTAX_DEF)
        v.settings().set('default_dir', root_at_packages('User'))
