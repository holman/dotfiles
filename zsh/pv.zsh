pv() {
  cat package.json \
  | grep \"$1\" \
  | awk -F: '{ print $2}' \
  | sed 's/[",]//g'
}
