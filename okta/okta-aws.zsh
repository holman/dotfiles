#OktaAWSCLI
function okta-aws {
    withokta "aws --profile $1" "$@"
}
function okta-sls {
    withokta "sls --stage $1" "$@"
}
