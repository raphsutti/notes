# Dirb recon

## Start with nmap

```
nmap 192.76.169.3
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-29 14:31 IST
Nmap scan report for target-1 (192.76.169.3)
Host is up (0.000014s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE
80/tcp   open  http
3306/tcp open  mysql
MAC Address: 02:42:C0:4C:A9:03 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 0.29 seconds
```

## Perform dirb on web server. By default dirb will run recursively

```
dirb http://192.76.169.3

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:33:37 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/.git/HEAD (CODE:200|SIZE:23)                                                                           
==> DIRECTORY: http://192.76.169.3/ajax/                                                                                     
+ http://192.76.169.3/cgi-bin/ (CODE:403|SIZE:287) 
...
```

## Run dirb non-recursive mode

```
dirb http://192.76.169.3

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:33:37 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/.git/HEAD (CODE:200|SIZE:23)                                                                           
==> DIRECTORY: http://192.76.169.3/ajax/                                                                                     
+ http://192.76.169.3/cgi-bin/ (CODE:403|SIZE:287) 
...
```

## Run dirb and ignore 403 status codes

```
dirb http://192.76.169.3

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:33:37 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/.git/HEAD (CODE:200|SIZE:23)                                                                           
==> DIRECTORY: http://192.76.169.3/ajax/                                                                                     
+ http://192.76.169.3/cgi-bin/ (CODE:403|SIZE:287) 
```

## Run dirb with custom wordlist

```
dirb http://192.76.169.3 /usr/share/wordlists/dirb/big.txt -r -N 403

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:37:18 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/wordlists/dirb/big.txt
OPTION: Ignoring NOT_FOUND code -> 403
OPTION: Not Recursive

-----------------

GENERATED WORDS: 20458                                                         

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/LICENSE (CODE:200|SIZE:10273)                                                                          
==> DIRECTORY: http://192.76.169.3/ajax/                                                                                     
==> DIRECTORY: http://192.76.169.3/classes/                                                                                  
==> DIRECTORY: http://192.76.169.3/config/                                                                                   
==> DIRECTORY: http://192.76.169.3/data/                                                                                     
==> DIRECTORY: http://192.76.169.3/documentation/
```

## Run dirb for specific file extension (.txt)

```
dirb http://192.76.169.3 /usr/share/wordlists/dirb/big.txt -X .txt -w -N 403

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:38:25 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/wordlists/dirb/big.txt
OPTION: Ignoring NOT_FOUND code -> 403
OPTION: Not Stopping on warning messages
EXTENSIONS_LIST: (.txt) | (.txt) [NUM = 1]

-----------------

GENERATED WORDS: 20458                                                         

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/robots.txt (CODE:200|SIZE:190)                                                                         
                                                                                                                             
-----------------
END_TIME: Mon Mar 29 14:38:35 2021
DOWNLOADED: 20458 - FOUND: 1
```

## Enumerate a directory (passwords) and ignore any 403

```
dirb http://192.76.169.3/passwords /usr/share/wordlists/dirb/common.txt -X .txt -w -N 403

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:39:43 2021
URL_BASE: http://192.76.169.3/passwords/
WORDLIST_FILES: /usr/share/wordlists/dirb/common.txt
OPTION: Ignoring NOT_FOUND code -> 403
OPTION: Not Stopping on warning messages
EXTENSIONS_LIST: (.txt) | (.txt) [NUM = 1]

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/passwords/ ----
+ http://192.76.169.3/passwords/accounts.txt (CODE:200|SIZE:929)                                                             
                                                                                                                             
-----------------
END_TIME: Mon Mar 29 14:39:45 2021
DOWNLOADED: 4612 - FOUND: 1
```

## Search php files

```
dirb http://192.76.169.3 /usr/share/wordlists/dirb/common.txt -X .php -w -N 403

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar 29 14:41:22 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/wordlists/dirb/common.txt
OPTION: Ignoring NOT_FOUND code -> 403
OPTION: Not Stopping on warning messages
EXTENSIONS_LIST: (.php) | (.php) [NUM = 1]

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/credits.php (CODE:500|SIZE:30)                                                                         
+ http://192.76.169.3/home.php (CODE:500|SIZE:46)                                                                            
+ http://192.76.169.3/index.php (CODE:200|SIZE:52794)                                                                        
+ http://192.76.169.3/installation.php (CODE:200|SIZE:7701)                                                                  
+ http://192.76.169.3/login.php (CODE:500|SIZE:1205)                                                                         
+ http://192.76.169.3/page-not-found.php (CODE:200|SIZE:241)                                                                 
+ http://192.76.169.3/phpinfo.php (CODE:200|SIZE:82093)                                                                      
+ http://192.76.169.3/phpmyadmin.php (CODE:200|SIZE:157)                                                                     
+ http://192.76.169.3/register.php (CODE:500|SIZE:0)                                                                         
                                                                                                                             
-----------------
END_TIME: Mon Mar 29 14:41:23 2021
DOWNLOADED: 4612 - FOUND: 9
```

## Save result to a file

```
dirb http://192.76.169.3 /usr/share/wordlists/dirb/common.txt -X .php -w -N 403 -o dirb2.out 

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

OUTPUT_FILE: dirb2.out
START_TIME: Mon Mar 29 14:44:48 2021
URL_BASE: http://192.76.169.3/
WORDLIST_FILES: /usr/share/wordlists/dirb/common.txt
OPTION: Ignoring NOT_FOUND code -> 403
OPTION: Not Stopping on warning messages
EXTENSIONS_LIST: (.php) | (.php) [NUM = 1]

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.76.169.3/ ----
+ http://192.76.169.3/credits.php (CODE:500|SIZE:30)                                                                         
+ http://192.76.169.3/home.php (CODE:500|SIZE:46)                                                                            
+ http://192.76.169.3/index.php (CODE:200|SIZE:52794)                                                                        
+ http://192.76.169.3/installation.php (CODE:200|SIZE:7701)                                                                  
+ http://192.76.169.3/login.php (CODE:500|SIZE:1205)                                                                         
+ http://192.76.169.3/page-not-found.php (CODE:200|SIZE:241)                                                                 
+ http://192.76.169.3/phpinfo.php (CODE:200|SIZE:82093)                                                                      
+ http://192.76.169.3/phpmyadmin.php (CODE:200|SIZE:157)                                                                     
+ http://192.76.169.3/register.php (CODE:500|SIZE:0)                                                                         
                                                                                                                             
-----------------
END_TIME: Mon Mar 29 14:44:49 2021
DOWNLOADED: 4612 - FOUND: 9
```
