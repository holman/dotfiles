#!/bin/sh
#
# This corrects a shitty point of confusion with macOS where if you bounce
# between wireless and wired connections, macOS will suddenly throw up its hands
# and add a random-ass number to your hostname. Do it a couple times and you're
# in like, the thousands appended to your hostname, which makes you look like a
# chump when your machine is called "incredible-programmer-9390028", like
# you're behind 9,390,027 other better programmers before you. Sheesh.
#
# Anyway, this runs in `dot` and only asks for your permission (usually TouchID)
# if it actually needs to change your hostname for you, otherwise it's fast to
# toss into `dot` anyway.
#
# None of this really matters in the big scheme of things, but it bothered me.

hostname=$(scutil --get LocalHostName)

# if hostname contains a hyphen and then a number, remove the hyphen and number
normal_hostname=$(echo "$hostname" | sed 's/-[0-9]*$//')

# if our hostname was changed by macOS, change it back
if [ "$normal_hostname" != "$hostname" ]; then
  echo "Changing hostname from $hostname to $normal_hostname"
  scutil --set LocalHostName "$normal_hostname"
  scutil --set ComputerName "$normal_hostname"
fi
