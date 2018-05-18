if [[ -z ~/.aws/credentials ]] then
  echo "AWS Credentials File Not Found"
  return 0
fi

DEFAULT_CREDS=`grep default ~/.aws/credentials -A 2`
key_id=`echo $DEFAULT_CREDS | grep aws_access_key_id | awk '{print $3}'`
access_id=`echo $DEFAULT_CREDS | grep aws_secret_access_key | awk '{print $3}'`
DEFAULT_CREDS=''

export AWS_ACCESS_KEY_ID=$key_id
export AWS_SECRET_ACCESS_KEY=$access_id
