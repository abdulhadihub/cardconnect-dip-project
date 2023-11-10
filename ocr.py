import cv2
import pytesseract
import numpy as np
import matplotlib.pyplot as plt

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


image = cv2.imread('image_downloads/image_200.jpg')

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

# Display side-by-side comparison using Matplotlib
plt.figure(figsize=(10, 5))

# Original Image
plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(gray, cv2.COLOR_BGR2RGB))
plt.title('Grayscale Image')
plt.axis('off')

# Image after background removal
plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))
plt.title('Image with Background Removed')
plt.axis('off')

plt.show()

# Use pytesseract on the result
text = pytesseract.image_to_string(result)

print("Extracted Text:", text)