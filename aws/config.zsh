# AWS CLI shortcuts
alias awsp='aws --profile'
alias awsr='aws --region'
alias awsls='aws s3 ls'
alias awscp='aws s3 cp'
alias awssync='aws s3 sync'

# AWS profile management with aws-vault
alias av='aws-vault'
alias avl='aws-vault list'
alias ave='aws-vault exec'
alias avr='aws-vault rotate'
alias ava='aws-vault add'

# AWS services shortcuts
alias ec2='aws ec2'
alias s3='aws s3'
alias iam='aws iam'
alias lambda='aws lambda'
alias ecs='aws ecs'
alias eks='aws eks'
alias rds='aws rds'
alias route53='aws route53'

# AWS EKS helpers
alias eks-update-config='aws eks update-kubeconfig --name'
alias eks-clusters='aws eks list-clusters --output table'

# AWS SSM helpers
alias ssm-start='aws ssm start-session --target'
alias ssm-params='aws ssm describe-parameters'

# AWS CloudFormation shortcuts
alias cf='aws cloudformation'
alias cfls='aws cloudformation list-stacks'
alias cfd='aws cloudformation describe-stacks'

# Quick AWS identity check
alias whoami-aws='aws sts get-caller-identity'