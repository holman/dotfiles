import os
import re

import sublime
from git import GitTextCommand, GitWindowCommand, git_root
import status


class GitAddChoiceCommand(status.GitStatusCommand):
    def status_filter(self, item):
        return super(GitAddChoiceCommand, self).status_filter(item) and not item[1].isspace()

    def show_status_list(self):
        self.results = [[" + All Files", "apart from untracked files"], [" + All Files", "including untracked files"]] + self.results
        return super(GitAddChoiceCommand, self).show_status_list()

    def panel_followup(self, picked_status, picked_file, picked_index):
        working_dir = git_root(self.get_working_dir())

        if picked_index == 0:
            command = ['git', 'add', '--update']
        elif picked_index == 1:
            command = ['git', 'add', '--all']
        else:
            command = ['git']
            picked_file = picked_file.strip('"')
            if os.path.isfile(working_dir + "/" + picked_file):
                command += ['add']
            else:
                command += ['rm']
            command += ['--', picked_file]

        self.run_command(command, self.rerun,
            working_dir=working_dir)

    def rerun(self, result):
        self.run()


class GitAdd(GitTextCommand):
    def run(self, edit):
        self.run_command(['git', 'add', self.get_file_name()])


class GitAddSelectedHunkCommand(GitTextCommand):
    def run(self, edit):
        self.run_command(['git', 'diff', '--no-color', '-U1', self.get_file_name()], self.cull_diff)

    def cull_diff(self, result):
        selection = []
        for sel in self.view.sel():
            selection.append({
                "start": self.view.rowcol(sel.begin())[0] + 1,
                "end": self.view.rowcol(sel.end())[0] + 1,
            })

        hunks = [{"diff":""}]
        i = 0
        matcher = re.compile('^@@ -([0-9]*)(?:,([0-9]*))? \+([0-9]*)(?:,([0-9]*))? @@')
        for line in result.splitlines():
            if line.startswith('@@'):
                i += 1
                match = matcher.match(line)
                start = int(match.group(3))
                end = match.group(4)
                if end:
                    end = start + int(end)
                else:
                    end = start
                hunks.append({"diff": "", "start": start, "end": end})
            hunks[i]["diff"] += line + "\n"

        diffs = hunks[0]["diff"]
        hunks.pop(0)
        selection_is_hunky = False
        for hunk in hunks:
            for sel in selection:
                if sel["end"] < hunk["start"]:
                    continue
                if sel["start"] > hunk["end"]:
                    continue
                diffs += hunk["diff"]  # + "\n\nEND OF HUNK\n\n"
                selection_is_hunky = True

        if selection_is_hunky:
            self.run_command(['git', 'apply', '--cached'], stdin=diffs)
        else:
            sublime.status_message("No selected hunk")


# Also, sometimes we want to undo adds


class GitResetHead(object):
    def run(self, edit=None):
        self.run_command(['git', 'reset', 'HEAD', self.get_file_name()])

    def generic_done(self, result):
        pass


class GitResetHeadCommand(GitResetHead, GitTextCommand):
    pass


class GitResetHeadAllCommand(GitResetHead, GitWindowCommand):
    pass


class GitResetHardHeadCommand(GitWindowCommand):
    may_change_files = True

    def run(self):
        if sublime.ok_cancel_dialog("Warning: this will reset your index and revert all files, throwing away all your uncommitted changes with no way to recover. Consider stashing your changes instead if you'd like to set them aside safely.", "Continue"):
            self.run_command(['git', 'reset', '--hard', 'HEAD'])
