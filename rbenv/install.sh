#!/bin/sh
#
# rbenv
#
# This installs some of the common dependencies needed (or at least desired)
# using rbenv.

# Check for rbenv
if test $(which rbenv) && test -a "$(dirname $0)/enabled"
then
  echo "  Installing rbenv for you."
  git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
fi

exit 0
