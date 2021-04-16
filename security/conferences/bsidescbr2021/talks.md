# Talks short notes

## Mike Burgess Keynote - Director-General of Security ASIO

Chose to written notes rather than ipad 😂

Greatest threats

Espionage, terrorism

## Christopher Vella - Easy LPEs and common software vulnerabilities

Bad assumption. Logic vulns - assumed file paths are fixed but could be symlinked eg. system32

```
hFile -
  CreateFile(
      "c:\\ProgramData\\MyFolder\\file1.txt"
  ); 
WriteFile(hFile, "test");
```

`C:\Folder1\Folder2\File1.txt`

`C:` - symlink
`Folder1` - Possible junctions
`File1.txt` - Possible hardlink

Common attack surfaces
- COM
- RPC
- Shared memory
- Named pipes
- File IO

Many `junction` vuln can be found in zdi.
Common vulns in AVs

`Process hacker` - look at running processes
`Process monitor` - capture process activity

`Zoom` case study
- Digital signature
- msi run privilege as `NT AUTHORITY/System`
- Running at specific folder which it cant find
- Create a folder to match
- msi access it and delete
- Can file redirection and arbitrary delete file for privesc
- chocolatey package manager exists
- We can delete the chocolatey folder `programdata/chocolatey` and create our own one to run our own binaries
- Find system process that will try load something from this directory and replace it with our own binary
- Got privesc code exec

`Foxit` PDF reader case study
- Heavily fuzzed - memory corruption found daily on zdi
- Open process monitor
- Constantly trying to find `FoxitData.txt`
- Once parse file, the file is deleted
- Check what it is expecting from the file
- Found user shell execute.. 
- Got code execution

`PuppetLabs` case study
- Coding error caused a file to be opened in C drive. Not intended
- Open process monitor
- found `name not found` error on `syslog.so`
- Copy dll to that location
- Proc mon shows it loads the file as dll
- DLL ran as system

`VMWare workstation`
- As a user can modify and repair VMWare workstation - this process runs as system
- Proc mon to capture
- Found VMWare creates a tmp folder with 7 letters but folder has ACL and cannot create
- Can potentially create all the folders in that combination before hand
- Find `vmware-hostd-ticket` removes file, use this as elevated delete execution

## Iggy - Catching criminals in 16 bytes

Recover deleted photo from a camera

Solved a cold case murder

## Silvio - IoT exploit

Lots of money for 0day findings $5k+

Main router vendors: Netgear, D-Link, TP-Link, ASUS, Tenda

Process
- Get the software (firmware acquisition)
- Exploit

Firware acquisition
- Hardware level (NAND/Flash dumping, UARTm)
- HTTP firmware requrest MITM
- Vendor supplied public download

Non-destructive UART
- Interrupt boot loader
- If dropped in shell, copy to removable media

Non-destructive JTAG
- Access device interface
- Flash dump
- BUSSide
- Non-destructive Flash Dump
  - Without desoldering

Destructive chip-off dump

HTTP Person in the middle
- first boot, get firmware
- Set up SSID for IoT targets
- VLAN routed to pfsense
- Squid HTTP proxies and logs 

Vulnerability research

Approaches
- Code review
- Fuzzing / dynamic analysis
- Static analysis

Pwn2own 2020
- TP-link router
- Netgear Nighthawk R7800
- DLink

Trigger the bug and make it crash

Features = more technology, more attack surface

Increase technology into our lives. Maybe vendors will turn and go with less attack surface

## Sebastian Salla - Bypassing email spam / malware filters

Phishing history

- 1996 AO Hell
- 2003 web and email
- 2005 $3B losses
- 2009 Bitcoin - local currency, anonymity
- 2013 Cryptolocker
- 2017 HTTPS phishing, secure of client to malicious server
- 2018 Stego malware
- 2019 Vendor mail compromise

Bounce attack
- ensure delivery of phish
- Non delivery report - when failed
- Find user that doesnt exist
- Default delivery report have untampered headers
- See spam malware engine versions, spam filter rules etc

Direct mail attack
- Checks DNS record for existence of O365 account
- Abuses trust with cloud native infra
- Wont work on on prem

Direct mail bounce attack
- Hard code exchange server
- Get non delivery report - no email found = direct mail attack possible

https://caniphish.com/Public/SupplyChain

## Alex - Finding Tony Abbott's passport number

## Eldar - Defenders new clothes

Emperor got swindled in invisible robe

We trust in all these security solutions

## Sam - Oh my pod, aus biggest CTF
