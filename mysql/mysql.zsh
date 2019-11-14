function m {
  $(mysql_login)
}

function mysql_login {
  echo mysql $(mlogin)
}

function mlogin {
 # Defined in ~/.env-vars like: MYSQL_LOGIN="-u$MYSQL_USER -pMYSQL_PASSWORD"
 echo $MYSQL_LOGIN
}

function mpurge-older-than7 {
  $(mysql_login) -e "PURGE BINARY LOGS BEFORE DATE_SUB( NOW( ), INTERVAL 7 DAY);"
}

function msw {
  sed -i '' "s|jdbc:mysql://localhost:3306/[^\?]*|jdbc:mysql://localhost:3306/${1}|g" $TOMCAT_CONF_FILE
}

function mcurrent {
 grep -o -E 'jdbc:mysql://localhost:3306/.*?\?' $TOMCAT_CONF_FILE
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
   utf8_unicode_ci;" | $(mysql_login) 

  case $dump in
    *\.gz )
       echo "Importing sql.gz dump: $dump"
       gunzip -c $dump | $(mysql_login) --default-character-set=utf8 $database
       ;;
    *\.zip )
       echo "Importing zip file: $dump"
       unzip -p $dump | $(mysql_login)--default-character-set=utf8 $database
       ;;
    *\.sql )
       echo "Importing sql dump: $dump"
       $(mysql_login) --default-character-set=utf8 $database < $dump
       ;;
    *\.schema )
       echo "Importing schema file: $dump"
       $(mysql_login) --default-character-set=utf8 $database < $dump
       ;;
    *)
       echo "Importing data from existing mysql db: $dump"
       mysqldump $(mlogin) -e --add-drop-table --default-character-set=utf8 $dump | $(mysql_login) --default-character-set=utf8 $database
       ;;
  esac
}

function mlist {
  $(mysql_login) -e 'show databases;'
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
  echo "drop database if exists \`$database\`;" | $(mysql_login)
}

function mbak {
  db=$1
  date=`date +%Y%m%d`
  file=${db}.${date}.sql.gz
  if [[ $2 != "" ]]
  then
  file="${2}.sql.gz"
  fi

  echo "Backing up MySQL db: $db to file: $file with creds: $(mysql_login)"
  mysqldump $(mlogin) -e --add-drop-table --default-character-set=utf8 $db | gzip > ${file}
}

function mrefreshtest {
   db=$DEFAULT_TEST_DB
   dump=$DEFAULT_TEST_DMP
   if [[ $1 != "" ]]
   then
   db=$1
   fi
   mrefresh $db $dump
}
