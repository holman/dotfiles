alias csc_stage='rdesktop -u Administrator -p $STAGING_PASS -g 1800x1100 54.172.104.247 -5 -K -r clipboard:CLIPBOARD'
alias csc_stage_password='echo "Enter the Stage CSC server password"; read -rs STAGING_PASS ; export STAGING_PASS'

alias csc_prod='rdesktop -u Administrator -p $PROD_PASS -g 1800x1100 -5 -K -r clipboard:CLIPBOARD 54.147.103.239'
alias csc_prod_eu='rdesktop -u Administrator -p $PROD_PASS -g 1800x1100 54.229.198.102 -5 -K -r clipboard:CLIPBOARD'
alias csc_prod_jp='rdesktop -u Administrator -p $PROD_PASS -g 1800x1100 54.199.246.91 -5 -K -r clipboard:CLIPBOARD'
alias csc_prod_password='echo "Enter the Prod CSC server password"; read -rs PROD_PASS ; export PROD_PASS'

alias k8s_aws='aws --profile kops'
