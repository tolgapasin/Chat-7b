import re
import html
from urllib.parse import unquote
import unicodedata

def sanitize_input(input: str, maxInputSize: int = 4000) -> str:
        # Length gate to avoid overwhelming the system
        input = input[:maxInputSize]

        # Decode HTML entities
        decodedQuery = html.unescape(input)

        decodedQuery = url_decode(decodedQuery)

        # Unicode normalization, collapse lookalike chars to canonical form
        decodedQuery = unicodedata.normalize("NFKC", decodedQuery)

        # Strip model control/separator tokens (<|im_start|>, <|user|>, etc.)
        sanitized_query = re.sub(r"<\|.*?\|>", "", decodedQuery)          
        sanitized_query = re.sub(r"</?s>|\[/?INST\]|###\s*(Human|Assistant|System)\s*:", 
                                "", sanitized_query, flags=re.IGNORECASE)

        # Remove invisible Unicode (zero-width chars used to hide injections)
        sanitized_query = re.sub(r"[\u200b-\u200f\u202a-\u202e\ufeff]", "", sanitized_query)

        return sanitized_query

def url_decode(input: str) -> str:
    # URL decode, loop until text is the same to handle double, triple, etc. encoding
    prevText = None
    while prevText != input:
        prevText = input
        input = unquote(input)
    return input