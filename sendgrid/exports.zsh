export BOOTSTRAP_SCRIPT_DIR=/Users/cnixon/Code/src/github.com/sendgrid/sg-workstation/scripts


s3mime () {
	dir="/tmp"
	local s3url=$1
	local env=$(echo "$1" | cut -d '/' -f 3 | cut -d '-' -f 3)
	local filename=$(echo "$1" | cut -d '/' -f 4)
	if [[ "$env" == "staging" ]]; then
			if aws-okta exec pre_prod_eng_coreplatform -- aws s3 cp "$s3url" "$dir/$filename"; then
					code "$dir/$filename"
			else
					echo "Failed to download or open file."
			fi
	else 
			if aws-okta exec prod_eng_coreplatform -- aws s3 cp "$s3url" "$dir/$filename"; then
					code "$dir/$filename"
			else
					echo "Failed to download or open file."
			fi
	fi
}

# Need for cgo bindings in mxd
export LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib"
export CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include"
export CGO_LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib"
export CGO_CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include"