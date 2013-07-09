import os
import re

import sublime
from git import GitWindowCommand, git_root


class GitStatusCommand(GitWindowCommand):
    force_open = False

    def run(self):
        self.run_command(['git', 'status', '--porcelain'], self.status_done)

    def status_done(self, result):
        self.results = filter(self.status_filter, result.rstrip().split('\n'))
        if len(self.results):
            self.show_status_list()
        else:
            sublime.status_message("Nothing to show")

    def show_status_list(self):
        self.quick_panel(self.results, self.panel_done,
            sublime.MONOSPACE_FONT)

    def status_filter(self, item):
        # for this class we don't actually care
        if not re.match(r'^[ MADRCU?!]{1,2}\s+.*', item):
            return False
        return len(item) > 0

    def panel_done(self, picked):
        if 0 > picked < len(self.results):
            return
        picked_file = self.results[picked]
        # first 2 characters are status codes, the third is a space
        picked_status = picked_file[:2]
        picked_file = picked_file[3:]
        self.panel_followup(picked_status, picked_file, picked)

    def panel_followup(self, picked_status, picked_file, picked_index):
        # split out solely so I can override it for laughs

        s = sublime.load_settings("Git.sublime-settings")
        root = git_root(self.get_working_dir())
        if picked_status == '??' or s.get('status_opens_file') or self.force_open:
            if(os.path.isfile(os.path.join(root, picked_file))):
                self.window.open_file(os.path.join(root, picked_file))
        else:
            self.run_command(['git', 'diff', '--no-color', '--', picked_file.strip('"')],
                self.diff_done, working_dir=root)

    def diff_done(self, result):
        if not result.strip():
            return
        self.scratch(result, title="Git Diff")


class GitOpenModifiedFilesCommand(GitStatusCommand):
    force_open = True

    def show_status_list(self):
        for line_index in range(0, len(self.results)):
            self.panel_done(line_index)
