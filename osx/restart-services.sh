# Restarts services affected by `./osx/set-defaults.sh`.

# Ask for the administrator password upfront
sudo -v

# Keep-alive: update existing `sudo` time stamp until `restart-services.sh` has finished
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

echo "\nRestarting services affected by \`set-defaults.sh\`. If you are using Terminal.app, it will close when finished. Note that some of the defaults changes still require a logout/restart to take effect."

sleep 5

for app in "Dock" "Finder" "Safari" "SystemUIServer" "Terminal"; do
  killall "$app" > /dev/null 2>&1
done
