# CTF Name – Layers

- **Category:** category
- **Points:** points

## Challenge

> The flag is in the format of flag{....} with 16 characters between the {}

> Beginner to Expert (Cryptography, Forensics, Malware Analysis, Password Cracking, Signal Analysis)

## Solution

73746567_ba433065694261b6c0734ee27148ee27.jpg

stegseek found passphrase `1984` retrieved gzip file

decompress gzip into tar file

untar file into `operation-northwoods.dat` file

Reverse xxd hexdump into binary: `xxd -r -p operation-northwoods.dat` - turns into wav file

Wav file contains morse code - `b57z6ewmy497j6nc`

Binwalk extract zip file and use the morse code as password to get another zip file + empty gpg file - `binwalk -e file`

file name of the gpg is an md5 hash - crack with john - `john hash.tmp --format=Raw-MD5 --pot=pot,tmp --wordlist=/usr/share/wordlists/rockyou.txt` - obtain passphrase

Extract gpg with passphrase - `gpg --batch --passphrase '!#udamnHACKER#!' -d 532109e0eba9ef0279b6cccfca6c6c03.gpg > decrypted.tmp` to get a text `R00zV1FWVDJNWllHQ09LUkhCSERRUlNZSVJMR1VPS09JTlhGT1JDMk5CWkZDV0xQSEJHUT09PT0K`

Extract from base64 and from base32 then from base58 to get flag

```
flag{4p744smBMFpydD2x}
```
