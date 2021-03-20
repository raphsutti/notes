#!/bin/bash
# Usage: ./bucketFinder.sh [url] [path to wordlist]
# Eg. ./bucketFinder.sh 192.17.236.3:9000 /usr/share/dirb/wordlists/small.txt

while read F ; do
  count=$(curl $1/$F -s | grep -E "NoSuchBucket|InvalidBucketName"|wc -l)
  if [[ $count -eq 0 ]]
  then
    echo "Bucket Found :"$F
  fi
done < $2
