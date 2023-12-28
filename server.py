from flask import Flask, request
from extract_text_module import ImageProcessor
from text_to_json_module import TextExtractor
import requests
import cv2
import numpy as np
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Welcome to CardConnect!'

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        data = request.get_json()
        image_url = data['image_url']
        # Download the image from the URL
        response = requests.get(image_url, stream=True).raw
        image_array = np.asarray(bytearray(response.read()), dtype="uint8")
        
        # Decode the image using OpenCV
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        
        image_processor = ImageProcessor()
        detected_entities = image_processor.process_image(image, False, False, 50, 5, 5000, 1000000)
        text_extractor = TextExtractor()
        extracted_data = text_extractor.extract_info_from_list(detected_entities)
        print(f"hello {extracted_data}")
        return extracted_data
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)