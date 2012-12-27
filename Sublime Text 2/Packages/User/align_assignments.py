# Align Assignments
# Copyright 2011 Adam Venturella
#
# Based on the work by Chris Poirier written for TextMate (Copyright Chris Poirier 2006.)
# http://courage-my-friend.org/articles/2006/05/16/fun-with-textmate-align-equals-in-a-block/
# Ported to Python from Ruby for Sublime Text
#
# Select a block of text, run the command to align equal signs.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sublime
import sublime_plugin
import re

class AlignAssignmentsCommand(sublime_plugin.TextCommand):
    def run(self, edit):

        relevant_line_pattern = r"^[^=]+[^-+<>=!%\/|&*^]=(?!=|~)"
        column_search_pattern = r"[\t ]*="

        for region in self.view.sel():
            if not region.empty():

                lines          = self.view.lines(region)
                total_lines    = len(lines)
                best_column    = 0
                target_lines   = []
                modified_lines = []

                # find the best column for the =
                for line in lines:
                    string = self.view.substr(line)
                    if re.search(relevant_line_pattern, string):
                        target_lines.append(line)
                        match       = re.search(column_search_pattern, string)
                        best_column = match.start(0) if match.start(0) > best_column else best_column

                # reformat the selection
                for line in target_lines:
                    string        = self.view.substr(line)
                    before, after = re.split(r"[\t ]*=[\t ]*", string, 1)

                    # we might be dealing withs something like:
                    # foo => bar
                    # array("foo" => $foo,
                    #       "baz" => $baz);
                    #
                    # so pick our join string wisely
                    artifact = " =" if after[0:1] == ">" else " = "
                    value    = artifact.join([before.ljust(best_column), after])

                    modified_lines.append({"region": line, "value":value})

                # start from the end and work up to the beginning
                # we do this because, by editing, we mess with the region
                # bounds. In other words if we modify the first region, and
                # it becomes shorter or longer, the bounds for the next region
                # are affected. Starting from the end, this is a non-issue
                while len(modified_lines) > 0:
                    item = modified_lines.pop()
                    edit = self.view.begin_edit("Align Equals")

                    self.view.replace(edit, item["region"], item["value"])
                    self.view.end_edit(edit)