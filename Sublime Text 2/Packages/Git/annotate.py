import tempfile
import re
import os

import sublime
import sublime_plugin
from git import git_root, GitTextCommand


class GitClearAnnotationCommand(GitTextCommand):
    def run(self, view):
        self.active_view().settings().set('live_git_annotations', False)
        self.view.erase_regions('git.changes.x')
        self.view.erase_regions('git.changes.+')
        self.view.erase_regions('git.changes.-')


class GitToggleAnnotationsCommand(GitTextCommand):
    def run(self, view):
        if self.active_view().settings().get('live_git_annotations'):
            self.view.run_command('git_clear_annotation')
        else:
            self.view.run_command('git_annotate')


class GitAnnotationListener(sublime_plugin.EventListener):
    def on_modified(self, view):
        if not view.settings().get('live_git_annotations'):
            return
        view.run_command('git_annotate')

    def on_load(self, view):
        s = sublime.load_settings("Git.sublime-settings")
        if s.get('annotations'):
            view.run_command('git_annotate')


class GitAnnotateCommand(GitTextCommand):
    # Unfortunately, git diff does not support text from stdin, making a *live*
    # annotation difficult. Therefore I had to resort to the system diff
    # command.
    # This works as follows:
    # 1. When the command is run for the first time for this file, a temporary
    #    file with the current state of the HEAD is being pulled from git.
    # 2. All consecutive runs will pass the current buffer into diffs stdin.
    #    The resulting output is then parsed and regions are set accordingly.
    def run(self, view):
        # If the annotations are already running, we dont have to create a new
        # tmpfile
        if hasattr(self, "tmp"):
            self.compare_tmp(None)
            return
        self.tmp = tempfile.NamedTemporaryFile()
        self.active_view().settings().set('live_git_annotations', True)
        root = git_root(self.get_working_dir())
        repo_file = os.path.relpath(self.view.file_name(), root)
        self.run_command(['git', 'show', 'HEAD:{0}'.format(repo_file)], show_status=False, no_save=True, callback=self.compare_tmp, stdout=self.tmp)

    def compare_tmp(self, result, stdout=None):
        all_text = self.view.substr(sublime.Region(0, self.view.size())).encode("utf-8")
        self.run_command(['diff', '-u', self.tmp.name, '-'], stdin=all_text, no_save=True, show_status=False, callback=self.parse_diff)

    # This is where the magic happens. At the moment, only one chunk format is supported. While
    # the unified diff format theoritaclly supports more, I don't think git diff creates them.
    def parse_diff(self, result, stdin=None):
        lines = result.splitlines()
        matcher = re.compile('^@@ -([0-9]*),([0-9]*) \+([0-9]*),([0-9]*) @@')
        diff = []
        for line_index in range(0, len(lines)):
            line = lines[line_index]
            if not line.startswith('@'):
                continue
            match = matcher.match(line)
            if not match:
                continue
            line_before, len_before, line_after, len_after = [int(match.group(x)) for x in [1, 2, 3, 4]]
            chunk_index = line_index + 1
            tracked_line_index = line_after - 1
            deletion = False
            insertion = False
            while True:
                line = lines[chunk_index]
                if line.startswith('@'):
                    break
                elif line.startswith('-'):
                    if not line.strip() == '-':
                        deletion = True
                    tracked_line_index -= 1
                elif line.startswith('+'):
                    if deletion and not line.strip() == '+':
                        diff.append(['x', tracked_line_index])
                        insertion = True
                    elif not deletion:
                        insertion = True
                        diff.append(['+', tracked_line_index])
                else:
                    if not insertion and deletion:
                        diff.append(['-', tracked_line_index])
                    insertion = deletion = False
                tracked_line_index += 1
                chunk_index += 1
                if chunk_index >= len(lines):
                    break

        self.annotate(diff)

    # Once we got all lines with their specific change types (either x, +, or - for
    # modified, added, or removed) we can create our regions and do the actual annotation.
    def annotate(self, diff):
        self.view.erase_regions('git.changes.x')
        self.view.erase_regions('git.changes.+')
        self.view.erase_regions('git.changes.-')
        typed_diff = {'x': [], '+': [], '-': []}
        for change_type, line in diff:
            if change_type == '-':
                full_region = self.view.full_line(self.view.text_point(line - 1, 0))
                position = full_region.begin()
                for i in xrange(full_region.size()):
                    typed_diff[change_type].append(sublime.Region(position + i))
            else:
                point = self.view.text_point(line, 0)
                region = self.view.full_line(point)
                if change_type == '-':
                    region = sublime.Region(point, point + 5)
                typed_diff[change_type].append(region)

        for change in ['x', '+']:
            self.view.add_regions("git.changes.{0}".format(change), typed_diff[change], 'git.changes.{0}'.format(change), 'dot', sublime.HIDDEN)

        self.view.add_regions("git.changes.-", typed_diff['-'], 'git.changes.-', 'dot', sublime.DRAW_EMPTY_AS_OVERWRITE)
