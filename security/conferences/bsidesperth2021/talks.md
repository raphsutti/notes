# Talks short notes

## Shain Lakin - Offensive RFID/NFC

- RFID/NFC everywhere
    - Pass to enter building, some only store ID
    - Tap into the reader to intercept messages

- Bio implants to trigger an event
    - Scan target mobile device, device send request to Shodan and nmap to scan the public IP
    - Kill switch to destroy your server. Raspberry Pi heat up coil

## Russ Frame - Some Shall Pass - Common missteps in application control

- Path allow list - beware of wild cards
- Hash signature matching
- Vendor signing

## Alice White - Shifting security left, right, up, down... everywhere! 

- Hierarchy of controls - Most effective to least
    - Elimination: allowlist, access control
    - Substitution: upgrade OS
    - Engineering: Patching, hot fixes, firewall / detection rules - done by human, could be flawed
    - Admin: Training, documented processes
- Near misses - Just in time training, Red team camp
