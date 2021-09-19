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

## Iain Dickson - So you want to build a Security Operations Capability?

SOC:

- Monitoring and incident response
- Threat intelligence
- GRC
- Vuln mgmt & pentesting

Why do you need a SOC

Components of Security Operations Capability: Data, People, Processes, Technical capability & tools

Gotchas:

- Timeframe - will take time no matter how much resources
- Hiring - location, salary, clearances
- Shift rosters
- Training
- SOPs
- Metrics

## Alice White - Shifting security left, right, up, down... everywhere! 

- Hierarchy of controls - Most effective to least
    - Elimination: allowlist, access control
    - Substitution: upgrade OS
    - Engineering: Patching, hot fixes, firewall / detection rules - done by human, could be flawed
    - Admin: Training, documented processes
- Near misses - Just in time training, Red team camp
