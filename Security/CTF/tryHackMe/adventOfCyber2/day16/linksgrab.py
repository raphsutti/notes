from bs4 import BeautifulSoup
import requests

html_page = requests.get("http://10.10.192.234:8000")
soup = BeautifulSoup(html_page.text, 'lxml')
links = soup.find_all('a')

for link in links:
    if "href" in link.attrs:
        print(link["href"])
