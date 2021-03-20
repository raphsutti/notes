cat /etc/passwd
tac /etc/passwd # reverses

ps -ef | tee file1 file2 # display and copies output to files

> deleteContent.txt # empties content of file

history # show command history. Any commands with <space> in front wont be recorded

python -m SimpleHTTPServer 80 # starts HTTP server on port 80

md5sum /bin/bash # generate hash of a file
sha1sum /bin/bash

file /bin/bash # info of a file
file /etc/passwd
