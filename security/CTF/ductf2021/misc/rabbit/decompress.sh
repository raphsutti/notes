#!/bin/bash

i=0
done=0

while [ $done -eq 0 ]
do for file in $(file * | awk '{print $1$2}');
do 
	((i++))
	echo Iteration: $i
	fileName=$(echo $file | cut -d ":" -f1)
	extension=$(echo $file | cut -d ":" -f2)

	if [ "$extension" == "bzip2" ]; then
		echo "decompressing bzip2 $fileName"
		fullFileName="$fileName.bz2"
		mv $fileName $fullFileName
		bzip2 -d $fullFileName

	elif [ "$extension" == "Zip" ]; then
		echo "decompressing zipped $fileName"
		fullFileName="$fileName.zip"
		mv $fileName $fullFileName
		unzip -o "$fullFileName"
		rm $fullFileName

	elif [ "$extension" == "XZ" ]; then
		echo "decompressing XZ file $fileName"
		fullFileName="$fileName.xz"
		mv $fileName $fullFileName
		unxz "$fullFileName"

	elif [ "$extension" == "gzip" ]; then
		echo "decompressing gzip file $fileName"
		fullFileName="$fileName.gz"
		mv $fileName $fullFileName
		gunzip "$fullFileName"

	elif [ "$extension" == "ASCII" ]; then
		echo "Finished decompressing ^__^"
		done=1

	fi

done
done	
