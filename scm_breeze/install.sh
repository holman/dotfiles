#!/bin/bash
checkout_path=~/.scm_breeze

if [ -d "$checkout_path" ]; then
  source "${checkout_path}/lib/scm_breeze.sh"
  update_scm_breeze
else
  git clone git://github.com/ndbroadbent/scm_breeze.git $checkout_path
fi
