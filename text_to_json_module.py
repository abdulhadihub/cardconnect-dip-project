import re
import json
import spacy

class TextExtractor:
    phone_pattern = re.compile(r'(\+\d{1,4}|\(\d{1,4}\)|\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})', re.IGNORECASE)
    email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def extract_info_from_list(self, entity_list):
        result = ' '.join(entity_list)
        doc = self.nlp(result)
        

        entity_info = {
            'names': [ent.text for ent in doc.ents if ent.label_ == 'PERSON'],
            'addresses': [ent.text for ent in doc.ents if ent.label_ == 'GPE'],
            'phone': [match.group(0) for match in self.phone_pattern.finditer(result)],
            'email': [match.group(0) for match in self.email_pattern.finditer(result)],
        }

        return json.dumps(entity_info, indent=4)

def main():
    text_extractor = TextExtractor()
    entity_list = [
        "Bill Gates",
        "bill@gmail.com",
        "0923445677"
    ]

    extracted_data = text_extractor.extract_info_from_list(entity_list)
    print(extracted_data)

if __name__ == "__main__":
    main()