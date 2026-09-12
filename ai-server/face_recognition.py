import cv2
import os

YUNET_MODEL = "ai-server/models/face_detection_yunet_2023mar.onnx"
SFACE_MODEL = "ai-server/models/face_recognition_sface_2021dec.onnx"
STUDENT_FOLDER = "ai-server/data/students/101_Manish"

detector = cv2.FaceDetectorYN.create(
    YUNET_MODEL,
    "",
    (320, 320)
)

recognizer = cv2.FaceRecognizerSF.create(
    SFACE_MODEL,
    ""
)

registered_embeddings = []

for filename in os.listdir(STUDENT_FOLDER):
    if not filename.endswith(".jpg"):
        continue

    image_path = os.path.join(STUDENT_FOLDER, filename)
    image = cv2.imread(image_path)

    if image is None:
        continue

    height, width = image.shape[:2]
    detector.setInputSize((width, height))

    _, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        continue

    face = faces[0]

    aligned_face = recognizer.alignCrop(image, face)
    embedding = recognizer.feature(aligned_face)

    registered_embeddings.append(embedding)

print(f"Registered face embeddings: {len(registered_embeddings)}")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Camera could not be opened!")
    exit()

print("Live face recognition started.")
print("Press 'q' to quit.")

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

            aligned_face = recognizer.alignCrop(frame, face)
            live_embedding = recognizer.feature(aligned_face)

            best_score = -1

            for registered_embedding in registered_embeddings:
                score = recognizer.match(
                    live_embedding,
                    registered_embedding,
                    cv2.FaceRecognizerSF_FR_COSINE
                )

                if score > best_score:
                    best_score = score

            if best_score >= 0.363:
                name = "Manish"
                student_id = "101"
            else:
                name = "Unknown"
                student_id = ""

            cv2.rectangle(
                frame,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"{name} {student_id}",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

    cv2.imshow("AI Attendance - Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()