# Nmap

## Intro

- Network mapping
- See what services are running
- network service = port
- ports used for multiple services
- Computer creates high numbered port at random for communications

![nmap](./nmap.png)

- 65535 ports
- Eg. default ports 80 = web, 443 = https, 139 = NETBIOS, 445 = SMB
- 1024 well known ports 0-1023

## Switches

- `-sS` - syn scan
- `-sU` - UDP scan
- `-O` - detect operating system
- `-sV` - detect versions of services running
- `-v` - verbose
- `-vv` - highly verbose
- `-oA` - save output in 3 major formats
- `-oN` - save output in normal format
- `-oG` - save output in grepable format
- `-A` - aggressive mode. Activates service detection, operating system detection, a traceroute and common script scanning.
- `-T5` - increase speed of scan, higher = noisier
- `-p 80` - port 80
- `-p 1000-1500` - port 1000-1500
- `-p-` - all ports
- `--script` - activate nmap scripting library
- `--script=vuln` - activate nmap scripting in the vuln category

## Scan types
