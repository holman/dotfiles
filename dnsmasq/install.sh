#!/bin/sh
tee  $(brew --prefix)/etc/dnsmasq.conf >/dev/null <<EOF
strict-order
address=/.test/192.168.99.100
addess=/.kube/192.168.64.1
listen-address=127.0.0.1,192.168.64.1
EOF

sudo mkdir -p /etc/resolver
sudo tee /etc/resolver/test >/dev/null <<EOF
nameserver 127.0.0.1
EOF

sudo brew services start dnsmasq
