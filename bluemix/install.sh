# Setup CloudFoundry CLI
cf add-plugin-repo Bluemix-Garage http://garage-cf-plugins.eu-gb.mybluemix.net/
cf add-plugin-repo Bluemix https://plugins.ng.bluemix.net

rm -rf "$HOME/.cf/plugins"
cf install-plugin -r CF-Community sync -f
cf install-plugin -r CF-Community cflocal -f
cf install-plugin -r CF-Community do-all -f
cf install-plugin -r CF-Community route-lookup -f
cf install-plugin -r CF-Community manifest-generator -f
cf install-plugin -r CF-Community "Copy Env" -f
cf install-plugin -r CF-Community "Cloud Deployment Plugin" -f
cf install-plugin -r CF-Community Console -f
cf install-plugin -r Bluemix-Garage mad -f
cf install-plugin -r Bluemix dev-mode -f

# Bluemix CLI setup
rm -rf "$HOME/.bluemix/plugins"
bx plugin install -r Bluemix active-deploy
bx plugin install -r Bluemix auto-scaling
bx plugin install -r Bluemix vpn
bx plugin install -r Bluemix private-network-peering
bx plugin install -r Bluemix IBM-Containers
bx plugin install -r Bluemix container-registry
bx plugin install -r Bluemix container-service
