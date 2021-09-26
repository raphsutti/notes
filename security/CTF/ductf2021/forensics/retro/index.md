# Retro

- **Category:** Forensics

## Challenge

Our original logo was created in paint, I wonder what other secrets it hides?

Author: QUTWH

## Solution

```
> exiftool og.jpg
ExifTool Version Number         : 12.00
File Name                       : og.jpg
Directory                       : .
File Size                       : 121 kB
File Modification Date/Time     : 2021:09:26 09:06:22+10:00
File Access Date/Time           : 2021:09:26 09:06:24+10:00
File Inode Change Date/Time     : 2021:09:26 09:06:22+10:00
File Permissions                : rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
DCT Encode Version              : 100
APP14 Flags 0                   : (none)
APP14 Flags 1                   : (none)
Color Transform                 : YCbCr
Exif Byte Order                 : Big-endian (Motorola, MM)
Artist                          : DUCTF{sicc_paint_skillz!}
XP Author                       : DUCTF{sicc_paint_skillz!}
Padding                         : (Binary data 2060 bytes, use -b option to extract)
X Resolution                    : 300
Displayed Units X               : inches
Y Resolution                    : 300
Displayed Units Y               : inches
XMP Toolkit                     : Adobe XMP Core 5.6-c111 79.158366, 2015/09/25-01:12:00
Format                          : image/jpeg
Modify Date                     : 2020:06:16 07:51:27Z
Metadata Date                   : 2020:06:16 17:51:24+10:00
Thumbnail Width                 : 256
Thumbnail Height                : 192
Thumbnail Format                : JPEG
Thumbnail Image                 : (Binary data 10533 bytes, use -b option to extract)
Rendition Class                 : proof:pdf
Original Document ID            : uuid:65E6390686CF11DBA6E2D887CEACB407
Document ID                     : xmp.did:debb54d2-eef4-482d-8fea-b5ad9a904da8
Instance ID                     : xmp.iid:debb54d2-eef4-482d-8fea-b5ad9a904da8
Derived From Instance ID        : xmp.iid:7f7157ae-f9a9-4b39-ac8b-368dc10e4af8
Derived From Document ID        : xmp.did:7f7157ae-f9a9-4b39-ac8b-368dc10e4af8
Derived From Original Document ID: uuid:65E6390686CF11DBA6E2D887CEACB407
Derived From Rendition Class    : proof:pdf
History Action                  : saved, saved
History Instance ID             : xmp.iid:7f7157ae-f9a9-4b39-ac8b-368dc10e4af8, xmp.iid:debb54d2-eef4-482d-8fea-b5ad9a904da8
History When                    : 2020:06:16 17:48:09+10:00, 2020:06:16 17:51:24+10:00
History Software Agent          : Adobe Illustrator CC 2015 (Macintosh), Adobe Illustrator CC 2015 (Macintosh)
History Changed                 : /, /
Manifest Link Form              : EmbedByReference
Manifest Reference File Path    : /Users/h4sh/Downloads/DownUnderCTF_Paint.png
Manifest Reference Document ID  : 0
Manifest Reference Instance ID  : 0
Ingredients File Path           : /Users/h4sh/Downloads/DownUnderCTF_Paint.png
Ingredients Document ID         : 0
Ingredients Instance ID         : 0
Startup Profile                 : Web
Producer                        : Adobe PDF library 10.01
Creator                         : DUCTF{sicc_paint_skillz!}
Profile CMM Type                : Linotronic
Profile Version                 : 2.1.0
Profile Class                   : Display Device Profile
Color Space Data                : RGB
Profile Connection Space        : XYZ
Profile Date Time               : 1998:02:09 06:49:00
Profile File Signature          : acsp
Primary Platform                : Microsoft Corporation
CMM Flags                       : Not Embedded, Independent
Device Manufacturer             : Hewlett-Packard
Device Model                    : sRGB
Device Attributes               : Reflective, Glossy, Positive, Color
Rendering Intent                : Perceptual
Connection Space Illuminant     : 0.9642 1 0.82491
Profile Creator                 : Hewlett-Packard
Profile ID                      : 0
Profile Copyright               : Copyright (c) 1998 Hewlett-Packard Company
Profile Description             : sRGB IEC61966-2.1
Media White Point               : 0.95045 1 1.08905
Media Black Point               : 0 0 0
Red Matrix Column               : 0.43607 0.22249 0.01392
Green Matrix Column             : 0.38515 0.71687 0.09708
Blue Matrix Column              : 0.14307 0.06061 0.7141
Device Mfg Desc                 : IEC http://www.iec.ch
Device Model Desc               : IEC 61966-2.1 Default RGB colour space - sRGB
Viewing Cond Desc               : Reference Viewing Condition in IEC61966-2.1
Viewing Cond Illuminant         : 19.6445 20.3718 16.8089
Viewing Cond Surround           : 3.92889 4.07439 3.36179
Viewing Cond Illuminant Type    : D50
Luminance                       : 76.03647 80 87.12462
Measurement Observer            : CIE 1931
Measurement Backing             : 0 0 0
Measurement Geometry            : Unknown
Measurement Flare               : 0.999%
Measurement Illuminant          : D65
Technology                      : Cathode Ray Tube Display
Red Tone Reproduction Curve     : (Binary data 2060 bytes, use -b option to extract)
Green Tone Reproduction Curve   : (Binary data 2060 bytes, use -b option to extract)
Blue Tone Reproduction Curve    : (Binary data 2060 bytes, use -b option to extract)
Image Width                     : 2673
Image Height                    : 1974
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 2673x1974
Megapixels                      : 5.3
```

Flag

```
DUCTF{sicc_paint_skillz!}
```
