# LFI

nmap

```
> nmap -sV -sC -oN nmap/initial 10.10.236.141
Starting Nmap 7.91 ( https://nmap.org ) at 2021-12-12 20:48 AEDT
Nmap scan report for 10.10.236.141
Host is up (0.27s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 b1:eb:7a:38:3f:29:78:34:ac:d4:b7:07:95:f5:49:92 (RSA)
|   256 7f:f5:10:01:ee:dd:ac:eb:6e:f0:9b:6c:d8:b3:4c:61 (ECDSA)
|_  256 62:b0:db:df:a2:8a:50:53:c9:59:82:14:a0:35:60:cc (ED25519)
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
Nmap done: 1 IP address (1 host up) scanned in 52.33 seconds
```
