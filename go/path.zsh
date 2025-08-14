# Go environment setup - maintain existing GOPATH structure
export GOPATH=~/Code
export GOBIN=$GOPATH/bin
export GOROOT="$(brew --prefix golang)/libexec"
export PATH="$PATH:${GOPATH}/bin:${GOROOT}/bin"

# Go module proxy for faster downloads
export GOPROXY=direct
export GOSUMDB=sum.golang.org

# Enable Go modules
export GO111MODULE=on