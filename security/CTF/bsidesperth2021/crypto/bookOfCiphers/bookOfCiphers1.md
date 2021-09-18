# Cert

- **Category:** Crypto

## Challenge
Network Ops have detected a number of strange dns queries from a previously decommissioned server on our network to some strange network domains. We believe that someone or something is trying to exfiltrate data through dns however, the strings appear meaningless. They are urgently doing an audit to find the decommissioned server.

This is the first string has been reconstructed from a series of request to one of the domains captured by our passive wiretap, can you help the sec ops team find out what is happening?

ENCODED MESSAGE:

Mwlnvmtco ez ypde Tytetlwtdtyr tyepwwtrpynp rlespctyr awleqzcx g2.23 Delcetyr ypehzcv epwpxpecj alnvlrpd. Dpeetyr fa pieclnetzy djdepxd. Cpetnfwletyr dawtypd ez pylmwp zapcletzylw pqqtntpyntpd Awfrtyd ozhywzlopo Tytetlwtdtyr awfrtyd OYD olel piqtwecletzy mj Ytcepy g1.4 Delcetyr fa wzr dpyopc Fdtyr opqlfwe pyncjaetzy Gpctqjtyr wzr dpyopc qwlr{ufde estd zynp te hld pldj} deza

flag format: flag{words with spaces between flag and stop}


## Solution
ROT 15

```
Blackbird to nest Initialising intelligence gathering platform v2.23 Starting network telemetry packages. Setting up extraction systems. Reticulating splines to enable operational efficiencies Plugins downloaded Initialising plugins DNS data exfiltration by Nirten v1.4 Starting up log sender Using default encryption Verifying log sender flag{just this once it was easy} stop
```



Flag
```
flag{just this once it was easy}
```
