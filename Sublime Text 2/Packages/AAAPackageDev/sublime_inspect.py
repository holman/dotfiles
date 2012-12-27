import sublime, sublime_plugin

import sublime_lib

import os
import json


class SublimeInspect(sublime_plugin.WindowCommand):
    def on_done(self, s):
        rep = Report(s)
        rep.show()        

    def run(self):
        self.window.show_input_panel("Search String:", '', self.on_done, None, None)


class Report(object):
    def __init__(self, s):
        self.s = s

    def collect_info(self):
        try:
            atts = dir(eval(self.s, {"sublime": sublime, "sublime_plugin": sublime_plugin}))
        except NameError, e:
            atts = e
        
        self.data = atts

    def show(self):
        self.collect_info()
        v = sublime.active_window().new_file()
        v.insert(v.begin_edit(), 0, '\n'.join(self.data))
        v.set_scratch(True)
        v.set_name("SublimeInspect - Report")


class OpenSublimeSessionCommand(sublime_plugin.WindowCommand):
    def run(self):
        session_file = os.path.join(sublime.packages_path(), "..", "Settings", "Session.sublime_session")
        self.window.open_file(session_file)


def to_json_type(v):
    """"Convert string value to proper JSON type.
    """
    try:
        if v.lower() in ("false", "true"):
            v = (True if v.lower() == "true" else False)
        elif v.isdigit():
            v = int(v)
        elif v.replace(".", "").isdigit():
            v = float(v)
    except AttributeError:
        raise ValueError("Conversion to JSON failed for: %s" % v)

    return v
