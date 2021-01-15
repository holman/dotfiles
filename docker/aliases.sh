alias drm="docker rm `docker ps -a | grep 'Exited' | awk '{print $1}'`"
alias drmi="docker rmi `docker images | grep '^<none>' | awk '{print $3}'`"
