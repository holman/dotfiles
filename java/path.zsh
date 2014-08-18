ANT_OPTS=-Xmx2048m
ANT_HOME=$HOME/Dropbox/Dev/Java/ant
MAVEN_OPTS='-Xmx768m -noverify'
M2_HOME=/usr/share/maven
M2=$M2_HOME/bin
J6_HOME=/Library/Java/JavaVirtualMachines/1.6.0_45-b06-451.jdk/Contents/Home
J7_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_67.jdk/Contents/Home
JAVA_HOME=$J7_HOME
JAVA_OPTS=-Xmx512m

export J6_HOME
export J7_HOME
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$ANT_HOME/bin:$PATH"
