# Speed Me Up Scotty 1

- **Category:** Scripting

## Challenge

This program prints the flag, but takes a reeeeeeeeeally long time to do so. Can you rewrite it faster?

Provided script:

```python
def my_func(x):
    # Note: Don't fall for the off by one
    if x == 0 or x == 1:
        return 1
    return my_func(x - 1) + my_func(x - 2)


print(f"flag{{{my_func(100)}}}")
```

## Solution

This is a program that adds the previous two numbers in a sequence together to find the next number in the sequence.
The first 2 numbers are 1's.
This is also known as the Fibonacci Sequence.

### Solution by saving local dictionary of the sequence

```python
dict = {}

def my_func(x):
    # Note: Don't fall for the off by one
    if x == 0 or x == 1:
        return 1
    if x < 0:
        return 0
    if x-1 not in dict:
        # print("We have not yet calculated: " + str(x-1))
        dict[x-1] = my_func(x-1)
    if x-2 not in dict:
        # print("We have not yet calculated: " + str(x-2))
        dict[x-2] = my_func(x-2)
    result = dict[x - 1] + dict[x - 2]
    print(dict)
    return result
```

### Solution by listing all of the numbers in the Fibonacci Sequence

This way you need to add 2 to the argument ie. for x = 100 you need to find value at 102

```python
# Program to display the Fibonacci sequence up to n-th term

nterms = int(input("How many terms? "))

# first two terms
n1, n2 = 0, 1
count = 0

# check if the number of terms is valid
if nterms <= 0:
   print("Please enter a positive integer")
# if there is only one term, return n1
elif nterms == 1:
   print("Fibonacci sequence upto",nterms,":")
   print(n1)
# generate fibonacci sequence
else:
   print("Fibonacci sequence:")
   while count < nterms:
       print(n1)
       nth = n1 + n2
       # update values
       n1 = n2
       n2 = nth
       count += 1
```

Flag

```
flag{573147844013817084101}
```
