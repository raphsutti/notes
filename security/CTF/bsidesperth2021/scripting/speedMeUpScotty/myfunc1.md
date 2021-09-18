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

```python
dict = {}

def my_func(x):
    for _ in range(5):
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

print(f"flag{{{my_func(100)}}}")
```

Flag
```
flag{573147844013817084101}
```



