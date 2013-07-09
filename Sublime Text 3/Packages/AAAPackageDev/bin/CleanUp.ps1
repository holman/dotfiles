$here = $MyInvocation.MyCommand.Definition
$here = split-path $here -parent
$root = resolve-path (join-path $here "..")

push-location $root
	# remove-item cmdlet doesn't work well!
	get-childitem "." -recurse -filter "*.pyc" | remove-item
	remove-item "dist" -recurse -force
	remove-item "Doc" -recurse
	remove-item "MANIFEST"
pop-location