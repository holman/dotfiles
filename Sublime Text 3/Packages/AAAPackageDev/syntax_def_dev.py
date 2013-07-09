import json
import os
import plistlib
import xml.parsers.expat
import uuid
import re

import sublime_plugin

from sublime_lib.path import root_at_packages
from sublime_lib.view import (in_one_edit, coorded_substr)


JSON_TMLANGUAGE_SYNTAX = 'Packages/AAAPackageDev/Support/Sublime JSON Syntax Definition.tmLanguage'


# XXX: Move this to a txt file. Let user define his own under User too.
def get_syntax_def_boilerplate():
    JSON_TEMPLATE = """{ "name": "${1:Syntax Name}",
  "scopeName": "source.${2:syntax_name}",
  "fileTypes": ["$3"],
  "patterns": [$0
  ],
  "uuid": "%s"
}"""

    actual_tmpl = JSON_TEMPLATE % str(uuid.uuid4())
    return actual_tmpl


class NewSyntaxDefCommand(sublime_plugin.WindowCommand):
    """Creates a new syntax definition file for Sublime Text in JSON format
    with some boilerplate text.
    """
    def run(self):
        target = self.window.new_file()

        target.settings().set('default_dir', root_at_packages('User'))
        target.settings().set('syntax', JSON_TMLANGUAGE_SYNTAX)

        target.run_command('insert_snippet',
                           {'contents': get_syntax_def_boilerplate()})


class NewSyntaxDefFromBufferCommand(sublime_plugin.TextCommand):
    """Inserts boilerplate text for syntax defs into current view.
    """
    def is_enabled(self):
        # Don't mess up a non-empty buffer.
        return self.view.size() == 0

    def run(self, edit):
        self.view.settings().set('default_dir', root_at_packages('User'))
        self.view.settings().set('syntax', JSON_TMLANGUAGE_SYNTAX)

        with in_one_edit(self.view):
            self.view.run_command('insert_snippet',
                                  {'contents': get_syntax_def_boilerplate()})


# XXX: Why is this a WindowCommand? Wouldn't it work otherwise in build-systems?
class JsonToPlistCommand(sublime_plugin.WindowCommand):
    """
    Parses ``.json`` files and writes them into corresponding ``.plist``.
    Source file ``.JSON-XXX`` will generate a plist file named ``.XXX``.
    Pretty useful with ``.JSON-tmLanguage`` but works with almost any other name.
    """
    ext_regexp = re.compile(r'\.json(?:-([^\.]+))?$', flags=re.I)

    def is_enabled(self):
        v = self.window.active_view()
        return (v and (self.get_file_ext(v.file_name()) is not None))

    def get_file_ext(self, file_name):
        ret = self.ext_regexp.search(file_name)
        if ret is None:
            return None
        return '.' + (ret.group(1) or 'plist')

    def run(self, **kwargs):
        v = self.window.active_view()
        path = v.file_name()
        ext = self.get_file_ext(path)
        if not os.path.exists(path):
            print "[AAAPackageDev] File does not exists. (%s)" % path
            return
        if ext is None:
            print "[AAAPackageDev] Not a valid JSON file, please check extension. (%s)" % path
            return

        self.json_to_plist(path, ext)

    def json_to_plist(self, json_file, new_ext):
        path, fname = os.path.split(json_file)
        fbase, old_ext = os.path.splitext(fname)
        file_regex = r"Error parsing JSON:\s+'(.*?)'\s+.*?\s+line\s+(\d+)\s+column\s+(\d+)"

        if not hasattr(self, 'output_view'):
            # Try not to call get_output_panel until the regexes are assigned
            self.output_view = self.window.get_output_panel("aaa_package_dev")

        # FIXME: Can't get error navigation to work.
        self.output_view.settings().set("result_file_regex", file_regex)
        self.output_view.settings().set("result_base_dir", path)

        # Call get_output_panel a second time after assigning the above
        # settings, so that it'll be picked up as a result buffer
        self.window.get_output_panel("aaa_package_dev")

        with in_one_edit(self.output_view) as edit:
            try:
                with open(json_file) as json_content:
                    tmlanguage = json.load(json_content)
            except ValueError, e:
                self.output_view.insert(edit, 0, "Error parsing JSON: '%s' %s" % (json_file, str(e)))
            else:
                target = os.path.join(path, fbase + new_ext)
                self.output_view.insert(edit, 0, "Writing plist... (%s)" % target)
                plistlib.writePlist(tmlanguage, target)

        self.window.run_command("show_panel", {"panel": "output.aaa_package_dev"})


