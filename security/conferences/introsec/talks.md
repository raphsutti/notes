# Intro Sec Con

https://introseccon.com/schedule/

## Investigation and Analysis – Quick Guide for New SOC Analysts  (Gyle dela Cruz)

- Identify
- Protect
- Detect
- Respond
- Recover

- Baselining what is normal
- Event vs incident
- Detective work
  - Hypothesis
  - Gather evidence
  - Test hypothesis
  - Work towards conclusion


## IOC Dev 101 (James Hovious)

Indicator of Compromise
- artifact that suggest the presence of malicious activity
- used in combination with human analysis

Types of IOC
- Host based indicators (OS, file system)
- Network based indicators (HTTP headers, IP, domain name)

Use cases
- Real time (current compromise)
- Historical (previous compromise)
- Proactive hunting (before compromise)

Characterise IOC by describing:
- Fidelity (accuracy - true positive etc.)
  - True positive and True negative are what you want to work against
  - False positive - detected but benigned
  - False negative - did not detect, and malicious
- Robustness
  - Hashing is brittle
- Performance
  - How long does it take to match - may need to scale
  - How much memory consumed

IOC engines
- None
  - hash, IP, FQDN
- Yara
  - Match files with strings, byte patterns
  - Basic: C2 strings
  - Advanced: shellcode, .NET byte sequences
- Snort/Suricata
  - Network based indicators
  - HTTP headers, protocols
- OpenIOC
  - Advanced IOC matching
  - Include context

IOC dev methodology
- Multiple routes
  - Malware analysis (extract indicators)
  - Incident respons/Threat intel

1. Define requirements
2. Research threat
3. Acquire true positives
4. First pass IOC dev
5. Test assumptions


## Opening the Toolbox – A Guide to Pentesting Tools for CTFs   (Sam Ferguson)

### Network scanning
- rustscan
- `nmap -sV -sC -O -Pn -p- 192.168.9.1`
  - -sV = Service version
  - -sC = Script scan
  - -O = Operating system
  - -Pn = No ping
  - -p = ports

### Web application tools
- Feroxbuster
  - Forced browsing tool written in rust
  - Find hidden directories and files
  - `feroxbust -t 16 -w mywordlist.txt -u http://10.10.10.10:8080 -x php,html,txt`
    - -t = threads
    - -w = wordlist
    - -u = URL
    - -x = extensions
- Developer tools
  - Web browser dev tools
  - Inspector, console, debugger, network, storage
- ffuf
- Burpsuite
  
### Linux local
- Tools to enum and exploit linux
- LinPEAS, linux-expoit-suggester-2, gtfobins, pspy

### Windows local
- WinPeas, Windows Exploit Suggester - Next generation, LOLBAS, WADComs, mimikatz, Bloodhound/Sharphound3
- LOLBAS - repository of useful Windows binaries, VB scripts, BAT scripts

### General resources
- Hacktricks
- PayloadALlTheThings
- Revshells.com
- SecLists


