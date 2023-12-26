import cv2
import numpy as np
import pytesseract
from matplotlib import pyplot as plt
import json


class ImageProcessor:
    def __init__(self):
        pass
        

        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    def process_image(self, input_image, deskew=False, showROI=False, rectLength=50, rectWidth=5, minContourArea=5000, maxContourArea=1000000):
        self.rectLength = rectLength
        self.rectWidth = rectWidth
        self.minContourArea = minContourArea
        self.maxContourArea = maxContourArea

        # DESKEW
        if deskew:
            from deskew_image_module import ImageTransformer
            image_transformer = ImageTransformer(input_image)
            transformed_image = image_transformer.transform_image()
            return self._process_image_internal(transformed_image, showROI)
        else:
            return self._process_image_internal(input_image, showROI)

    def _process_image_internal(self, image, showROI):
        base_image = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # BLURRING
        blur = cv2.GaussianBlur(gray, (11, 11), 0)
        # THRESHOLDING
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (self.rectLength, self.rectWidth))
        # DILATION
        dilate = cv2.dilate(thresh, kernel, iterations=1)

        contours = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        contours = sorted(contours, key=lambda x: cv2.boundingRect(x)[1])
        results = []

        for c in contours:
            # SEGMENTATION
            x, y, w, h = cv2.boundingRect(c)
            contour_area = cv2.contourArea(c)
            min_contour_area = self.minContourArea
            max_contour_area = self.maxContourArea

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
                    if len(item) > 0:
                        item = item.strip()
                        results.append(item)
                    
        if showROI:
            plt.figure(figsize=(10,10))
            plt.subplot(311),plt.imshow(base_image, ),plt.title('Original')
            plt.subplot(312),plt.imshow(dilate, cmap='gray'),plt.title('Dilated')
            plt.subplot(313),plt.imshow(image),plt.title('With Boxes')
            plt.tight_layout()
            plt.show()

        entities = list(set(results))
        return entities
    

def main():
    input_image_path = "image_downloads/image_6.jpg"
    
    input_image = cv2.imread(input_image_path)
    image_processor = ImageProcessor()
    detected_entities = image_processor.process_image(input_image, False, False, 100, 50, 100000, 10000000000)
    print("Detected Entities:")
    # print(detected_entities)
    # print(image_processor.extract_info_from_text(" ".join(detected_entities)))

if __name__ == "__main__":
    main()
