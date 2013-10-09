#!/bin/bash
#
# svn_my_commits_here.sh
#
# Find all my commits _ever_ in this level of the repository (and below).

repo_url=`svn info | sed -n 's/^URL: *//p'`
# Multiple usernames can be given, separated by \|
username='akrawiec'

for revision in `svn log -q $repo_url | sed -n "s/r\([0-9]*\) | \($username\) |.*/\1/p"`
do 
    svn log -vr $revision $repo_url
done
