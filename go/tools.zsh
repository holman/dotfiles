function go-cyclo-nontest() {
  dir=$1
  count=${2:-10}

  go-cyclo $dir $count | grep -v _test.go
}

function go-cyclo() {
  dir=$1
  count=${2:-10}
  gocyclo -over $count $dir
}



function go-lint() {
  gometalinter \
    --vendor \
    --disable-all \
    --enable=vet \
    --enable=vetshadow \
    --enable=golint \
    --enable=ineffassign \
    --enable=goconst \
    --enable=megacheck \
    --tests \
    $@
}
