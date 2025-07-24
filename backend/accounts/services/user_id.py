import random

def GENERATE_USER_ID(role: str) -> str:
    role_prefixes = {
        'admin': 'A',
        'e-commerce': 'E',
        'crypto': 'C',
    }

    prefix = role_prefixes.get(role.lower())
    if not prefix:
        raise ValueError("Invalid role provided. Must be 'admin' 'crypto' or 'e-commerce'.")

    random_number = random.randint(1000000, 9999999)
    return f"{prefix}-{random_number}"
