import cv2
import pytesseract
import numpy as np
import matplotlib.pyplot as plt

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def showImage(imageBefore, imageAfter, titleBefore, titleAfter, text=''):
    # Display side-by-side comparison using Matplotlib
    plt.figure(figsize=(12, 6))

    # Original Image
    plt.subplot(1, 2, 1)
    plt.imshow(cv2.cvtColor(imageBefore, cv2.COLOR_BGR2RGB))
    plt.title(titleBefore)
    plt.axis('off')

    # Image with background removed and extracted text as annotation
    plt.subplot(1, 2, 2)
    plt.imshow(cv2.cvtColor(imageAfter, cv2.COLOR_BGR2RGB))
    plt.title(titleAfter)
    plt.axis('off')

    plt.figure(figsize=(6, 3))
    plt.text(0.5, 0.5, text, ha='center', va='center', fontsize=12)
    plt.axis('off')
    plt.show()




def performOCR(imagePath):
    image = cv2.imread(imagePath)

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to reduce noise and improve accuracy of contour detection
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Use adaptive thresholding to create a binary image
    _, binary_image = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours in the binary image
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the contour with the largest area (assuming the business card is the largest object)
    largest_contour = max(contours, key=cv2.contourArea)

    # Create a mask for the business card
    mask = cv2.drawContours(np.zeros_like(gray), [largest_contour], 0, 255, thickness=cv2.FILLED)
    mask_inv = cv2.bitwise_not(mask)

    # Bitwise AND operation to get the business card region
    result = cv2.bitwise_and(image, image, mask=mask_inv)

    # Use pytesseract on the result
    text = pytesseract.image_to_string(result)

    # show image comparison with text extracted
    
    # showImage(image, result, 'Original Image', 'Image after background removal', text)

    return text

def createTestImagePaths(start, end):
    paths = []
    for i in range(start, end+1):
        paths.append('image_downloads/image_' + str(i) + '.jpg')
    return paths

def main():
    imagePaths = createTestImagePaths(6, 10)
    for imagePath in imagePaths:
        text = performOCR(imagePath)
        print('Text from Image: ' + imagePath)
        print(text)

main()