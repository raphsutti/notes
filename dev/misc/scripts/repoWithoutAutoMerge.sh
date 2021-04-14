#!/bin/bash
# Usage repoWithouAutoMerge [path to repo list]
# Note cookie needed

while read repo; do
	echo "Trying repo: $repo"

	count=$(curl -H 'Cookie: _octo=.......' https://github.com/xx/$repo/settings | grep -A3 merge_types_auto_merge | grep checked | wc -l)
	if [[ $count -eq 0 ]]
	then
		echo
		echo "-->> Repo without auto merge enabled: " $repo
		echo
		echo $repo >> reposWithoutAutomerge
	fi
	
done <$1
