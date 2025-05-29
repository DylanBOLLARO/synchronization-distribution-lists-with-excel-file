import re
import unicodedata

def slugify(value: str) -> str:
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    value = re.sub(r'[\s_-]+', '_', value)
    return value

def harmonize_dict_keys(d: dict) -> dict:
    return {slugify(k): v for k, v in d.items()}