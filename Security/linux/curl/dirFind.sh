#!/bin/bash
#Usage ./dirFind.sh <ip> <wordlist>

while read dir_name; do
  echo "Trying directory: $dir_name"
  curl http://$1$dir_name
done <$2
