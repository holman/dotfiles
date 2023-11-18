@echo off

set PROTOC=d:\tools\protoc-3.0.0-win32\bin\protoc.exe
set JAVA_OUT=gen\java

rd /S /Q %JAVA_OUT%
md %JAVA_OUT%

%PROTOC%^
  --proto_path=protos\v3^
  --proto_path=protos/v2^
  --java_out=%JAVA_OUT%^
  protos/v3/foo/bar/msg.proto^
  protos/v2/foo/bar/msg_v2.proto^
  protos/v3/*.proto^
  protos/v2/*.proto
