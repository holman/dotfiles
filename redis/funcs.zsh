
rget-jq(){
  redis-cli mget $1 | jq 
}

rget-keys(){
  redis-cli keys $1 | xargs redis-cli mget
}

rget(){
  redis-cli get $1| jq
}

rkeys(){
  redis-cli keys $1
}