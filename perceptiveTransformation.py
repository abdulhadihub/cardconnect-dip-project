import numpy as np
import cv2

# Define constants for better readability
NUM_CIRCLES = 4
WIDTH, HEIGHT = 450, 350

# Initialize variables
circles = np.zeros((NUM_CIRCLES, 2), np.int64)
counter = 0

def mouse_points(event, x, y, flags, params):
    global counter

    if event == cv2.EVENT_LBUTTONDOWN:
        circles[counter] = x, y
        counter += 1
        print(circles)

def main():
    # Load the image
    img = cv2.imread('/home/najam/Documents/dip/card_connect_new/cardconnect-dip-project/image_downloads/image_7.jpg')

    # Check if the image is loaded successfully
    if img is None:
        print("Error: Unable to load the image.")
        return

    # Resize the image to fit the screen
    height, width = img.shape[:2]
    scale_factor = min(1.0, 800 / max(width, height))
    resized_img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor)

    # Create a window to display the image
    cv2.namedWindow("Image")

    # Set the callback function for mouse events
    cv2.setMouseCallback("Image", mouse_points)

    while True:
        if counter == NUM_CIRCLES:
            # Perform perspective transformation if all four points are selected
            pts1 = np.float32([circles[0], circles[1], circles[2], circles[3]])
            pts2 = np.float32([[0, 0], [WIDTH, 0], [0, HEIGHT], [WIDTH, HEIGHT]])
            matrix = cv2.getPerspectiveTransform(pts1, pts2)
            img_output = cv2.warpPerspective(resized_img, matrix, (WIDTH, HEIGHT))
            cv2.imshow("Output", img_output)

        # Display the original image
        cv2.imshow("Image", resized_img)

        # Wait for a key press
        key = cv2.waitKey(1)

        # Break the loop if 'q' is pressed
        if key == ord('q'):
            break

    # Release resources
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
