# Defined in - @ line 1
function grim --description 'alias grim=git rebase -i master'
	git rebase -i master $argv;
end
