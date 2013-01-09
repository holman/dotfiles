#!/usr/bin/env bash
#
# spark
# https://github.com/holman/spark
#
# Generates sparklines for a set of data.
#
# Here's a a good web-based sparkline generator that was a bit of inspiration
# for spark:
#
#   https://datacollective.org/sparkblocks
#
# spark takes a comma-separated list of data and then prints a sparkline out of
# it.
#
# Examples:
#
#   spark 1 5 22 13 53
#   # => ▁▁▃▂▇
#
#   spark 0 30 55 80 33 150
#   # => ▁▂▃▅▂▇
#
#   spark -h
#   # => Prints the spark help text.

# Generates sparklines.
#
# $1 - The data we'd like to graph.
spark()
{
  local n numbers=

  # find min/max values
  local min=0xffffffff max=0

  for n in ${@//,/ }
  do
    # on Linux (or with bash4) we could use `printf %.0f $n` here to
    # round the number but that doesn't work on OS X (bash3) nor does
    # `awk '{printf "%.0f",$1}' <<< $n` work, so just cut it off
    n=${n%.*}
    (( n < min )) && min=$n
    (( n > max )) && max=$n
    numbers=$numbers${numbers:+ }$n
  done

  # print ticks
  local ticks=(▁ ▂ ▃ ▄ ▅ ▆ ▇ █)

  local f=$(( (($max-$min)<<8)/(${#ticks[@]}-1) ))
  (( f < 1 )) && f=1

  for n in $numbers
  do
    echo -n ${ticks[$(( ((($n-$min)<<8)/$f) ))]}
  done
  echo
}

# If we're being sourced, don't worry about such things
if [ "$BASH_SOURCE" == "$0" ]; then
  # Prints the help text for spark.
  help()
  {
    cat <<EOF

    USAGE:
      spark [-h] VALUE,...

    EXAMPLES:
      spark 1 5 22 13 53
      ▁▁▃▂█
      spark 0,30,55,80,33,150
      ▁▂▃▄▂█
      echo 9 13 5 17 1 | spark
      ▄▆▂█▁
EOF
  }

  # show help for no arguments if stdin is a terminal
  if { [ -z "$1" ] && [ -t 0 ] ; } || [ "$1" == '-h' ]
  then
    help
    exit 0
  fi

  spark ${@:-`cat`}
fi
