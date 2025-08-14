# Terraform aliases and shortcuts
alias tf='terraform'
alias tfi='terraform init'
alias tfp='terraform plan'
alias tfa='terraform apply'
alias tfd='terraform destroy'
alias tfs='terraform show'
alias tfv='terraform validate'
alias tff='terraform fmt'
alias tfw='terraform workspace'
alias tfo='terraform output'
alias tfr='terraform refresh'

# Terraform with auto-approve (use with caution)
alias tfaa='terraform apply -auto-approve'
alias tfda='terraform destroy -auto-approve'

# Terragrunt shortcuts
alias tg='terragrunt'
alias tgi='terragrunt init'
alias tgp='terragrunt plan'
alias tga='terragrunt apply'
alias tgd='terragrunt destroy'
alias tgaa='terragrunt apply -auto-approve'
alias tgda='terragrunt destroy -auto-approve'

# Terraform workspace management
alias tfwl='terraform workspace list'
alias tfws='terraform workspace select'
alias tfwn='terraform workspace new'

# Terraform state management
alias tfsl='terraform state list'
alias tfss='terraform state show'
alias tfsm='terraform state mv'
alias tfsr='terraform state rm'

# Security and linting
alias tfsec='tfsec'
alias tflint='tflint'
alias tfcost='infracost'

# Terraform documentation
alias tfdocs='terraform-docs'