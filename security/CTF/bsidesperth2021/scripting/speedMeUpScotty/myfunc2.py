"""
Example:
> my_func2('ABAAABBCCACBBBBCBCBCBBBBACBCBCCBBBBCBBBBCAACCABCAACABACACCAB', 'CCCBAABAACCCAABABBCCABBCBCABAABAABCABACACACABABBBCACBACBABCC')
CCCBBCCCBABBCCBBCBBBBCAACCACAACABACACC
"""


def my_func2_inner(x, y, a, b):
    if a == 0 or b == 0:
        return 0, ""
    if x[a - 1] == y[b - 1]:
        m, n = my_func2_inner(x, y, a - 1, b - 1)
        return m + 1, n + x[a - 1]
    return max(my_func2_inner(x, y, a, b - 1), my_func2_inner(x, y, a - 1, b))


def my_func2(x, y):
    return my_func2_inner(x, y, len(x), len(y))[1]


print(
    f"flag{{{my_func2('CCABBCBACABBABACACBBBCBCABABBAABACBCAAACBBCCCBBABBBACCBBBBAB', 'ACCCCBCBCBBCBABBCACCCBBAABCCCCAAABBAABACAAABCBABBCCBCAACCCAA')}}}"
)
