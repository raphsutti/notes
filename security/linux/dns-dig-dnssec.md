# DNS with DNSSEC enabled

TODO: DNSSEC definition

key id of key signing key - 47466 (note KSK)
Algorithm used to create KSK and ZSK - NSEC3RSASHA1

```
dig DNSKEY witrap.com +multiline @192.77.13.3

; <<>> DiG 9.11.5-P4-1-Debian <<>> DNSKEY witrap.com +multiline @192.77.13.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41592
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.            IN DNSKEY

;; ANSWER SECTION:
witrap.com.             86400 IN DNSKEY 256 3 7 (
                                AwEAAc/J2KXA4dkUSBce20Mm+hbWUfZpWJ7lAyDDafc0
                                VovbYE/ROEIiOURFcn1yZfjWE55OtupRHx6rqq8eNEov
                                sb8ELB8BXVqNhR/b/ilgq6cKzuTFC+vCMbdFHKj/swdp
                                2DNEFtr+3Ojpz5jGa4JrN15j5/L02vrcRbb3VUDVyu8m
                                mSMUqlAozTkqHiFb490Qk5tPrHvd9Hu19NTAxlcfy4UY
                                63Zj4I7+KfuTPkt4ENdLyIqy4jXhp7cQ2uZCzOp2tJge
                                dC6Vmd9vP1sdUwuv3wRy4PBaVtM0VhMtacISfWxG4qyJ
                                VqcOVwl6Pa4pfIeRtYp7J9EV4/29M7yWS2POl3E=
                                ) ; ZSK; alg = NSEC3RSASHA1 ; key id = 47204
witrap.com.             86400 IN DNSKEY 257 3 7 (
                                AwEAAbtM3NZHtVK+rrzBYOOVTf5OV6WogTSPEhzVeNdv
                                qQnjDzawTJSUgzzmkNSII1BkMuuI4QwlXGy0ZZgg9/lf
                                zGWHzCpC6uEV8BrNKT2+04TgJ48/LAGiNi/qRRc2jUQp
                                EMo5tSnXWMDOc56C2n2g0Wq521pdiPskTWe4lwNbE4cG
                                GSwWvnnY+0QFJInYDv7vR5MSnQUyGlFfTTW6WX16fvyN
                                QMPJAiTBnqyNP2+GkjWX+5xm+rtp91hTEvKQONTsYryL
                                YhlFdzkSMFbBD8Rz+6Eu7Cxc3BJknBysxRA2AKmWaGD8
                                0HLSM3d1p920p4iC6YwhZ02HmjmXcZzGZzm9BTyNFcfy
                                HDxa7Qp4L2oF7h8aNCPgNB4Y70vM8UH6huejOHgR6Wkk
                                aOGwX8Ds3oKYWRhuyTael99EmsAfCiCyb0c2a0I4nwoh
                                t6XE9XEJHx5gxCXnH6MSQYrJmOzU1jefnoDcEOhiXO7n
                                Ss1TiUun482Ch3rHK9vCYPfGwhrLsYzGRRGtWZA87GST
                                CMFKCGvPzRPaB8Nj1o9TASJ9pQ2UGk8enAbYg6RSUtdb
                                zMv8t1OfaGt1dkZgrFeWkuA5I+Q0uSmBFceMgEsrDjgf
                                TQ8WwkJ9wS1bemPRJYK7yhne0bt/x7LLkyzWmcWoYnxL
                                BbR0ExESGKVurMzfHlCYtwFIvhP3
                                ) ; KSK; alg = NSEC3RSASHA1 ; key id = 47466
```

RRSIG A record - oheCda...


