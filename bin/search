#!/bin/sh
#
# Quick search in a directory for a string ($1).
#
set -e

# use -iru to search directories ack usually ignores (like .git)
if [ -x /usr/bin/ack-grep ]; then
    ack-grep -i $1
else
    ack -i $1
fi
