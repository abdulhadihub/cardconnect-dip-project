from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World!'

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.get_json()
    image_data = data['image']
    # Process the image using your image processing logic
    # ...
    return {'result': 'Image processed successfully'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)