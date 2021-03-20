#!/bin/bash
# Usage: ./bucketKeyFinder.sh [url] [path to wordlist]
# Eg. ./bucketKeyFinder.sh 192.137.54.3:9000 /usr/share/dirb/wordlists/small.txt

while read F ; do
  count=$(curl $1/$F -s | grep "The specified key does not exist"|wc -l)
  if [[ $count -eq 0 ]]
  then
    echo "Bucket Found :"$F
  fi
done < $2
