source "$ZSH/mysql/mysql.properties"

function mpurge-older-than7 {
  mysql -u$USER -p$PASSWORD -e "PURGE BINARY LOGS BEFORE DATE_SUB( NOW( ), INTERVAL 7 DAY);"
}

function mrefresh {
  database=$DEFAULT_DB
  dump=$DEFAULT_DMP
  if [[ $1 != "" ]]
  then
  database=$1
  fi

  if [[ $2 != "" ]]
  then
  dump=$2
  fi

  echo "Dropping database, creating, collating '$database'"
  echo "drop database if exists \`$database\`; create database \`$database\`; ALTER DATABASE  \`$database\` DEFAULT CHARACTER SET utf8 COLLATE
   utf8_unicode_ci;" | mysql -u$USER -p$PASSWORD

  case $dump in
    *\.gz )
       echo "Importing sql.gz dump: $dump"
       gunzip -c $dump | mysql -u$USER -p$PASSWORD --default-character-set=utf8 $database
       ;;
    *\.zip )
       echo "Importing zip file: $dump"
       unzip -p $dump | mysql -u$USER -p$PASSWORD --default-character-set=utf8 $database
       ;;
    *\.sql )
       echo "Importing sql dump: $dump"
       mysql -u$USER -p$PASSWORD --default-character-set=utf8 $database < $dump
       ;;
    *\.schema )
       echo "Importing schema file: $dump"
       mysql -u$USER -p$PASSWORD --default-character-set=utf8 $database < $dump
       ;;
    *)
       echo "Importing data from existing mysql db: $dump"
       mysqldump -u$USER -p$PASSWORD -e --add-drop-table --default-character-set=utf8 $dump | mysql -u$USER -p$PASSWORD --default-character-set=utf8 $database
       ;;
  esac
}

function mlist {
  mysql -u$USER -p$PASSWORD -e 'show databases;'
}

function mdrop {
  EXPECTED_ARGS=1
  E_BADARGS=65

  if [ $# -ne $EXPECTED_ARGS ]
  then
    echo "Usage: mdrop database-name"
    return $E_BADARGS
  fi

  database=$1
  echo "drop database if exists \`$database\`;" | mysql -u$USER -p$PASSWORD
}

function mbak {
  db=$1
  date=`date +%Y%m%d`
  file=${db}.${date}.sql.gz
  if [[ $2 != "" ]]
  then
  file = ${2}.sql.gz
  fi

  echo "Backing up MySQL db: $db to file: $file"
  mysqldump -u$USER -p$PASSWORD -e --add-drop-table --default-character-set=utf8 $db | gzip > ${file}
}



function mrefreshtest {
   db=$DEFAULT_TEST_DB
   dump=$DEFAULT_TEST_DMP
   if [[ $1 != "" ]]
   then
   db=$1
   fi
   mysql-refresh $db $dump
}
