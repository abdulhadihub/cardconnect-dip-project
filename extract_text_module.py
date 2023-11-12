import cv2
import numpy as np
import pytesseract
from matplotlib import pyplot as plt

class ImageProcessor:
    def __init__(self):
        pass

        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    def process_image(self, input_image_path, deskew=False, showROI=False):
        input_image = cv2.imread(input_image_path)

        if deskew:
            # Assuming ImageTransformer is defined in a separate file
            from deskew_image_module import ImageTransformer

            # Create an instance of ImageTransformer
            image_transformer = ImageTransformer(input_image)

            # Transform the image
            transformed_image = image_transformer.transform_image()

            # Use the transformed image for processing
            return self._process_image_internal(transformed_image, showROI)
        else:
            # Process the image without deskewing
            return self._process_image_internal(input_image, showROI)

    def _process_image_internal(self, image, showROI):
        base_image = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (7, 7), 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 20))
        dilate = cv2.dilate(thresh, kernel, iterations=1)

        contours = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        contours = sorted(contours, key=lambda x: cv2.boundingRect(x)[1])
        results = []

        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            contour_area = cv2.contourArea(c)
            min_contour_area = 5000
            max_contour_area = 1000000

            # Filter contours based on size
            if min_contour_area < contour_area < max_contour_area:
                roi = base_image[y:y + h, x:x + w]
                cv2.rectangle(image, (x, y), (x + w, y + h), (36, 255, 12), 2)

                if showROI:
                    plt.imshow(roi)
                    plt.show()

                ocr_result = pytesseract.image_to_string(roi, lang='eng', config='--psm 6')
                ocr_result = ocr_result.split('\n')
                for item in ocr_result:
                    results.append(item)

        entities = []
        for item in results:
            item = item.strip().replace('\n', '').replace('\x0c', '')

            if len(item) > 0:
                print(item)
                entities.append(item)

        entities = list(set(entities))
        return entities


def main():
    input_image_path = "image_downloads/image_540.jpg"
    image_processor = ImageProcessor()
    detected_entities = image_processor.process_image(input_image_path, deskew=True, showROI=True)
    print("Detected Entities:")
    for entity in detected_entities:
        print(entity)

if __name__ == "__main__":
    main()
