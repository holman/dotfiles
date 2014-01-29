#!/bin/sh

if test ! $(which gradle)
then
  echo "  Installing gradle for you."
  brew install gradle > /tmp/gradle-install.log
  #wget http://services.gradle.org/distributions/gradle-1.10-bin.zip -O /tmp/gradle.zip; rm -rf /opt/gradle/; mkdir -p /opt/gradle/current/; unzip /tmp/gradle.zip -d /opt/current;rm /tmp/gradle.zip
  ln -s $PWD/find-gradle /usr/local/bin/gw
fi
