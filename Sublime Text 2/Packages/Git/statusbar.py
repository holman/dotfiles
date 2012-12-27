import re

import sublime
import sublime_plugin
from git import GitTextCommand


class GitBranchStatusListener(sublime_plugin.EventListener):
    def on_activated(self, view):
        view.run_command("git_branch_status")

    def on_post_save(self, view):
        view.run_command("git_branch_status")


class GitBranchStatusCommand(GitTextCommand):
    def run(self, view):
        s = sublime.load_settings("Git.sublime-settings")
        if s.get("statusbar_branch"):
            self.run_command(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], self.branch_done, show_status=False, no_save=True)
        else:
            self.view.set_status("git-branch", "")
        if (s.get("statusbar_status")):
            self.run_command(['git', 'status', '--porcelain'], self.status_done, show_status=False, no_save=True)
        else:
            self.view.set_status("git-status", "")

    def branch_done(self, result):
        self.view.set_status("git-branch", "git branch: " + result.strip())

    def status_done(self, result):
        lines = [line for line in result.splitlines() if re.match(r'^[ MADRCU?!]{1,2}\s+.*', line)]
        index = [line[0] for line in lines if not line[0].isspace()]
        working = [line[1] for line in lines if not line[1].isspace()]
        self.view.set_status("git-status-index", "index: " + self.status_string(index))
        self.view.set_status("git-status-working", "working: " + self.status_string(working))

    def status_string(self, statuses):
        s = sublime.load_settings("Git.sublime-settings")
        symbols = s.get("statusbar_status_symbols")
        if not statuses:
            return symbols['clean']
        status = []
        if statuses.count('M'):
            status.append("%d%s" % (statuses.count('M'), symbols['modified']))
        if statuses.count('A'):
            status.append("%d%s" % (statuses.count('A'), symbols['added']))
        if statuses.count('D'):
            status.append("%d%s" % (statuses.count('D'), symbols['deleted']))
        if statuses.count('?'):
            status.append("%d%s" % (statuses.count('?'), symbols['untracked']))
        if statuses.count('U'):
            status.append("%d%s" % (statuses.count('U'), symbols['conflicts']))
        if statuses.count('R'):
            status.append("%d%s" % (statuses.count('R'), symbols['renamed']))
        if statuses.count('C'):
            status.append("%d%s" % (statuses.count('C'), symbols['copied']))
        return symbols['separator'].join(status)
