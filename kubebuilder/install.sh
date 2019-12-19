os=$(go env GOOS)
arch=$(go env GOARCH)

curl -sL https://go.kubebuilder.io/dl/2.0.1/${os}/${arch} | tar -xz -C /tmp/
sudo mv /tmp/kubebuilder_2.0.1_${os}_${arch} /usr/local/kubebuilder
