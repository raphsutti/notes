def check(x):
    if x+1 is 1+x:
        return False
    if x+2 is not 2+x:
        return False
    print("hi")

print(check(x+2))
