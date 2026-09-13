import cv2
import os

student_id = input("Enter student ID: ")
student_name = input("Enter student name: ")

student_folder = f"ai-server/data/students/{student_id}_{student_name}"
os.makedirs(student_folder, exist_ok=True)

model_path = "ai-server/models/face_detection_yunet_2023mar.onnx"

detector = cv2.FaceDetectorYN.create(
    model_path,
    "",
    (320, 320)
)

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Camera could not be opened!")
    exit()

print("Camera started.")
print("Press 's' to save a face image.")
print("Press 'q' to quit.")

image_count = 0

while True:
    ret, frame = cap.read()

    if not ret:
        print("Failed to receive frame!")
        break

    height, width = frame.shape[:2]
    detector.setInputSize((width, height))

    _, faces = detector.detect(frame)

    if faces is not None:
        for face in faces:
            x, y, w, h = face[:4].astype(int)

            cv2.rectangle(
                frame,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                2
            )

    cv2.imshow("Student Registration", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord("s"):
        if faces is not None and len(faces) > 0:
            image_count += 1

            file_path = f"{student_folder}/face_{image_count}.jpg"
            cv2.imwrite(file_path, frame)

            print(f"Face image {image_count} saved.")

            if image_count >= 5:
                print("Registration completed.")
                break
        else:
            print("No face detected. Please try again.")

    elif key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()