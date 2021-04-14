# Talks short notes

## Mike Burgess Keynote - Director-General of Security ASIO

Chose to written notes rather than ipad 😂

Greatest threats

Espionage, terrorism

## Christopher Vella - Easy LPEs

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
