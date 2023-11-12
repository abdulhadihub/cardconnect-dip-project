import numpy as np
import cv2

class ImageTransformer:
    def __init__(self, image):
        self.image = image
        self.circles = np.zeros((4, 2), np.int64)
        self.counter = 0
        self.width, self.height = 450, 350

    def mouse_points(self, event, x, y, flags, params):
        if event == cv2.EVENT_LBUTTONDOWN:
            self.circles[self.counter] = x, y
            self.counter += 1
            print(self.circles)

    def transform_image(self):
        if self.image is None:
            print("Error: Unable to load the image.")
            return None

        # Resize the image to fit the screen
        height, width = self.image.shape[:2]
        scale_factor = min(1.0, 800 / max(width, height))
        resized_img = cv2.resize(self.image, None, fx=scale_factor, fy=scale_factor)

        # Create a window to display the image
        cv2.namedWindow("Image")

        # Set the callback function for mouse events
        cv2.setMouseCallback("Image", self.mouse_points)

        while True:
            if self.counter == 4:
                # Perform perspective transformation if all four points are selected
                pts1 = np.float32([self.circles[0], self.circles[1], self.circles[2], self.circles[3]])
                pts2 = np.float32([[0, 0], [self.width, 0], [0, self.height], [self.width, self.height]])
                matrix = cv2.getPerspectiveTransform(pts1, pts2)
                img_output = cv2.warpPerspective(resized_img, matrix, (self.width, self.height))
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

        return resized_img

def main():
    input_image_path = "image_downloads/image_540.jpg"
    image_transformer = ImageTransformer(input_image_path)
    transformed_image = image_transformer.transform_image()
    cv2.imwrite("temp/image_540_transformed.jpg", transformed_image)

if __name__ == "__main__":

    main()