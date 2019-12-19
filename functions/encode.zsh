#!/bin/bash

enc(){
  pbpaste | base64 | pbcopy
}

dec(){
  pbpaste | base64 --decode
}
