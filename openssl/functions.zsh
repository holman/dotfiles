# useful openSSL functions (if openssl present)
if (( ! $+commands[openssl] ))
then
 return 0;
fi

# download SSL certificate from server
function g_cert() {

  [[ $# -ne 2 ]]; echo "\n$0 HOSTNAME|IP-ADDR PORT" && return 1;

  openssl s_client -connect $1:$2 > $1.pem < /dev/null

}

# view PEM SSL certificate
function v_cert() {

  [[ $# -ne 1 ]] && echo "\n$0 FILENAME" && return 1;

  openssl s_client -noout -text -in $1

}

# show server SSL certificate chain
function s_certs() {

  [[ $# -ne 2 ]]; echo "\n$0 HOSTNAME|IP-ADDR PORT" && return 1;

  openssl s_client -showcerts -connect $1:$2 < /dev/null

}
