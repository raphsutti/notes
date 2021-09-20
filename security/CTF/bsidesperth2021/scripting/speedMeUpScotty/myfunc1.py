# dict = {2: 2, 3: 3, 4: 5, 5: 8, 6: 13, 7: 21, 8: 34, 9: 55, 10: 89, 11: 144, 12: 233, 13: 377, 14: 610, 15: 987, 16: 1597, 17: 2584, 18: 4181, 19: 6765, 20: 10946, 21: 17711, 22: 28657, 23: 46368, 24: 75025, 25: 121393, 26: 196418, 27: 317811, 28: 514229, 29: 832040}
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

print(f"flag{{{my_func(100)}}}")

