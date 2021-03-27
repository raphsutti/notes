#!/bin/bash

for ip in {1..254};
do for port in {22,80,443,3306,3389};
  do (echo >/dev/tcp/10.10.10.$ip/$port) &> /dev/null && echo "10.10.10.$ip:$port is open";
  done;
done
