#!/bin/sh
tee  $(brew --prefix)/etc/dnsmasq.conf >/dev/null <<EOF
strict-order
address=/.test/10.254.254.254
addess=/.kube/10.254.254.254
listen-address=127.0.0.1,192.168.64.1
EOF

sudo mkdir -p /etc/resolver
sudo tee /etc/resolver/test >/dev/null <<EOF
nameserver 127.0.0.1
EOF

sudo brew services start dnsmasq
