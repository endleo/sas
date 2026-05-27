from functools import reduce
from math import gcd

def crack_unknown_increment(states, modulus, multiplier):
    increment = (states[1] - states[0]*multiplier) % modulus
    return modulus, multiplier, increment

def crack_unknown_multiplier(states, modulus):
    multiplier = (states[2] - states[1]) * modinv((states[1] - states[0]) % modulus, modulus) % modulus
    return crack_unknown_increment(states, modulus, multiplier)

def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, x, y = egcd(b % a, a)
        return (g, y - (b // a) * x, x)

def modinv(b, n):
    # if b < 0:
    #     b += 0xFFFF
    g, x, _ = egcd(b, n)
    if g == 1:
        return x % n

    print(f"{b} does not have a modular inverse mod {n}")


def crack_unknown_modulus(states):
    diffs = [s1 - s0 for s0, s1 in zip(states, states[1:])]
    zeroes = [t2*t0 - t1*t1 for t0, t1, t2 in zip(diffs, diffs[1:], diffs[2:])]
    modulus = abs(reduce(gcd, zeroes))
    return crack_unknown_multiplier(states, modulus)

def get_lcg_sequence(seed, count=10):
    """
    Implements a Linear Congruential Generator (LCG).
    
    Parameters:
    - Multiplier (a): 75
    - Increment (c): 0
    - Modulus (m): 2^16 + 1 (65537)
    """
    multiplier = 75
    increment = 0
    modulus = 2**16 + 1
    
    results = []
    current_state = seed
    
    for _ in range(count):
        # LCG Formula: X_{n+1} = (a * X_n + c) % m
        current_state = (current_state * multiplier + increment) % modulus
        results.append(current_state)
        
    return results

def main():
    # Fill in the 'state' variable you receive in the request answer
    STATES = [34002, 59744, 24284]
    MODULUS = 65537
    modulus, multiplier, increment = crack_unknown_multiplier(STATES, MODULUS)
    # Generate the next 10 numbers
    initial_state = STATES[-1]
    sequence = get_lcg_sequence(initial_state)
    
    print(f"\Current State: {initial_state}")
    print(f"{'Step':<5} | {'LCG State':<10} | {'Roulette Result (n % 37)':<20}")
    print("-" * 42)
    
    for i, val in enumerate(sequence, 1):
        # In your application, the roulette roll is derived using modulo 37
        roulette_result = val % 37
        print(f"{i:<5} | {val:<10} | {roulette_result:<20}")

if __name__ == "__main__":
    main()
