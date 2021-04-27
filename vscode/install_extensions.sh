#!/bin/bash -x

while read -r ext; do
	    code --install-extension $ext --force
done < <(cat ${DOTFILES}/vscode/extension.list)
