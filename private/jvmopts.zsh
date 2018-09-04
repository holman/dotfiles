OPTS="-Djavax.net.ssl.keyStore=/Users/jonesc113/certs/dev.p12
-Djavax.net.ssl.keyStorePassword=certificate
-Djavax.net.ssl.keyStoreType=PKCS12
-Dmaven.wagon.http.ssl.insecure=true
-Dmaven.wagon.http.ssl.allowall=true
-Djsse.enableSNIExtension=false
-Djavax.net.ssl.trustStore=/Users/jonesc113/certs/jssecacerts
-Djavax.net.ssl.trustStorePassword=changeit
-Djavax.net.ssl.trustStoreType=JKS
-Xms512m -Xmx512m
-XX:MaxPermSize=512m"

export JAVA_OPTS=$OPTS
