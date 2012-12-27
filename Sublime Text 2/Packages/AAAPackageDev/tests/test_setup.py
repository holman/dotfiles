import os
import sys

here = os.path.split(__file__)[0]
path_to_lib = os.path.normpath(os.path.join(here, "..", "Lib"))
if not path_to_lib in sys.path:
    sys.path.append(path_to_lib)


# path_to_other = os.path.normpath(os.path.join(here, ".."))
# if not path_to_other in sys.path:
#     sys.path.append(path_to_other)
