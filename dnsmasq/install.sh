#!/bin/sh
tee  $(brew --prefix)/etc/dnsmasq.conf >/dev/null <<EOF
strict-order
address=/.dev/192.168.99.100
EOF

sudo mkdir -p /etc/resolver
sudo tee /etc/resolver/dev >/dev/null <<EOF
nameserver 127.0.0.1
EOF

sudo brew services start dnsmasq
