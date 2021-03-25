# DNS with Zone Transfer enabled

TODO: Zone transfer definition

```
dig axfr witrap.com @192.44.254.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> axfr witrap.com @192.44.254.3
;; global options: +cmd
witrap.com.             86400   IN      SOA     primary.witrap.com. root.witrap.com. 2011071001 3600 1800 604800 86400
witrap.com.             86400   IN      CAA     0 issue "witrapselfcert.com"
witrap.com.             86400   IN      LOC     37 46 29.744 N 122 25 9.904 W 32.00m 1m 10000m 10m
witrap.com.             86400   IN      A       192.168.60.5
witrap.com.             86400   IN      NS      primary.witrap.com.
witrap.com.             86400   IN      NS      secondary.witrap.com.
witrap.com.             86400   IN      MX      10 mx.witrap.com.
witrap.com.             86400   IN      MX      20 mx2.witrap.com.
witrap.com.             86400   IN      AAAA    2001:db8::11:0:0:11
_ldap._tcp.witrap.com.  3600    IN      SRV     10 10 389 ldap.witrap.com.
free.witrap.com.        86400   IN      A       192.168.60.100
ldap.witrap.com.        86400   IN      A       192.168.62.111
mx.witrap.com.          86400   IN      A       192.168.65.110
mx2.witrap.com.         86400   IN      A       192.168.65.150
open.witrap.com.        86400   IN      CNAME   free.witrap.com.
primary.witrap.com.     86400   IN      A       192.168.60.14
reserved.witrap.com.    86400   IN      A       192.168.62.81
secondary.witrap.com.   86400   IN      A       192.168.66.15
th3s3cr3tflag.witrap.com. 86400 IN      A       192.168.61.35
th3s3cr3tflag.witrap.com. 86400 IN      TXT     "Here is your secret flag: my_s3cr3t_fl4g"
witrap.com.             86400   IN      SOA     primary.witrap.com. root.witrap.com. 2011071001 3600 1800 604800 86400
```

TODO: reverse dns entry definition

```
dig axfr -x 192.168 @192.51.251.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> axfr -x 192.168 @192.51.251.3
;; global options: +cmd
168.192.in-addr.arpa.   86400   IN      SOA     primary.witrap.com. root.witrap.com. 2011071002 3600 1800 604800 86400
168.192.in-addr.arpa.   86400   IN      NS      primary.witrap.com.
168.192.in-addr.arpa.   86400   IN      NS      secondary.witrap.com.
100.60.168.192.in-addr.arpa. 86400 IN   PTR     free.witrap.com.
14.60.168.192.in-addr.arpa. 86400 IN    PTR     primary.witrap.com.
5.60.168.192.in-addr.arpa. 86400 IN     PTR     witrap.com.168.192.in-addr.arpa.
35.61.168.192.in-addr.arpa. 86400 IN    PTR     th3s3cr3tflag.witrap.com.
111.62.168.192.in-addr.arpa. 86400 IN   PTR     ldap.witrap.com.
118.62.168.192.in-addr.arpa. 86400 IN   PTR     temp.witrap.com.
81.62.168.192.in-addr.arpa. 86400 IN    PTR     reserved.witrap.com.
110.65.168.192.in-addr.arpa. 86400 IN   PTR     mx.witrap.com.
150.65.168.192.in-addr.arpa. 86400 IN   PTR     mx2.witrap.com.
15.66.168.192.in-addr.arpa. 86400 IN    PTR     secondary.witrap.com.
168.192.in-addr.arpa.   86400   IN      SOA     primary.witrap.com. root.witrap.com. 2011071002 3600 1800 604800 86400
```

https://linux.die.net/man/1/dig
https://linux.die.net/man/1/nslookup
https://www.isc.org/bind/
