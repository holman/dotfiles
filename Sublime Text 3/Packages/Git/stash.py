from git import GitWindowCommand


class GitStashCommand(GitWindowCommand):
    may_change_files = True

    def run(self):
        self.run_command(['git', 'stash'])


class GitStashPopCommand(GitWindowCommand):
    def run(self):
        self.run_command(['git', 'stash', 'pop'])


class GitStashApplyCommand(GitWindowCommand):
    may_change_files = True
    command_to_run_after_list = 'apply'

    def run(self):
        self.run_command(['git', 'stash', 'list'], self.stash_list_done)

    def stash_list_done(self, result):
        # No stash list at all
        if not result:
            self.panel('No stash found')
            return

        self.results = result.rstrip().split('\n')

        # If there is only one, apply it
        if len(self.results) == 1:
            self.stash_list_panel_done()
        else:
            self.quick_panel(self.results, self.stash_list_panel_done)

    def stash_list_panel_done(self, picked=0):
        if 0 > picked < len(self.results):
            return

        # get the stash ref (e.g. stash@{3})
        self.stash = self.results[picked].split(':')[0]
        self.run_command(['git', 'stash', self.command_to_run_after_list, self.stash])


class GitStashDropCommand(GitStashApplyCommand):
    command_to_run_after_list = 'drop'
