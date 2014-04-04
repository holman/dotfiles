alias svnlines="svn ls -R | egrep -v -e '\/$' | tr '\n' '\0' | xargs -0 svn blame | awk '{print $2}' | sort | uniq -c | sort -nr"

