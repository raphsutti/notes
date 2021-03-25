# DNS

**D**omain **N**ame **S**ystem

The main command used here is `dig`

## Commands

### Finding IP address of a name server

```
dig NS example.com @<dns server>
```

eg. answer 192.168.66.4
```
dig NS witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> NS witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 30875
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      NS

;; ANSWER SECTION:
witrap.com.             86400   IN      NS      ns2.witrap.com.
witrap.com.             86400   IN      NS      ns.witrap.com.
```

### Finding ipv4 address of a domain name

```
dig A example.com @<dns server>
```

eg. answer 192.168.66.2
```
dig A witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> A witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 19521
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      A

;; ANSWER SECTION:
witrap.com.             86400   IN      A       192.168.66.2
```

### Finding ipv6 address of a domain name

```
dig AAAA example.com @<dns server>
```

eg. answer 2001:db8::1:0:0:13
```
dig AAAA witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> AAAA witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 46948
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      AAAA

;; ANSWER SECTION:
witrap.com.             86400   IN      AAAA    2001:db8::1:0:0:13
```

### Finding mail servers

```
dig MX example.com @<dns server>
```

eg. found 2
```
dig MX witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> MX witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 62851
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 2, ADDITIONAL: 5

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      MX

;; ANSWER SECTION:
witrap.com.             86400   IN      MX      20 mail2.witrap.com.
witrap.com.             86400   IN      MX      10 mail.witrap.com.
```

### Find canonical name (CNAME)

```
dig CNAME www.example.com @<dns server>
```
or just 
```
dig www.example.com @<dns server>
```

eg. answer public.witrap.com.
```
dig CNAME www.witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> CNAME www.witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 52134
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;www.witrap.com.                        IN      CNAME

;; ANSWER SECTION:
www.witrap.com.         86400   IN      CNAME   public.witrap.com.
```

### Finding certificate authorities that can issue certificate for example.com

```
dig CAA example.com @<dns server>
```

eg. answer "witrapselfcert.com"
```
dig CAA witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> CAA witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 44850
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      CAA

;; ANSWER SECTION:
witrap.com.             86400   IN      CAA     0 issue "witrapselfcert.com"
```

### Finding geographical location of example.com

```
dig LOC example.com @<dns server>
```

eg. answer 37 46 29.744 N 122 25 9.904 W 32.00m
```
dig LOC witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> LOC witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 20547
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      LOC

;; ANSWER SECTION:
witrap.com.             86400   IN      LOC     37 46 29.744 N 122 25 9.904 W 32.00m 1m 10000m 10m
```

### Look up IP of machine which support sip over TCP on example.com

```
nslookup -type=srv _sip._tcp.example.com <dns server>
```

```
dig <sip host name found above>.com @<dns server>
```

eg. answer 192.168.66.155
```
nslookup -type=srv _sip._tcp.witrap.com 192.31.147.3
Server:         192.31.147.3
Address:        192.31.147.3#53

_sip._tcp.witrap.com    service = 10 10 5060 sip.witrap.com.
```

```
dig sip.witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> sip.witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 34650
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;sip.witrap.com.                        IN      A

;; ANSWER SECTION:
sip.witrap.com.         86400   IN      A       192.168.66.155
```

### Finding administrative email of example.com

```
dig SOA example.com @<dns server>
```

eg. answer root.witrap.com
```
dig SOA witrap.com @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> SOA witrap.com @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 38010
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      SOA

;; ANSWER SECTION:
witrap.com.             86400   IN      SOA     ns.witrap.com. root.witrap.com. 2011071001 3600 1800 604800 86400
```

### Finding domain corresponds to <ip>

```
dig -x <ip> @<dns server>
```

eg. answer private.witrap.com
```
dig -x 192.168.67.8 @192.31.147.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> -x 192.168.67.8 @192.31.147.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 29697
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;8.67.168.192.in-addr.arpa.     IN      PTR

;; ANSWER SECTION:
8.67.168.192.in-addr.arpa. 86400 IN     PTR     private.witrap.com.
```
