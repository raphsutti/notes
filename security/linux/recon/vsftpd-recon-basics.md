# VSFTPD recon basics

## Find version

```
nmap -sV 192.211.134.3
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-29 08:40 UTC
Nmap scan report for target-1 (192.211.134.3)
Host is up (0.000015s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
MAC Address: 02:42:C0:D3:86:03 (Unknown)
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.70 seconds
```

## Check if anonymous login allowed

```
nmap --script ftp-anon 192.211.134.3 
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-29 08:42 UTC
Nmap scan report for target-1 (192.211.134.3)
Host is up (0.000014s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
21/tcp open  ftp
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 ftp      ftp            33 Dec 18  2018 flag
|_drwxr-xr-x    2 ftp      ftp          4096 Dec 18  2018 pub
MAC Address: 02:42:C0:D3:86:03 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 0.61 seconds
```