class PlistToJsonCommand(sublime_plugin.WindowCommand):
    """
    Parses ``.plist`` files and writes them into corresponding ``.json``.
    A source file has ``<!DOCTYPE plist`` at the beginning of the first two lines
    and uses the extension ``.XXX`` will generate a json file named ``.JSON-XXX``.
    This is pretty much the reverse of the json_to_plist command.

    Accepts parameters for ``json.dump()`` as arguments which override the default
    settings. Use this only if you know what you're doing!

    Please note:
    - Be careful with non-native JSON data types like <date> or <data>, they
      result in unpredictable behavior!
    - Floats of <float> or <real> tend to lose precision when being cast into Python
      data types. ``32.1`` (plist) will likely result in ``32.100000000000001`` (json).
    """
    DOCTYPE = "<!DOCTYPE plist"

    def is_enabled(self):
        v = self.window.active_view()
        return (self.get_file_ext(v) is not None)

    def get_file_ext(self, v):
        if not v:
            return None
        fn = v.file_name()
        ext = os.path.splitext(fn)[1]

        # check for ".plist" ext
        if ext == ".plist":
            return ".json"

        # check for plist namespace (doctype) in first two lines
        for i in range(2):
            text = coorded_substr(v, (i, 0), (i, len(self.DOCTYPE)))
            print "i: %d, text: %s" % (i, text)
            if text == self.DOCTYPE:
                return ".JSON-" + ext[1:]

        # not a plist file, 99% likely
        return None

    def run(self, **kwargs):
        v = self.window.active_view()
        path = v.file_name()
        if not os.path.exists(path):
            print "[AAAPackageDev] File does not exists. (%s)" % path
            return
        new_ext = self.get_file_ext(v)
        if new_ext is None:
            print "[AAAPackageDev] Not a valid Property List. (%s)" % path
            return

        self.plist_to_json(path, new_ext, **kwargs)

    def plist_to_json(self, plist_file, new_ext, **kwargs):
        path, fname = os.path.split(plist_file)
        fbase, old_ext = os.path.splitext(fname)
        target = os.path.join(path, fbase + new_ext)

        debug_base = "Error parsing Plist (%s): %s; line (%s) column (%s)"
        file_regex = re.escape(debug_base).replace(r'\%', '%') % (r'(.*?)', r'.*?', r'(\d+)', r'(\d+)')

        # Define default parameters
        json_params = dict(
                           skipkeys=True,
                           check_circular=False,  # there won't be references here
                           indent=4,
                           sort_keys=True
                          )
        json_params.update(kwargs)
        print json_params

        # Handle the output
        if not hasattr(self, 'output_view'):
            # Try not to call get_output_panel until the regexes are assigned
            self.output_view = self.window.get_output_panel("aaa_package_dev")

        # FIXME: Can't get error navigation to work.
        self.output_view.settings().set("result_file_regex", file_regex)
        self.output_view.settings().set("result_base_dir", path)

        # Call get_output_panel a second time after assigning the above
        # settings, so that it'll be picked up as a result buffer
        self.window.get_output_panel("aaa_package_dev")

        with in_one_edit(self.output_view) as edit:
            try:
                pl = plistlib.readPlist(plist_file)
            except xml.parsers.expat.ExpatError, e:
                self.output_view.insert(edit, 0,
                                        debug_base % (plist_file,
                                                      xml.parsers.expat.ErrorString(e.code),
                                                      e.lineno,
                                                      e.offset)
                                        )
            else:
                self.output_view.insert(edit, 0, "Writing json... (%s)" % target)
                try:
                    with open(target, "w") as f:
                        json.dump(pl, f, **json_params)
                except Exception, e:
                    print "[AAAPackageDev] Error writing json: %s" % str(e)

        self.window.run_command("show_panel", {"panel": "output.aaa_package_dev"})
