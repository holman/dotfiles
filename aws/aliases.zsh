# Populate an aws.properties in this directory with the variables used in this script
source "$ZSH/aws/aws.properties"

alias devbox-start='aws ec2 start-instances --instance-ids $AWS_I_ID && sleep 10 && aws ec2 associate-address --instance $AWS_I_ID --public-ip $AWS_IP'
alias devbox-status='aws ec2 describe-instance-status --instance-ids $AWS_I_ID'
alias devbox-stop='aws ec2 stop-instances --instance-ids $AWS_I_ID'
alias devbox-ssh='ssh ${AWS_USER}@${AWS_HOST}'
alias devbox-ssh-sudoer='ssh ${AWS_USER_SUDOER}@${AWS_HOST}'
