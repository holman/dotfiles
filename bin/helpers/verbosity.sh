#!/usr/bin/env bash
# A flexible verbosity redirection function
# John C. Petrucci (http://johncpetrucci.com)
# 2013-10-19
# Allows your script to accept varying levels of verbosity flags and give appropriate feedback via file descriptors.
# Example usage: ./this [-v[v[v]]]
verbosity=2 #Start counting at 2 so that any increase to this will result in a minimum of file descriptor 3.  You should leave this alone.
maxverbosity=5 #The highest verbosity we use / allow to be displayed.  Feel free to adjust.

while getopts ":v" opt; do
    case $opt in
        v)
            (( verbosity=verbosity+1 ))
            shift
        ;;
    esac
done

for v in $(seq 3 $verbosity) #Start counting from 3 since 1 and 2 are standards (stdout/stderr).
do
    (( "$v" <= "$maxverbosity" )) && eval exec "$v>&2"  #Don't change anything higher than the maximum verbosity allowed.
done

for v in $(seq $(( verbosity+1 )) $maxverbosity ) #From the verbosity level one higher than requested, through the maximum;
do
    (( "$v" > "2" )) && eval exec "$v>/dev/null" #Redirect these to /dev/null, provided that they don't match stdout and stderr.
done

printf "%s %d\n" "Verbosity level set to:" "$verbosity" >&3
