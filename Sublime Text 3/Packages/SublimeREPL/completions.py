import sublime
import sublime_plugin


class SublimeREPLCompletions(sublime_plugin.EventListener):
    def on_query_completions(self, view, prefix, locations):
        if not view.settings().get("repl"):
            return True

        from sublimerepl import manager
        rv = manager.repl_view(view)
        if not rv:
            return []

        repl = rv.repl
        if not repl.autocomplete_available():
            return []

        line = view.line(locations[0])

        start = max(line.begin(), rv._output_end)
        end = line.end()

        whole_line = view.substr(sublime.Region(start, end))
        pos_in_line = locations[0] - start
        whole_prefix = whole_line[:pos_in_line]

        completions = repl.autocomplete_completions(
            whole_line=whole_line,
            pos_in_line=pos_in_line,
            prefix=prefix,
            whole_prefix=whole_prefix,
            locations=locations)
        return completions, sublime.INHIBIT_WORD_COMPLETIONS | sublime.INHIBIT_EXPLICIT_COMPLETIONS
