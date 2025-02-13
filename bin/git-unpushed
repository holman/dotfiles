#!/bin/sh
#
# Show the diff of everything you haven't pushed yet.

branch=$(git rev-parse --abbrev-ref HEAD)
git diff origin/$branch..HEAD
