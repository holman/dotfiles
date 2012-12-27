import sublime
from git import GitTextCommand, GitWindowCommand


class GitDiff (object):
    def run(self, edit=None):
        self.run_command(['git', 'diff', '--no-color', '--', self.get_file_name()],
                         self.diff_done)

    def diff_done(self, result):
        if not result.strip():
            self.panel("No output")
            return
        s = sublime.load_settings("Git.sublime-settings")
        if s.get('diff_panel'):
            view = self.panel(result)
        else:
            view = self.scratch(result, title="Git Diff")

        lines_inserted = view.find_all(r'^\+[^+]{2} ')
        lines_deleted = view.find_all(r'^-[^-]{2} ')

        view.add_regions("inserted", lines_inserted, "markup.inserted.diff", "dot", sublime.HIDDEN)
        view.add_regions("deleted", lines_deleted, "markup.deleted.diff", "dot", sublime.HIDDEN)


class GitDiffCommit (object):
    def run(self, edit=None):
        self.run_command(['git', 'diff', '--cached', '--no-color'],
            self.diff_done)

    def diff_done(self, result):
        if not result.strip():
            self.panel("No output")
            return
        self.scratch(result, title="Git Diff")


class GitDiffCommand(GitDiff, GitTextCommand):
    pass


class GitDiffAllCommand(GitDiff, GitWindowCommand):
    pass


class GitDiffCommitCommand(GitDiffCommit, GitWindowCommand):
    pass


class GitDiffTool(object):
    def run(self, edit=None):
        self.run_command(['git', 'difftool', '--', self.get_file_name()])


class GitDiffToolCommand(GitDiffTool, GitTextCommand):
    pass


class GitDiffToolAll(GitWindowCommand):
    def run(self):
        self.run_command(['git', 'difftool'])
