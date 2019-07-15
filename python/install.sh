#!/bin/sh

# avoid --user https://docs.brew.sh/Homebrew-and-Python
pip3 install -q --upgrade pip;
pip3 install -q --upgrade setuptools;
pip3 install -q flake8;
pip3 install -q black;
