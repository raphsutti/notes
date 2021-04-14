# X

- **Category:** beginner

## Challenge

>    All journeys have a single purpose - to get to another place. There are places everywhere, and the differences between them are less than you might think. Some places are no more than a state of mind.

Primes and number theory are a critical part of cryptography. Start this journey with a series of short puzzles to get a flag!

## Solution

### Challenge 1

* Challenge 1. Given N, e, p, q, C -> M

* Calculate the private exponent as
* d = mod_inv(e, (p-1)(q-1)
* Then decrypt as standard RSA as
* M = cipher ^ d mod N

### Challenge 2

* Challenge 2. Given N, phi(N) -> p

* phi satisfies p^2 -p*(N-phi+1) + N = 0
* This is a quadratic equation in p
* Solve with the "general formula solving quadratics" -b +/- sqrt(b^2-4ac)/2a where
* a=1, b= N-phi+1, c = n

### Challenge 3

* Challenge 3. Given N, p+q -> p

* Note that s = p+q satisfies
* phi = N - s + 1
* recover phi from s and then use the solution to challenge 2!

### Challenge 4

* Challenge 4. Given N, q-p -> p

* Note that if diff = q-p, sum = p+q, then
* p = (diff + sum)/2
* q = (sum - diff)/2
* N = pq = (diff + sum)/2 * (sum - diff)/2
* So 4N = sum^2 - diff^2

* So, given N and diff, recover sum and then use the solution to challenge 3!

### Challenge 5

* Challenge 5. Given N, e, d  -> p

* There is some maths behind this. Given that ed=1 mod phi(N), then ed-1 is a multiple of phi(N)
* Let k = ed-1, then k=2^t*r for some odd-integer r. Then g^k = 1 mod N for all g. So g^(k/2) is a square root of unity modulo N.
* So (g^k-1) = 0 mod N and then this factors as (g^(k/2)-1)(g^(k/2)+1) = 0 mod N. Hence, it is likely that GCD(g^(k/2)-1, N) = p
* Take a random g, and calculate the sequence x = g^(k/2), g^(k/4), ... g^(k/2^t)
* Check whether GCD(x-1, N) > 1 and is not N. If so, this will be one of the primes!
* If not, choose another g and start again.

* One other way to do this is to utilise the python Cryptodome library
* `Crypto.PublicKey.RSA.construct` can create an RSA private key given a tuple of (N,e,d).
* Then you can calculate `r=rsa.construct((N,e,d))` and print out `r.p`

Flag
```
cybears{2^82589933-1_15_pr1m3!}
```
