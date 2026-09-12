import cv2

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

print("Face detection started. Press 'q' to quit.")

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

    cv2.imshow("AI Attendance - Face Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()