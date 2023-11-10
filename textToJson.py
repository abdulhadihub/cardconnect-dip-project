import re
import json

def extract_info(ocr_text):
    # Define regular expressions for extracting information
    
    phone_pattern = re.compile(r'\+(\d+ \d+ \d+)', re.IGNORECASE)
    email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)

    # Extract information using regular expressions
    
    phone_match = phone_pattern.search(ocr_text)
    email_match = email_pattern.search(ocr_text)

    # Create a dictionary to store the extracted information
    extracted_info = {
        
        'Phone': phone_match.group(1).strip() if phone_match else None,
        'Email': email_match.group(1).strip() if email_match else None,
    }

    return extracted_info

def save_to_json(data, json_path):
    #write to json file
    with open(json_path, 'w') as file:
        json.dump(data, file, indent=4)
        
# Provide the path to your OCR text file
ocr_text_file_path = '/home/najam/Documents/dip/CardConnect/cardconnect-dip-project/test.txt'

# Read OCR text from the file
with open(ocr_text_file_path, 'r') as file:
    ocr_text = file.read()

# Extract information from the OCR text
extracted_data = extract_info(ocr_text)

# Provide the desired path for the JSON file
json_output_path = '/home/najam/Documents/dip/CardConnect/cardconnect-dip-project/business_card_info.json'

# Save the extracted information to a JSON file
save_to_json(extracted_data, json_output_path)


