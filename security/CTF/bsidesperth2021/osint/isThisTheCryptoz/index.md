# Is this the Cryptoz

- **Category:** OSINT

## Challenge

The attached files were being exfiltrated by a super duper malicious Advanced Persistent Trickster (APT). Can you please identify the name of the windows API used to encrypt data within one of the files? Provide the answer, with no spaces, and wrapped in FLAG{}. An example answer for the Windows Certificate Enrollment API would be FLAG{CertificateEnrollmentAPI} (Notice 'Windows' was not included in the flag).

    extract.zip

## Solution

https://security.stackexchange.com/a/170485

Flag

```
flag{DataProtectionAPI}
```
