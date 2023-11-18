#!/bin/sh

PROTOC=$HOME/tools/protoc-3.0.0-osx-x86_64/bin/protoc 
JAVA_OUT=gen/java

rm -rf $JAVA_OUT
mkdir -p $JAVA_OUT

$PROTOC \
  --proto_path=protos/v3 \
  --proto_path=protos/v2 \
  --java_out=$JAVA_OUT \
  protos/v3/foo/bar/msg.proto \
  protos/v2/foo/bar/msg_v2.proto \
  protos/v3/*.proto \
  protos/v2/*.proto
