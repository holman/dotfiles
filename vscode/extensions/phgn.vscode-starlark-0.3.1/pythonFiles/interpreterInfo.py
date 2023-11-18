# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import json
import sys

obj = {}
obj["versionInfo"] = sys.version_info[:4]
obj["sysPrefix"] = sys.prefix
obj["version"] = sys.version
obj["is64Bit"] = sys.maxsize > 2**32

print(json.dumps(obj))
