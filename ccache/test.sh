#!/bin/zsh -e

echo "Check if ccache is available"
which ccache

echo "Check if ccache is used as a compiler launcher in cmake"
cd $(dirname $0)/test_project/
rm -rf build
cmake -G Ninja -Bbuild -H.
ninja -C build -t commands | grep ccache
