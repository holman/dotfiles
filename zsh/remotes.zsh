function with-uat-remote(){
    ssh -f -N -T -M -A uat-tunnel
    read TMP_SCHEMA_REGISTRY TMP_ZOOKEEPER_ADDRESS <<< $(echo $SCHEMA_REGISTRY_URL $ZOOKEEPER_ADDRESS);
    SCHEMA_REGISTRY_URL="http://localhost:8081";
    ZOOKEEPER_ADDRESS="localhost:2181";
    setopt aliases;
    $@;
    read SCHEMA_REGISTRY_URL ZOOKEEPER_ADDRESS <<< $(echo $TMP_SCHEMA_REGISTRY $TMP_ZOOKEEPER_ADDRESS);
    ssh -T -O "exit" uat-tunnel;
}

function with-staging-remote(){
    ssh -f -N -T -M -A staging-tunnel
    read TMP_SCHEMA_REGISTRY TMP_ZOOKEEPER_ADDRESS <<< $(echo $SCHEMA_REGISTRY_URL $ZOOKEEPER_ADDRESS);
    SCHEMA_REGISTRY_URL="http://localhost:8081";
    ZOOKEEPER_ADDRESS="localhost:2181";
    setopt aliases;
    $@;
    read SCHEMA_REGISTRY_URL ZOOKEEPER_ADDRESS <<< $(echo $TMP_SCHEMA_REGISTRY $TMP_ZOOKEEPER_ADDRESS);
    ssh -T -O "exit" staging-tunnel;
}

function with-production-remote(){
    ssh -f -N -T -M -A staging-tunnel
    read TMP_SCHEMA_REGISTRY TMP_ZOOKEEPER_ADDRESS <<< $(echo $SCHEMA_REGISTRY_URL $ZOOKEEPER_ADDRESS);
    SCHEMA_REGISTRY_URL="http://localhost:8081";
    ZOOKEEPER_ADDRESS="localhost:2181";
    setopt aliases;
    $@;
    read SCHEMA_REGISTRY_URL ZOOKEEPER_ADDRESS <<< $(echo $TMP_SCHEMA_REGISTRY $TMP_ZOOKEEPER_ADDRESS);
    ssh -T -O "exit" production-tunnel;
}
