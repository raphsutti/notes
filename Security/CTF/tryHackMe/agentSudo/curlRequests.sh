#!/bin/bash

alphabet=( A B C D E F G H I J K L M N O P Q R S T U V W X Y Z )

for i in ${alphabet[@]}
do
	#echo $i
	echo "Trying user agent $i"
	curl -I -H "User-Agent: $i" 10.10.109.68
done