```
dig A witrap.com +multiline @192.77.13.3 +noadditional +dnssec +multiline

; <<>> DiG 9.11.5-P4-1-Debian <<>> A witrap.com +multiline @192.77.13.3 +noadditional +dnssec +multiline
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 52037
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 3, ADDITIONAL: 5

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags: do; udp: 4096
;; QUESTION SECTION:
;witrap.com.            IN A

;; ANSWER SECTION:
witrap.com.             86400 IN A 192.168.60.2
witrap.com.             86400 IN RRSIG A 7 2 86400 (
                                20181120150154 20181021150154 47204 witrap.com.
                                oheCda/JJlTjPDYoskGh/YW+o8Tixx0hAHs0UtMPy91o
                                6vZttrL0SA/5LLmYgmTwMioBq2fhPm19tX4NBdBec/HR
                                HNad/yKmZYp/kC/qqMesthhg1kKPOKrVKvtbMvW7tmMX
                                RjaVTFIQADg2/gCnPfp8PkwwSmcJMWTS0h0ivbnoUXAR
                                ddTPMY5Gnaxy2CxQK3cBHsjVnBosmChHqabNUdPPqP+X
                                53fdQ4z2GxYkO9Y4KmVLbljIYnb45Tl+J1lL4nLxCHgI
                                XXL7Fzs7bziwR8bsWD0lXaJWha1MF8R9u9USS+CQzGht
                                OIWcZikY3RxXrBu+PmrJcHx7TaObssLgXw== )

;; AUTHORITY SECTION:
witrap.com.             86400 IN NS ns.witrap.com.
witrap.com.             86400 IN NS ns2.witrap.com.
witrap.com.             86400 IN RRSIG NS 7 2 86400 (
                                20181120150154 20181021150154 47204 witrap.com.
                                vH0aJMa1lHeMcffiP6VyBoHkQUjRtsnRwFxeQaoqesyk
                                AgSMOXGDpJGDkt0Dqk3LGIystMqC/ZMWgZJGyim2jPJJ
                                N9/vry47AuUFQe5maXn3vA5uUrj+VJEaAx3Q1C6Cot18
                                8GXHHAJxFEtHcA8U7TIi8Iic91isuuUuLcatN9Yax/BA
                                VJ65xRE4MV2LkqzngffocVjo2qOPBB9TLvitpF9sklsp
                                yPIxm7XCRJ9ZPRAOLu1Wd6U/q0xE7MG28mw1e1bO88+X
                                PCJYB4eEnji7aDe0PwwRK5zTFX6iVwyqVtl4VpiLaUX/
                                8aeByfLKCOnZEDwmstrtAcWa4UpX910g7w== )
```

Salt used for hash calculation for NSEC3 - DBF4725BEF433A41

```
dig NSEC3PARAM witrap.com @192.77.13.3                                 

; <<>> DiG 9.11.5-P4-1-Debian <<>> NSEC3PARAM witrap.com @192.77.13.3
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54561
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;witrap.com.                    IN      NSEC3PARAM

;; ANSWER SECTION:
witrap.com.             0       IN      NSEC3PARAM 1 0 10 DBF4725BEF433A41

;; AUTHORITY SECTION:
witrap.com.             86400   IN      NS      ns.witrap.com.
witrap.com.             86400   IN      NS      ns2.witrap.com.

;; ADDITIONAL SECTION:
ns.witrap.com.          86400   IN      A       192.168.63.4
ns2.witrap.com.         86400   IN      A       192.168.67.14
```

RRSIG records exists - 11

