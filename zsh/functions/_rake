#compdef rake
if [ -f Rakefile ]; then
  recent=`last_modified .rake_tasks~ Rakefile **/*.rake`
  if [[ $recent != '.rake_tasks~' ]]; then
    rake --silent --tasks | cut -d " " -f 2 > .rake_tasks~
  fi
  compadd `cat .rake_tasks~`
fi
