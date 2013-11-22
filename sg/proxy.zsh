#PROXY
function proxy() {
 if [ -z "$ALL_PROXY" ]; then
   echo "PROXY ON"
   export http_proxy=http://no-sfd6-websec1.z42.no.tconet.net:80
   export HTTP_PROXY=http://no-sfd6-websec1.z42.no.tconet.net:80
   export https_proxy=http://no-sfd6-websec1.z42.no.tconet.net:80
   export HTTPS_PROXY=http://no-sfd6-websec1.z42.no.tconet.net:80
   export ALL_PROXY=$http_proxy
   echo $ALL_PROXY
 else
   echo "PROXY OFF"
   export http_proxy=
   export HTTP_PROXY=
   export https_proxy=
   export HTTPS_PROXY=
   export ALL_PROXY=
 fi
}
