#!/bin/bash -ex

cd $(mktemp -d)

clang++ -std=c++17 -O0 -g3 -o mytest ${DOTS}/clangd/mytest.cpp
gdb -x ${DOTS}/clangd/test.gdb mytest &> test.log
grep -F 'std::unordered_map with 1 element = {[2] = "mystuff"}' test.log
