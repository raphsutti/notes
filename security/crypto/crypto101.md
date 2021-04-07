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

## Future and rise of quantum computing
