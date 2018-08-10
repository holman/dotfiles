#!/bin/bash
brew link --overwrite gnupg

chown -R $(whoami) ~/.gnupg/
chmod 700 ~/.gnupg
chmod 600 ~/.gnupg/*
