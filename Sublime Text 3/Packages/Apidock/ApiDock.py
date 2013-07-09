# Written by Artem Kramarenko (me@artemk.name / www.artemk.name)

# available commands
#   apidock_ruby_search_selection
#   apidock_ruby_search_from_input
#   apidock_rails_search_selection
#   apidock_rails_search_from_input
#   apidock_rspec_search_selection
#   apidock_rspec_search_from_input

import sublime
import sublime_plugin

import subprocess
import webbrowser


def SearchApiDock(text, lang):
    url = 'http://apidock.com/%s?q=%s' % (lang, text.replace(' ','%20'))
    webbrowser.open_new_tab(url)


class ApidockSearchSelectionCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        for selection in self.view.sel():
            if selection.empty():
                text = self.view.word(selection)

            text = self.view.substr(selection)
            SearchApiDock(text, self.lang())


class ApidockRubySearchSelectionCommand(ApidockSearchSelectionCommand, sublime_plugin.WindowCommand):
    def lang(self):
        return 'ruby'


class ApidockRspecSearchSelectionCommand(ApidockSearchSelectionCommand, sublime_plugin.WindowCommand):
    def lang(self):
        return 'rspec'


class ApidockRailsSearchSelectionCommand(ApidockSearchSelectionCommand, sublime_plugin.WindowCommand):
    def lang(self):
        return 'rails'


class ApidockSearchFromInputCommand(sublime_plugin.WindowCommand):
    def run(self):
        # Get the search item
        self.window.show_input_panel('Search ApiDock %s' % (self.lang()), '',
            self.on_done, self.on_change, self.on_cancel)

    def on_done(self, input):
        SearchApiDock(input, self.lang())

    def on_change(self, input):
        pass

    def on_cancel(self):
        pass


class ApidockRubySearchFromInputCommand(ApidockSearchFromInputCommand):
    def lang(self):
        return 'ruby'


class ApidockRspecSearchFromInputCommand(ApidockSearchFromInputCommand):
    def lang(self):
        return 'rspec'


class ApidockRailsSearchFromInputCommand(ApidockSearchFromInputCommand):
    def lang(self):
        return 'rails'
