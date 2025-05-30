# SDKMAN configuration
JAVA_VERSION="17.0.7-amzn"
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]] && source "$SDKMAN_DIR/bin/sdkman-init.sh"
export JAVA_HOME="$(sdk home java $JAVA_VERSION)"
