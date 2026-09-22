import cv2
import urllib.request
import numpy as np

URL = "http://192.168.31.221:8080/shot.jpg"

print("Connecting to mobile camera...")

try:
    response = urllib.request.urlopen(URL, timeout=10)
    image_data = response.read()

    print("Received bytes:", len(image_data))

    image_array = np.frombuffer(
        image_data,
        dtype=np.uint8
    )

    frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if frame is None:
        print("Could not decode camera image.")
        exit()

    print("Camera frame received successfully.")
    print("Frame size:", frame.shape)

    cv2.imwrite("mobile_test.jpg", frame)

    print("Saved test image as mobile_test.jpg")
    print("Press any key in the camera window to close.")

    cv2.imshow("Mobile Camera Test", frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

except Exception as e:
    print("Camera test failed.")
    print("Error:", e)