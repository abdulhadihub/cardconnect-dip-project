import os
import re
import json

def extract_info(ocr_text):
    # Define regular expressions for extracting information
    phone_pattern = re.compile(r'(\+\d{1,4}|\(\d{1,4}\)|\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})', re.IGNORECASE)
    email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)

    # Extract information using regular expressions
    phone_match = phone_pattern.search(ocr_text)
    email_match = email_pattern.search(ocr_text)

    # Create a dictionary to store the extracted information
    extracted_info = {
        'Phone': phone_match.group(0) if phone_match else None,
        'Email': email_match.group(0)if email_match else None,
    }

    return extracted_info

def save_to_json(data, json_path):
    # Write to a json file
    with open(json_path, 'w') as file:
        json.dump(data, file, indent=4)

def process_files(folder_path, output_folder):
    # Iterate over all files in the folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # Check if the item is a file (not a subfolder)
        if os.path.isfile(file_path):
            with open(file_path, 'r') as file:
                ocr_text = file.read()

            # Extract information from the OCR text
            extracted_data = extract_info(ocr_text)

            # Create a JSON file for each processed text file
            json_output_path = os.path.join(output_folder, f'{os.path.splitext(filename)[0]}.json')
            save_to_json(extracted_data, json_output_path)

# Provide the path to your folder containing text files
input_folder_path = 'extracted_text'

# Provide the path to the folder where you want to save the JSON files
output_folder_path = 'text_to_json'

# Process all files in the input folder and save JSON files in the output folder
process_files(input_folder_path, output_folder_path)
