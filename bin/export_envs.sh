#!/bin/bash
projects=('ashley','vanessa' 'Scarlett' 'Jenna')
for project in "${projects[@]}"
do
    if [ $# -eq 0 ]; then
        dir=$HOME/Desktop/envs
        if [ ! -d "$dir" ]; then
            mkdir $HOME/Desktop/envs
        fi
        cp -f $HOME/Development/Projects/$project/src/.env $HOME/Desktop/envs/$project.env
    else
        for dir in "$@"
        dir=$dir/envs/
        do
            cp -f $HOME/Development/Projects/$project/src/.env $dir
        done
    fi
done
