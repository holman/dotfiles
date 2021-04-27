#!/bin/bash


if test "$(uname)" = "Darwin"; then
    /Applications/Docker.app/Contents/MacOS/Docker &
else
    sudo adduser $USER docker
    systemctl start docker
fi
docker login

exit 0
