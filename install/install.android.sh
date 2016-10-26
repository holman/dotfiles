#!/usr/bin/env bash
source ./install/utils.sh

if which android
then
	success "android already installed"
else
	error "could not find android sdk manager"
fi
