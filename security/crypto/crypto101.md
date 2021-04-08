# Cryptography 101

https://tryhackme.com/room/encryptioncrypto101

## Key terms

`Ciphertext` - Result of encrypting plaintext

`Cipher` - Method of encryption

`Plaintext` - data before encryption

`Encryption` - transforming data using a cipher

`Encoding` - a form of data **not** encryption

`Key` - used to decrypt ciphertext -> plaintext

`Passphrase` - used to protect the key

`Asymmetric encryption` - use different keys to encrypt/decrypt

`Symmetric encryption` - use same key to encrypt/decrypt

`Brute force` - attacking crypto by trying every combination of password/key

`Cryptanalysis` - attacking crypto by finding weakness in the maths

## Two main classes of cryptography

### Symmetric encryption

Use same key. Tends to be faster

Eg. DES (broken) and AES algorithms.

AES - 128 / 256 bit keys
DES - 56 bit keys

### Asymmetric encryption

Use pair of keys. One to encrypt and one to decrypt. Tends to be slower and use larger =keys

Eg. RSA and Elliptic Curve

RSA - 2048 / 4096 bit keys

Private key and public key. Data encrypted with private key can be decrypted with public key and vice versa

## RSA

RSA is based on math difficult problem working out factors of large numbers. 
It is quick to multiply two prime numbers but difficult to work out the two prime numbers

Attacking RSA challenges: https://github.com/Ganapati/RsaCtfTool

`p` and `q` are large prime numbers
`n` is `p * q`
`n` and `e` are the public keys
`n` and `d` are the private keys
`m` is the message
`c` is the ciphertext

## Two methods of key exchange

It is common to see asymmetric cryptography for exchanging keys for symmetric encryption.

## Digital signatures

## SSH

### cracking passphrase

First convert the key for john
```
/usr/share/john/ssh2john.py idrsa.id_rsa > sshforjohn
```

Run john
```
/usr/sbin/john sshforjohn --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 6 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
delicious        (idrsa.id_rsa)
1g 0:00:00:02 DONE (2021-04-08 00:01) 0.4201g/s 6025Kp/s 6025Kc/s 6025KC/s     1990..*7¡Vamos!
Session completed
```

## Diffie Hellman key exchange

## PGP, GPG, AES

## Future and rise of quantum computing
