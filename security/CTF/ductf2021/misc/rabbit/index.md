# rabbit

- **Category:** Scripting

## Challenge

Can you find Babushka's missing vodka? It's buried pretty deep, like 1000 steps, deep.

Author: Crem + z3kxTa

[file](./flag.txt)

## Solution

Create a bash script to decompress file based on the file type

```bash
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
```

Final file content is a base64 encoded string

```
echo "RFVDVEZ7YmFidXNoa2FzX3YwZGthX3dhc19oM3IzfQ==" | base64 -d
DUCTF{babushkas_v0dka_was_h3r3}%
```

Flag

```
DUCTF{babushkas_v0dka_was_h3r3}
```
