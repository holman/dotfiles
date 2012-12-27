import sublime

import os
import sys

# Makes sublime_lib package available for all packages.
if not os.path.join(sublime.packages_path(), "AAAPackageDev/Lib") in sys.path:
    sys.path.append(os.path.join(sublime.packages_path(), "AAAPackageDev/Lib"))
    print "[AAAPackageDev] Added sublime_lib to sys.path."
