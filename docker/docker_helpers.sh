function docker_image_id () {
    docker inspect --type=image --format="{{.Id}}" $1
}

function docker_rmc () {
    for c in $(docker ps --all | grep -e Created -e Exited | awk '{print $1}'); do docker rm $c; done
}

function docker_killc () {
    for c in $(docker ps --all | grep -e Res -e Up | awk '{print $1}'); do docker kill $c; docker rm $c; done
}

function docker_cc () {
    docker_killc
    docker_rmc
}