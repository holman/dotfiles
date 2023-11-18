from typing import Text
import os
import sys

needs_makedirs: bool

def _makedirs_31(path: Text, exist_ok: bool = ...) -> None: ...

# _makedirs_31 has special behavior to handle an edge case that was removed in
# 3.4.1. No one should be using 3.4 instead of 3.4.1, so this should be fine.
if sys.version_info >= (3,):
    makedirs = os.makedirs
else:
    makedirs = _makedirs_31
