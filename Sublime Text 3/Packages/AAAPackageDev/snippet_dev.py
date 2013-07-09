import sublime, sublime_plugin

from sublime_lib.view import has_file_ext
from sublime_lib.path import root_at_packages

from xml.etree import ElementTree as ET
import os


RAW_SNIPPETS_SYNTAX = 'Packages/AAAPackageDev/Support/Sublime Snippet (Raw).tmLanguage'


TPL = """<snippet>
    <content><![CDATA[$1]]></content>
    <tabTrigger>${2:tab_trigger}</tabTrigger>
    <scope>${3:source.name}</scope>
</snippet>"""


class NewRawSnippetCommand(sublime_plugin.WindowCommand):
    def run(self):
        v = self.window.new_file()
        v.settings().set('default_dir', root_at_packages('User'))
        v.settings().set('syntax', RAW_SNIPPETS_SYNTAX)
        v.set_scratch(True)


class GenerateSnippetFromRawSnippetCommand(sublime_plugin.TextCommand):
    def is_enabled(self):
        return self.view.match_selector(0, 'source.sublimesnippetraw')

    def run(self, edit):
        # XXX: sublime_lib: new whole_content(view) function?
        content = self.view.substr(sublime.Region(0, self.view.size()))
        self.view.replace(edit, sublime.Region(0, self.view.size()), '')
        self.view.run_command('insert_snippet', { 'contents': TPL })
        self.view.settings().set('syntax', 'Packages/XML/XML.tmLanguage')
        # Insert existing contents into CDATA section. We rely on the fact
        # that Sublime will place the first selection in the first field of
        # the newly inserted snippet.
        self.view.insert(edit, self.view.sel()[0].begin(), content)


class NewRawSnippetFromSnippetCommand(sublime_plugin.TextCommand):
    def is_enabled(self):
        return has_file_ext(self.view, 'sublime-snippet')

    def run(self, edit):
        snippet = self.view.substr(sublime.Region(0, self.view.size()))
        contents = ET.fromstring(snippet).findtext(".//content")
        v = self.view.window().new_file()
        v.insert(edit, 0, contents)
        v.settings().set('syntax', RAW_SNIPPETS_SYNTAX)


class CopyAndInsertRawSnippetCommand(sublime_plugin.TextCommand):
    """Inserts the raw snippet contents into the first selection of
    the previous view in the stack.

    Allows a workflow where you're creating snippets for a .sublime-completions
    file, for example, and you don't want to store them as .sublime-snippet
    files.
    """
    def is_enabled(self):
        return self.view.match_selector(0, 'source.sublimesnippetraw')

    def run(self, edit):
        snip = self.view.substr(sublime.Region(0, self.view.size()))
        self.view.window().run_command('close')
        target = sublime.active_window().active_view()
        target.replace(edit, target.sel()[0], snip)
