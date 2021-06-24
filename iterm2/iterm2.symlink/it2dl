#!/bin/bash
if [ $# -lt 1 ]; then
  echo "Usage: $(basename $0) file ..."
  exit 1
fi

function load_version() {
    if [ -z ${IT2DL_BASE64_VERSION+x} ]; then
        export IT2DL_BASE64_VERSION=$(base64 --version 2>&1)
    fi
}

function b64_encode() {
    load_version
    if [[ "$IT2DL_BASE64_VERSION" =~ GNU ]]; then
        # Disable line wrap
        base64 -w0
    else
        base64
    fi
}


for fn in "$@"
do
  if [ -r "$fn" ] ; then
    [ -d "$fn" ] && { echo "$fn is a directory"; continue; }
    printf '\033]1337;File=name=%s;' $(echo -n "$fn" | b64_encode)
    wc -c "$fn" | awk '{printf "size=%d",$1}'
    printf ":"
    base64 < "$fn"
    printf '\a'
  else
    echo File $fn does not exist or is not readable.
  fi
done
