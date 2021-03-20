#!/usr/bin/expect -f
spawn socat - TCP:192.163.229.3:2023
expect "root@victim-1:~# "
send "ls -l\r"
expect "root@victim-1:~# "
send "cat flag\r"
expect "root@victim-1:~# "
send "exit\r"
