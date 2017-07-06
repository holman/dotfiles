function wop {
  lsof -n -i4TCP:$1 | grep LISTEN
}
function kop {
  lsof -n -i4TCP:$1 | grep LISTEN | awk '{print $2}' | uniq | xargs kill -9
}
