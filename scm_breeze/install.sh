#!/bin/sh
checkout_path=~/.scm_breeze/

if [ -d "$checkout_path" ]; then
  update_scm_breeze
else
  git clone git://github.com/ndbroadbent/scm_breeze.git $checkout_path
fi
