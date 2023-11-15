import re
import json

class TextExtractor:
    def __init__(self):
        pass

    def extract_info_from_list(self, entity_list):
        

        # Define regular expressions for extracting information
        phone_pattern = re.compile(r'(\+\d{1,4}|\(\d{1,4}\)|\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})', re.IGNORECASE)
        email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)
        
        result = ''
        for string in entity_list:
            result += string + '\n'

        phone_match = phone_pattern.search(result)
        email_match = email_pattern.search(result)

        entity_info = {
            
            'phone': phone_match.group(0) if phone_match else None,
            'email': email_match.group(0) if email_match else None,
        }

        
        return json.dumps(entity_info, indent=4)
    
def main():
    text_extractor = TextExtractor()
    entity_list = """Najam ul Hassan
                    najamul@gmail.com
                    0923445677"""

    extracted_data = text_extractor.extract_info_from_list(entity_list)
    print(extracted_data)

if __name__ == "__main__":
    main()

