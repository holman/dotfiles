#compdef cap
if [ -f Capfile ]; then
  recent=`last_modified .cap_tasks~ Capfile **/deploy.rb`
  if [[ $recent != '.cap_tasks~' ]]; then
    cap --tasks | grep '#' | cut -d " " -f 2 > .cap_tasks~
  fi
  compadd `cat .cap_tasks~`
fi
