# Defined in - @ line 1
function grid --description 'alias grid=git rebase -i develop'
	git rebase -i develop $argv;
end
