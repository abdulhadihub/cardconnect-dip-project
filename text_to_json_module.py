import re
import json

class TextExtractor:
    def __init__(self):
        pass

    def extract_info_from_list(self, entity_list):
        # Define regular expressions for extracting information
        phone_pattern = re.compile(r'(\+\d{1,4}|\(\d{1,4}\)|\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})', re.IGNORECASE)
        email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)

        # Extract information using regular expressions
        extracted_info = {
            'entities': []
        }

        for entity in entity_list:
            phone_match = phone_pattern.search(entity)
            email_match = email_pattern.search(entity)

            entity_info = {
                'Entity': entity,
                'Phone': phone_match.group(0) if phone_match else None,
                'Email': email_match.group(0) if email_match else None,
            }

            extracted_info['entities'].append(entity_info)

        return json.dumps(extracted_info, indent=4)
    
def main():
    text_extractor = TextExtractor()
    entity_list = ["John Doe: 123-456-7890", "Jane Smith: 987-654-3210"]
    extracted_data = text_extractor.extract_info_from_list(entity_list)
    print(extracted_data)

if __name__ == "__main__":
    main()

