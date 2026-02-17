# logic.py
import pandas as pd
from typing import List, Tuple

def hitung_logika(a_str: str, b_str: str, operasi: str) -> bool:
    a = (a_str == 'True')
    b = (b_str == 'True')

    if operasi == "AND":
        return a and b
    elif operasi == "OR":
        return a or b
    elif operasi == "XOR":
        return a ^ b
    elif operasi == "NAND":
        return not (a and b)
    elif operasi == "NOR":
        return not (a or b)
    elif operasi == "XNOR":
        return not (a ^ b)
    elif operasi == "NOT":
        return not a 
    return False

def buat_tabel_kebenaran(operasi: str) -> pd.DataFrame:
    data = [] # selected operations
    
    if operasi == "NOT":
        for a_str in ['False', 'True']:
            hasil = hitung_logika(a_str, 'False', operasi) 
            data.append({'A': int(a_str == 'True'), 'Output': int(hasil)})
    else:
        input_values: List[Tuple[str, str]] = [('False', 'False'), ('False', 'True'), ('True', 'False'), ('True', 'True')]
        for a_str, b_str in input_values:
            hasil = hitung_logika(a_str, b_str, operasi)
            data.append({
                'A': int(a_str == 'True'), 
                'B': int(b_str == 'True'), 
                'Output': int(hasil)
            })
            
    df = pd.DataFrame(data)
    return df