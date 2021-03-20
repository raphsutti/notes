
import string

allCharacters = string.printable
blah = 'z,'*32
characters = blah.split(",")


characters[0]  = 'd'
characters[29] = '7'
characters[4]  = 'r'
characters[2]  = '5'
characters[23] = 'r'
characters[3]  = 'c'
characters[17] = '4'
characters[1]  = '3'
characters[7]  = 'b'
characters[10] = '_'
characters[5]  = '4'
characters[9]  = '3'
characters[11] = 't'
characters[15] = 'c'
characters[8]  = 'l'
characters[12] = 'H'
characters[20] = 'c'
characters[14] = '_'
characters[6]  = 'm'
characters[24] = '5'
characters[18] = 'r'
characters[13] = '3'
characters[19] = '4'
characters[21] = 'T'
characters[16] = 'H'
characters[27] = '1'
characters[30] = 'f'
characters[25] = '_'
characters[22] = '3'
characters[28] = 'e'
characters[26] = '5'
characters[31] = 'd'

print("".join(characters))