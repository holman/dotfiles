# Setting up Teradata ODBC for macOS

1. Download ODBC drivers from [teradata](https://downloads.teradata.com/download/connectivity/teradata-odbc-driver-for-mac-os-x)
1. Install the drivers
1. Update `odbcinst.ini` to add
```
[ODBC Drivers]
Teradata Database ODBC Driver 16.20 = Installed
...
...
[Teradata Database ODBC Driver 16.20]
Driver = /Library/Application Support/teradata/client/16.20/lib/tdataodbc_sbu.dylib
Setup  = /Library/Application Support/teradata/client/16.20/lib/TeradataODBCSetup.bundle/Contents/MacOS/TeradataODBCSetup
```
1. Update `odbc.ini` to add
```
[ODBC Data Sources]
{dsn_name} = [Teradata Database ODBC Driver 16.20]
...
...
[{dsn_name}]
Description=Teradata Database
Driver=/Library/Application Support/teradata/client/ODBC/lib/tdataodbc_sbu.dylib
# Required Values that can be specified in connection string
DBCName={host}
UID={user_name}
PWD={password}
#Optional Values
DefaultDatabase={default_database}
CharacterSet=UTF8
TdmstPortNumber=1025
LoginTimeout=120
MaxRespSize=65536
MaxSingleLOBBytes=4000
MaxTotalLOBBytesPerRow=65536
```
1. Verify `isql -v {dsn_name}`
