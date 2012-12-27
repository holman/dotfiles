import sublime
from git import GitWindowCommand


class GitFlowCommand(GitWindowCommand):
    def is_visible(self):
        s = sublime.load_settings("Git.sublime-settings")
        if s.get('flow'):
            return True


class GitFlowFeatureStartCommand(GitFlowCommand):
    def run(self):
        self.get_window().show_input_panel('Enter Feature Name:', '', self.on_done, None, None)

    def on_done(self, feature_name):
        self.run_command(['git-flow', 'feature', 'start', feature_name])


class GitFlowFeatureFinishCommand(GitFlowCommand):
    def run(self):
        self.run_command(['git-flow', 'feature'], self.feature_done)

    def feature_done(self, result):
        self.results = result.rstrip().split('\n')
        self.quick_panel(self.results, self.panel_done,
            sublime.MONOSPACE_FONT)

    def panel_done(self, picked):
        if 0 > picked < len(self.results):
            return
        picked_feature = self.results[picked]
        if picked_feature.startswith("*"):
            picked_feature = picked_feature.strip("*")
        picked_feature = picked_feature.strip()
        self.run_command(['git-flow', 'feature', 'finish', picked_feature])


class GitFlowReleaseStartCommand(GitFlowCommand):
    def run(self):
        self.get_window().show_input_panel('Enter Version Number:', '', self.on_done, None, None)

    def on_done(self, release_name):
        self.run_command(['git-flow', 'release', 'start', release_name])


class GitFlowReleaseFinishCommand(GitFlowCommand):
    def run(self):
        self.run_command(['git-flow', 'release'], self.release_done)

    def release_done(self, result):
        self.results = result.rstrip().split('\n')
        self.quick_panel(self.results, self.panel_done,
            sublime.MONOSPACE_FONT)

    def panel_done(self, picked):
        if 0 > picked < len(self.results):
            return
        picked_release = self.results[picked]
        if picked_release.startswith("*"):
            picked_release = picked_release.strip("*")
        picked_release = picked_release.strip()
        self.run_command(['git-flow', 'release', 'finish', picked_release])


class GitFlowHotfixStartCommand(GitFlowCommand):
    def run(self):
        self.get_window().show_input_panel('Enter hotfix name:', '', self.on_done, None, None)

    def on_done(self, hotfix_name):
        self.run_command(['git-flow', 'hotfix', 'start', hotfix_name])


class GitFlowHotfixFinishCommand(GitFlowCommand):
    def run(self):
        self.run_command(['git-flow', 'hotfix'], self.hotfix_done)

    def hotfix_done(self, result):
        self.results = result.rstrip().split('\n')
        self.quick_panel(self.results, self.panel_done,
            sublime.MONOSPACE_FONT)

    def panel_done(self, picked):
        if 0 > picked < len(self.results):
            return
        picked_hotfix = self.results[picked]
        if picked_hotfix.startswith("*"):
            picked_hotfix = picked_hotfix.strip("*")
        picked_hotfix = picked_hotfix.strip()
        self.run_command(['git-flow', 'hotfix', 'finish', picked_hotfix])
