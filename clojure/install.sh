
if [[ -d ~/Applications/confluent-1.0 ]]
then
  exit 0
fi

echo "Installing Confluent 1.0 tools"
mkdir -p ~/Applications
cd ~/Applications
wget http://packages.confluent.io/archive/1.0/confluent-1.0-2.10.4.zip
unzip ~/Applications/confluent-1.0-2.10.4.zip
rm ~/Applications/confluent-1.0-2.10.4.zip
