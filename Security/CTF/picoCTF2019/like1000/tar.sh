#!/bin/sh
i=1000
while [[ $i -gt 0 ]] ; do
	echo "untar ${i}"
	tar -xvf "${i}.tar"
	(( i -= 1 ))
done
