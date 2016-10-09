
export KAFKA_HOME="$HOME/Applications/confluent-1.0.1"
alias kafka='cd $HOME/Code/kafka-compose/ && docker-compose'
alias kafka-topics='$KAFKA_HOME/bin/kafka-topics --zookeeper localhost:2181'
alias kafka-producer='$KAFKA_HOME/bin/kafka-console-producer --broker-list localhost:9092 --topic'
alias kafka-avro-producer='$KAFKA_HOME/bin/kafka-avro-console-producer --broker-list localhost:9092 --property schema.registry.url=http://$docker-machine ip default):8081 --topic'
alias kafka-avro-consumer='$KAFKA_HOME/bin/kafka-avro-console-consumer --zookeeper localhost:2181 --property print.key=true --property schema.registry.url=http://localhost:8081 --topic'
alias kafka-consumer='$KAFKA_HOME/bin/kafka-console-consumer --zookeeper localhost:2181 --topic'

