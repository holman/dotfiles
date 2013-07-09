import sublime
import sublime_plugin

import plistlib
import json

import glob
import os
import sys

# Makes sublime_lib package available for all packages.
if not os.path.join(sublime.packages_path(), "AAAPackageDev/Lib") in sys.path:
    sys.path.append(os.path.join(sublime.packages_path(), "AAAPackageDev/Lib"))

from sublime_lib.path import root_at_packages


DEBUG = 1
THIS_PACKAGE = "AAAPackageDev"

status = sublime.status_message
error = sublime.error_message
join_path = os.path.join
path_exists = os.path.exists

DEFAULT_DIRS = (
            "Snippets",
            "Support",
            "Docs",
            "Macros",
            "bin",
            "data"
            )

# name, default template
DEFAULT_FILES = (
    ("LICENSE.txt", None),
    ("README.rst", root_at_packages(THIS_PACKAGE, "data/README.rst")),
    (".hgignore", root_at_packages(THIS_PACKAGE, "data/hgignore.txt")),
    (".gitignore", root_at_packages(THIS_PACKAGE, "data/gitignore.txt")),
    ("bin/MakeRelease.ps1", root_at_packages(THIS_PACKAGE, "data/MakeRelease.ps1")),
    ("bin/CleanUp.ps1", root_at_packages(THIS_PACKAGE, "data/CleanUp.ps1")),
    ("data/html_template.txt", root_at_packages(THIS_PACKAGE, "data/html_template.txt")),
    ("data/main.css", root_at_packages(THIS_PACKAGE, "data/main.css")),
    ("setup.py", root_at_packages(THIS_PACKAGE, "data/setup.py")),
)


class NewPackageCommand(sublime_plugin.WindowCommand):

    def on_done(self, pkg_name):
        pam = PackageManager()
        if pam.exists(pkg_name):
            error("  NewPackage -- Error\n\n"
                  "  Package '" + pkg_name + "' already exists.\n"
                  "  You cannot overwrite an existing package."
            )
            return

        pam.create_new(pkg_name)

    
    def on_cancel(self):
        status('on_cancel')
    
    def on_changed(self):
        status('on_changed')

    def run(self):
        self.window.show_input_panel(
                            "New Package Name", '', self.on_done, None, None)
                            

class DeletePackageCommand(sublime_plugin.WindowCommand):
    def run(self):
        pam = PackageManager()
        pam.browse()


class PackageManager(object):
    
    def is_installed(self, name):
        raise NotImplemented
    
    def exists(self, name):
        return path_exists(root_at_packages(name))
    
    def browse(self):
        # Let user choose.
        sublime.active_window().run_command("open_dir", 
                                            {"dir": sublime.packages_path()})
    
    def create_new(self, name):
        print "[NewPackage] Creating new package...",
        print root_at_packages(name)
        
        if self.dry_run:
            msg = "[NewPackage] ** Nothing done. This was a test. **"
            print msg
            status(msg)
            return

        # Create top folder, default folders, default files.
        map(os.makedirs, [root_at_packages(name, d) for d in DEFAULT_DIRS])
        
        for f, template in [(root_at_packages(name, fname), template)
                                        for fname, template in DEFAULT_FILES]:
            with open(f, 'w') as fh:
                if template:
                    try:
                        content = "".join(open(template, 'r').readlines()) % \
                                                        {"package_name": name}
                    except:
                        pass
                    finally:
                        content = "".join(open(template, 'r').readlines())

                    fh.write(content)
        
        msg = "[NewPackage] Created new package '%s'." % name
        print msg
        status(msg)
    
    def __init__(self, dry_run=False):
        self.dry_run = dry_run


class PlistToJson(sublime_plugin.TextCommand):
    def is_enabled(self ):
        return self.view.file_name().endswith('.tmLanguage')
        
    def run(self, edit):
        plist_data = plistlib.readPlist(self.view.file_name())
        v = self.view.window().new_file()
        v.insert(edit, 0, json.dumps(plist_data, indent=4))
        v.set_syntax_file('Packages/AAAPackageDev/Support/Sublime JSON Syntax Definition.tmLanguage')