```
dig RRSIG witrap.com +short @192.77.13.3
SOA 7 2 86400 20181120150154 20181021150154 47204 witrap.com. Je4u3kbWJrLNH3AMIkAYZDG5qb81UJGRx2Fp7JFRJib5rUxxXNaIaNZE pBJbxG/UdJIeIjJTrVttJ8MgsWH3V9wpmw1ZxZGq91Gl4jjRVx4nuG/S H4EZ865GA9rh78KOWZ8MA3DkTHJl/3FFZOBhjUfJBeppReV0g5qQKhip Pj51eA3/a+F010JUGNxk1hCBgj7Pl97BzzpMHNNe28UFEloB6SgoGwhO rSUv5GxUA6keBGnaFh+CICQSKKj8AKUbbvanrI9pkNvduQntzOTrE9XW S/SifdgnJc7ssiHtnLr/1ZQv1vfGbE5oJklXl8DJ+6zr2wvWosAn0hmq pZMRvw==
NS 7 2 86400 20181120150154 20181021150154 47204 witrap.com. vH0aJMa1lHeMcffiP6VyBoHkQUjRtsnRwFxeQaoqesykAgSMOXGDpJGD kt0Dqk3LGIystMqC/ZMWgZJGyim2jPJJN9/vry47AuUFQe5maXn3vA5u Urj+VJEaAx3Q1C6Cot188GXHHAJxFEtHcA8U7TIi8Iic91isuuUuLcat N9Yax/BAVJ65xRE4MV2LkqzngffocVjo2qOPBB9TLvitpF9sklspyPIx m7XCRJ9ZPRAOLu1Wd6U/q0xE7MG28mw1e1bO88+XPCJYB4eEnji7aDe0 PwwRK5zTFX6iVwyqVtl4VpiLaUX/8aeByfLKCOnZEDwmstrtAcWa4UpX 910g7w==
A 7 2 86400 20181120150154 20181021150154 47204 witrap.com. oheCda/JJlTjPDYoskGh/YW+o8Tixx0hAHs0UtMPy91o6vZttrL0SA/5 LLmYgmTwMioBq2fhPm19tX4NBdBec/HRHNad/yKmZYp/kC/qqMesthhg 1kKPOKrVKvtbMvW7tmMXRjaVTFIQADg2/gCnPfp8PkwwSmcJMWTS0h0i vbnoUXARddTPMY5Gnaxy2CxQK3cBHsjVnBosmChHqabNUdPPqP+X53fd Q4z2GxYkO9Y4KmVLbljIYnb45Tl+J1lL4nLxCHgIXXL7Fzs7bziwR8bs WD0lXaJWha1MF8R9u9USS+CQzGhtOIWcZikY3RxXrBu+PmrJcHx7TaOb ssLgXw==
MX 7 2 86400 20181120150154 20181021150154 47204 witrap.com. QX0T7yjc8VbalWM6UcusO+03Zoiu5ibmyryKxgXICt/Bz54buBTuf5Mf qWrAE2LEqWvhEecc7WENR6j7NYN90S9dCMaUTfpN6GjkJQ6oSR0/gscl NvThyu7gqEel/8PAMugIc//VHb/wHT2J7umx4AmYl1vtnzM5sj6X1LzS G1VAtliwB+LJRky0TjhNAGBLJccLP33DK2H/UAFKfNK/SJOXbN4UTZ0E xg5vyTTAnrPibV74kSwfm55ahi7eHVm/nMS7/zW+ARB3Fcwiq61Oq7N3 dfzQgFWPMZW/rgPNr3iMwZV3Jq4J6D3EZcV3iGZM7Rdd2XewUIRQpZ4m J/+R2Q==
TXT 7 2 86400 20181120150154 20181021150154 47204 witrap.com. UCuzhWRgvsLfDoS3mCBxKsVWMUTa6WbiKHL6B5dyMrPvv3pzcbdMRxjI IurOswr70PjfiuO7uXm+nf0QnpUZyQLH56Ks3ylAJjz5WOhPbjnN6cH9 Ehd2stojKlQkeWxRDp2xJkGLGQ6kU3HA6/aDBruxVhh4z9z3rI8sMrbX jiSK1huUh8Igc8C/95mhlyOXBjzNARIyz7tiLfBLjAxZV+Bv36GwAfEq /thu/DGQUmnNqq7JObrGNd4UArQss0shQ54vG9b4gOUKfujsU6+4u+SM gYLGWJIEzKowRomvIPrJ06QE4KPDB8JqpxjkIPlKQEfTeNS9EB6odxP+ cMYe0g==
AAAA 7 2 86400 20181120150154 20181021150154 47204 witrap.com. PXfPbMJXDz5PuLsP7BArY6SnYsd9LMGT2t0ra0Z4dxc8KOImcgaO4qQG JdIP2m+6jUJbTjgb4KIKYtUiffkrmWJgr6B+33PWsQowI9yVwILitM4L dW1UKleJ18c35R6mJo9T64/bqZSUyhKT2uU+GsRToL4OphXyHs0IQvRK TjYINwtoliyX+EO99C6OalC0FzjIFbvYTuCCWphMn1ujlyCtd0UWWuy/ 3jd5K31VoYSw0t5hR3t5zLum0RfvYvHYwTsg9I1WYi6PBlKTojgKNh/F UscQSWhI0cEaJeXetsS24TAd3ev2NZpaxgHI1OZNX5v3oK7QS2oVLk3y lw0Pgw==
LOC 7 2 86400 20181120150154 20181021150154 47204 witrap.com. fPrC6PqBORHZV4SBUx+Pvh3wi1nc14zVJIMJUHqYdlkNk3/AoKnbJ3Uk P1nH9PGeieim19QeyMLdei1qACoR2SPO7A58u8Vv7qFsrBHcM1QqNBhY 5Eht1f7qu1RWG70CnAgd18e3+kXWo56xjyhUm/pb46ccw692bihF9HDg QJ8pWIH7kYSYk8PbaMR6ADqhHd/j+c9xwLhttxRiITv51Q5Ioinecx3X gSeZztbT46igTAzJ6tEsgsrEnPVm+9CjaE+vfGtLp/d3mdMYRppSzwSr 3NXc9+2txrb715WrjTeAVTnTD+7rsBqDAzBSAhVgtmEh3ZB3+x6pqhCa Qtf4xg==
DNSKEY 7 2 86400 20181120150154 20181021150154 47204 witrap.com. quZLXwrOX7hxcPhhIY2OvCNzEl5xP7p7HLJHmH64D/rHPDw7jtz/tc1K zgeyQdA+PgS0Pugi8v9u1jZR66B9KClZHxwGe+15u2wDvdUOitFT1QL4 tqlSp2os0A/FVRGfjhS1bFKsgCavnWytSZQFtdvSA/0UXntNqu8ihpXj KYJcvwgcOZb2x25irwY7VxZtNWWIoZetKVhXtEgj+UagGJQisR2iNVvv 8roBbAmGiWrJCl19ezmQAomZQ+Bf/JyFbHFBGABpIyP0J/MSs2zawYRc iHMWvF20oSvGwY+AgaeZbPR4Pp1kYqnKBG4ylLIpH9LxCZVAor9EIl2Y Z5/O4g==
DNSKEY 7 2 86400 20181120150154 20181021150154 47466 witrap.com. A8kFmJ0mqrxMR+QZGbXfWNyf4jHqV4+F3iPAON+mXH+A6z5Ba3dCaTXi oBgxJK8WdcDzqOuPcYjfCmu7gEq7vl/I/RXbLe0ckmaKSL/tsEvDvG2X 1U8d2HTM5gxdMzzqRWEInQ2A0CnayzHDUNHAXfg/DpcoXuhgKOPkfZE3 hazetFGUmD/IoAjuj0955FKdTkyXl9+/GzKh39uGkrm3rdD9GKSRr+Js CsatJvx74CBPjA7qNHCRhsmuhrIhACBpvH6/nG5SB6/CvmyQ/qtynbKS EHUVae9fgRvMNeXmxhFn5l2M1qneJCnvjR0SMHwEAeUiR6rkZHKDbA84 NgVVj5mH7RAXHHRsMPMiAXzos1iFdIThLk+KdZocotetM4+qv7BcPEAp n8egRAdyRFQrXnUfknk8kyu5Yl9FWSuqNZX7XjRdD2UYXtUehP7fsmXb ZRws3oPGKOY4LtthGBC0kKqBZgk/L9q+lq2ZBASCyobzZZcUhCmQCdJZ GL2foZt2DYl4AlWu/mUGKQ9gPKEKxPqe6vVWj+JumRQqL4L6C0PO/csN YcAjMIBZM7pcRyzuWHdC95B93RahxCVG0ZgFk2jpqOhTsr4tDExTseP2 hMag8Rkr74T2TK2d3MDC4bXZ5e4MbdiHGhz7J22pSGarz8JjxQqI91cH 9gifFY/9q30=
NSEC3PARAM 7 2 0 20181120150154 20181021150154 47204 witrap.com. CRJZvX0Ovxa855N+/sj+XCyVRfyzFqz/OY9GaK9J1HERgrV5Afn+turj zkpv6W0IHJDr4aPjS6lb43jXexx2bBrYOaa57/mtmk7HQcz8ef/ivdGr TfLCCgPnUq9M17Gk325tnEq3roF2+qb8U3OF2KiCxpMr5nbUBuJz3fxj QK3yLggRxA2g9uMF6R+cyH+OGoBcIefJ19wTOGTGNm2lG+BFtFBngcYY OpopbGWUWwjNV3pD4PQ654J8RJhgzDaLpS9VMzIQjyjiff1bdtiDaYVK 2cW0F6/ugglTm9b8K7/TMHaUDwApIRvfTggIB5y3zgFJi/4HI/B5KyW2 Mf7ShA==
CAA 7 2 86400 20181120150154 20181021150154 47204 witrap.com. Csvr2Tm3HGkXoOeYPqzGkMumcCWcGxaReN7QNzqY9utLs7FSy5Jf3vNJ 4XeX/qSw02/Rtyrk0Ej3h7sGIy0C+gXaDO5fiPgqKkBoAczsDpG37lRz IJTmebbqLu4G2Kb8MgLsVb2VWZ8Eo0xBMOvEduP6uMD4yC85g8NZfrmj S5JB0/31TWbW3GkTSCZ/mYFjG8m4lS4V1LoKcrSdzPP6Vah1SH/Bohyc kaMpd2VT4h3kaCbpX/elT+mHNbpdRFvFhzjPfG0tKDFdpbZf3jYGMCH5 Wc2LGHH5TriCjVwOZzEsL2BftoGNv8A0Bldx9oWs7lgBdxYWOhBbgbJC GOnhjA==
```
