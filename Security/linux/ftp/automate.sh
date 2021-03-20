#!/usr/bin/expect -f
# Used to access ftp server pentestingacademy - Interaction: FTP Service 
set verbose_flag 1
spawn ftp 192.222.100.3
expect "Name "
send "billy\r"
expect "Password:"
send "carlos\r"
expect "ftp>"
send "prompt\r"
expect "ftp>"
send "ls\r"
expect "ftp>"
send "get flag\r"
expect "ftp>"
send "bye\r"
expect eof
