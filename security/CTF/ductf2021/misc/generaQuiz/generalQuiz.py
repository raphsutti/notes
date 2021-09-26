#!/usr/bin/python

import socket
import urllib
import base64
import string

host= "pwn-2021.duc.tf"
port= 31905

s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host,port))

while 1:
	res = s.recv(1024)
	print(res)
	if "Bloody Ripper! Here is the grand prize!" in res:
            break

	lines = res.split("\n")
	
	for line in lines:
		if "enter" in line:
                    s.send("\n")

                if "1+1" in line:
                    answer = str(2)
                    print(answer)
                    s.send(answer + "\n")

                if "Decode this hex string and provide me the original number (base 10)" in line:
                    hex = line.split(" ")[-1]
                    decodedHex = str(int(hex,0))
                    print(decodedHex)
                    s.send(decodedHex + "\n")
                    
                if "Decode this hex string and provide me the original ASCII letter" in line:
                    hex = line.split(" ")[-1]
                    ascii = hex.decode("hex")
                    print(ascii)
                    s.send(ascii + "\n")

                if "Decode this URL encoded string and provide me the original ASCII symbols" in line:
                    urlEncoded = line.split(" ")[-1]
                    urlDecoded =  urllib.unquote(urlEncoded)
                    print(urlDecoded)
                    s.send(urlDecoded + "\n")

                if "Decode this base64 string and provide me the plaintext" in line:
                    base64Encoded = line.split(" ")[-1]
                    base64Decoded = base64.b64decode(base64Encoded)
                    print(base64Decoded)
                    s.send(base64Decoded + "\n")

                if "Encode this plaintext string and provide me the Base64" in line:
                    plaintext = line.split(" ")[-1]
                    base64Encoded = base64.b64encode(plaintext)
                    print(base64Encoded)
                    s.send(base64Encoded + "\n")

                if "Decode this rot13 string and provide me the plaintext" in line:
                    rot13Encoded = line.split(" ")[-1]
                    rot13 = string.maketrans("ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz","NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm")
                    rot13Decoded = string.translate(rot13Encoded, rot13)
                    print(rot13Decoded)
                    s.send(rot13Decoded + "\n")

                if "Encode this plaintext string and provide me the ROT13 equilavent" in line:
                    plaintext = line.split(" ")[-1]
                    rot13 = string.maketrans("ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz","NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm")
                    rot13Encoded = string.translate(plaintext, rot13)
                    print(rot13Encoded)
                    s.send(rot13Encoded + "\n")

                if "Decode this binary string and provide me the original number (base 10)" in line:
                    binary = line.split(" ")[-1]
                    decimal = int(binary,2)
                    print(decimal)
                    s.send(str(decimal) + "\n")

                if "Encode this number and provide me the binary equivalent" in line:
                    number = line.split(" ")[-1]
                    binary = bin(int(number))
                    print(binary)
                    s.send(binary + "\n")

                if "Final Question, what is the best CTF competition in the universe" in line:
                    print("DUCTF")
                    s.send("DUCTF" + "\n")
