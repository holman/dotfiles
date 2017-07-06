function js2c {
  for FILE in `find . -name "*.js" -type f -o -path './node_modules' -prune -o -path './components' -prune`
  do
    echo $FILE
      if [ -e $FILE ] ; then
          COFFEE=${FILE//.js/.coffee}
          echo "converting ${FILE} to ${COFFEE}"
          js2coffee "$FILE" > "$COFFEE"
          rm $FILE
      else
          echo "File: {$1} does not exist!"
      fi
  done
}
