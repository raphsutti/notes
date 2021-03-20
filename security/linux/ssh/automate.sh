#!/usr/bin/expect -f
spawn ssh student@192.129.96.3
expect "password: "
send "student\r"
expect "$ "
send "ls -l\r"
expect "$ "
send "cat flag\r"
expect "$ "
send "exit\r"
