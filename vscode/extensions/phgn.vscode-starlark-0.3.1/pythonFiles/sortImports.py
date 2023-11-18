# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os
import os.path
import sys

isort_path = os.path.join(os.path.dirname(__file__), 'lib', 'python')
sys.path.insert(0, isort_path)

import isort.main
isort.main.main()
