param([switch]$DontUpload=$False)

$here = $MyInvocation.MyCommand.Definition
$here = split-path $here -parent
$root = resolve-path (join-path $here "..")

push-location $root
	if (-not (test-path (join-path $root "Doc"))) {
		new-item -itemtype "d" -name "Doc" > $null
		copy-item ".\Data\main.css" ".\Doc"
	}

	# Generate docs in html from rst.
	push-location ".\Doc"
		get-childitem "..\*.rst" | foreach-object {
									& "rst2html.py" `
											"--template" "..\data\html_template.txt" `
											"--stylesheet-path" "main.css" `
											"--link-stylesheet" `
											$_.fullname "$($_.basename).html"
								}
	pop-location

	# Ensure MANIFEST reflects all changes to file system.
	remove-item ".\MANIFEST" -erroraction silentlycontinue
	& "python" ".\setup.py" "spa"

	(get-item ".\dist\AAAPackageDev.sublime-package").fullname | clip.exe
pop-location

if (-not $DontUpload) {
	start-process "https://bitbucket.org/guillermooo/aaapackagedev/downloads"
}