#!/bin/sh
#
# Delete all local branches that have been merged into HEAD. Stolen from
# our favorite @tekkub:
#
#   https://plus.google.com/115587336092124934674/posts/dXsagsvLakJ

git branch -d `git branch --merged | grep -v '^*' | grep -v 'master' | tr -d '\n'`
