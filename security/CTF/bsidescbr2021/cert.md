# Cert

- **Category:** x

## Challenge

> Cleverness learns something, but wisdom gives up some certainty every day.

> Trypitakon has attached the public certificate of a Cybears web service to this challenge. It is in X.509 format which is a common format for certificates. The flag is somewhere in the certificate

## Solution

```
kali@kali:~/Downloads$ openssl x509 -in CybearsTest.crt  --noout --text
Certificate:                                                                              
    Data:                                                                                 
        Version: 3 (0x2)                                                                  
        Serial Number:                                                                    
            34:9c:0e:5c:71:d4:d6:5b:58:ff:9c:91:e6:21:e3:a0:96:6e:6d:ae                   
        Signature Algorithm: sha256WithRSAEncryption                                      
        Issuer: C = CY, ST = CY, L = MB, O = Cybears, CN = Y3liZWFyc3tjM3J0X2YxM2xkXzBmX2RyMzRteiF9
        Validity
            Not Before: Apr  8 04:12:57 2021 GMT
            Not After : Apr  8 04:12:57 2022 GMT
        Subject: C = CY, ST = CY, L = MB, O = Cybears, CN = Y3liZWFyc3tjM3J0X2YxM2xkXzBmX2RyMzRteiF9
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (1024 bit)
                Modulus:
                    00:af:18:bd:76:e3:2e:0a:d4:88:da:c9:ac:19:62:
                    bc:8b:e7:f7:cf:97:10:62:dd:e4:28:3a:37:93:cc:
                    28:06:d9:6d:a1:53:9f:60:bb:0e:06:d9:3e:e9:02:
                    9c:4b:49:3e:7b:3c:c4:c5:2a:e3:1a:75:15:15:e8:
                    f4:71:f9:bc:c8:33:30:92:a7:72:ed:f0:72:9b:08:
                    3e:92:9f:6d:ea:92:45:aa:c1:46:2b:cc:3a:9e:76:
                    de:49:71:0f:89:7d:59:b2:10:9a:ea:c9:66:99:d6:
                    f2:1b:c9:be:a6:11:31:ff:1b:f6:93:36:ac:d3:8b:
                    5c:81:63:3e:63:2e:e8:4a:9d
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier: 
                26:50:DC:FF:50:E0:73:00:ED:C9:42:F0:D3:66:6D:DE:C5:E5:1E:6F
            X509v3 Authority Key Identifier: 
                keyid:26:50:DC:FF:50:E0:73:00:ED:C9:42:F0:D3:66:6D:DE:C5:E5:1E:6F

            X509v3 Basic Constraints: critical
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
         32:04:d5:a5:6b:90:42:57:41:4b:95:7f:0d:ab:50:b1:45:5e:
         be:fe:8d:2e:c3:b2:91:57:b3:41:77:48:b1:d0:cf:30:58:b8:
         a6:da:88:89:ea:ef:ae:50:bd:61:e5:28:ff:f7:7f:f9:d6:bb:
         f6:88:f5:39:fb:54:ae:ee:e8:67:8a:ee:b6:71:fa:04:0b:1e:
         9f:f3:f9:1c:ca:fe:7d:a1:63:41:37:8c:b8:d2:28:75:69:34:
         2d:7b:28:d5:91:d0:14:24:6b:6c:95:b2:f7:70:31:8b:0c:e1:
         e3:70:13:62:fd:21:63:98:25:3f:52:1c:14:05:ca:a9:f7:a5:
         ba:48
```

Base64 encoded 
```
Y3liZWFyc3tjM3J0X2YxM2xkXzBmX2RyMzRteiF9
```

Flag
```
cybears{c3rt_f13ld_0f_dr34mz!}
```
