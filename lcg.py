import sys

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
    # Get the state from command line arguments or prompt the user
    if len(sys.argv) > 1:
        try:
            initial_state = int(sys.argv[1])
        except ValueError:
            print("Error: Please provide a valid integer for the state.")
            return
    else:
        try:
            initial_state = int(input("Enter the current LCG state: "))
        except ValueError:
            print("Error: Input must be an integer.")
            return

    # Generate the next 10 numbers
    sequence = get_lcg_sequence(initial_state)
    
    print(f"\nInitial State: {initial_state}")
    print(f"{'Step':<5} | {'LCG State':<10} | {'Roulette Result (n % 37)':<20}")
    print("-" * 42)
    
    for i, val in enumerate(sequence, 1):
        # In your application, the roulette roll is derived using modulo 37
        roulette_result = val % 37
        print(f"{i:<5} | {val:<10} | {roulette_result:<20}")

if __name__ == "__main__":
    main()
