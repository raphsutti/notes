# Cert

- **Category:** Stego

## Challenge
We've discovered a png file leaving our network to a known Jack Corp server which triggered an anomoly alert by our network security. Find out if the adversaries are exfiltrating anything using pictures or if it is a decoy.

[stego](./stego.png)

## Solution

File command
```
file stego.png
stego.png: PNG image data, 500 x 324, 8-bit/color RGB, non-interlaced
```

Exiftool
```
exiftool stego.png
ExifTool Version Number         : 10.80
File Name                       : stego.png
Directory                       : .
File Size                       : 429 kB
File Modification Date/Time     : 2021:09:18 13:24:05+10:00
File Access Date/Time           : 2021:09:18 13:24:05+10:00
File Inode Change Date/Time     : 2021:09:18 13:24:05+10:00
File Permissions                : rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 500
Image Height                    : 324
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Gamma                           : 2.2
White Point X                   : 0.3127
White Point Y                   : 0.329
Red X                           : 0.64
Red Y                           : 0.33
Green X                         : 0.3
Green Y                         : 0.6
Blue X                          : 0.15
Blue Y                          : 0.06
Background Color                : 255 255 255
Pixels Per Unit X               : 23622
Pixels Per Unit Y               : 23622
Pixel Units                     : meters
Modify Date                     : 2020:12:07 01:11:12
Datecreate                      : 2020-12-07T01:11:04+00:00
Datemodify                      : 2020-12-07T01:04:02+00:00
Warning                         : [minor] Trailer data after PNG IEND chunk
Image Size                      : 500x324
Megapixels                      : 0.162
```

Binwalk
```
binwalk -e stego.png

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 500 x 324, 8-bit/color RGB, non-interlaced
159           0x9F            Zlib compressed data, best compression
344074        0x5400A         Zip archive data, encrypted at least v1.0 to extract, compressed size: 14, uncompressed size: 2, name: ..-. .-.. .- --. -.--. -- --- --- .-. ... . .. ... ... - .. .-.. .-.. -.-. --- --- .-.. -.--.-
344256        0x540C0         Zip archive data, encrypted at least v2.0 to extract, compressed size: 90946, uncompressed size: 222532, name: notes.txt
435285        0x6A455         Zip archive data, encrypted at least v2.0 to extract, compressed size: 3202, uncompressed size: 4903, name: notStandard.png
438904        0x6B278         End of Zip archive
```

Morse code
`..-. .-.. .- --. -.--. -- --- --- .-. ... . .. ... ... - .. .-.. .-.. -.-. --- --- .-.. -.--.-`

`FLAG(MOORSEISSTILLCOOL)`

The `notes.txt` inside `5400A` is password protected

Use password `flag(moorseiscool)`

Flag
```
flag{less_walking_more_lerking}
```
