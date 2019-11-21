# Setting up Hive & Impala ODBC for macOS

## Hive & Impala
1. Download the hive drivers from [cloudera](https://www.cloudera.com/downloads/connectors/hive/odbc/2-6-4.html)
1. Download the impala drivers from [cloudera](https://www.cloudera.com/downloads/connectors/impala/odbc/2-6-8.html)
1. Install the drivers
1. Update `odbcinst.ini` to add

```
[ODBC Drivers]
Cloudera ODBC Driver for Apache Hive = Installed
Cloudera ODBC Driver for Impala      = Installed
...
...
[Cloudera ODBC Driver for Apache Hive]
Driver = /opt/cloudera/hiveodbc/lib/universal/libclouderahiveodbc.dylib

[Cloudera ODBC Driver for Impala]
Driver = /opt/cloudera/impalaodbc/lib/universal/libclouderaimpalaodbc.dylib
```
1. Update `odbc.ini` to add

```
[ODBC Data Sources]
{dsn_name_impala} = [Cloudera ODBC Driver for Impala]
{dsn_name_hive} = [Cloudera ODBC Driver for Apache Hive]
...
...
[{dsn_name_impala}]
Description=Cloudera ODBC Driver for Impala DSN
Driver=/opt/cloudera/impalaodbc/lib/universal/libclouderaimpalaodbc.dylib
HOST={host}
PORT=21050
Schema=Default
UseSASL=0
KrbFQDN={host-fqdn}
KrbRealm={host-realm}
KrbServiceName=impala
SSL=0
KrbAuthType=2
AuthMech=1
TSaslTransportBufSize=1000
RowsFetchedPerBlock=10000
SocketTimeout=300
StringColumnLength=32767
#UseNativeQuery=0

[{dsn_name_hive}]
Description=Cloudera ODBC Driver for Apache Hive DSN
Driver=/opt/cloudera/hiveodbc/lib/universal/libclouderahiveodbc.dylib
HOST={host}
PORT=10000
Schema=default
ServiceDiscoveryMode=0
HiverSErverType=2
AuthMech=1
ThriftTransport=1
KrbHostFQDN={host-fqdn}
KrbServiceName=hive
KrbRealm={host-realm}
SSL=0
```
1. Verify `isql -v {dsn_name}`
