function _useJava() {
   export JAVA_HOME=$(/usr/libexec/java_home -v ${1} -d64)
}
_useJava 1.7
