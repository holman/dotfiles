#AWSume alias to source the AWSume script
alias awsume=". awsume"
fpath=(/usr/local/share/zsh/site-functions $fpath)
aws-env () {
    source awsume $1;
}
