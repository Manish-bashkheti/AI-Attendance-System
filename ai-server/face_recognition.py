import cv2
import os

YUNET_MODEL = "ai-server/models/face_detection_yunet_2023mar.onnx"
SFACE_MODEL = "ai-server/models/face_recognition_sface_2021dec.onnx"
STUDENTS_FOLDER = "ai-server/data/students"

detector = cv2.FaceDetectorYN.create(
    YUNET_MODEL,
    "",
    (320, 320)
)

recognizer = cv2.FaceRecognizerSF.create(
    SFACE_MODEL,
    ""
)

registered_students = {}

for student_folder in os.listdir(STUDENTS_FOLDER):

    folder_path = os.path.join(STUDENTS_FOLDER, student_folder)

    if not os.path.isdir(folder_path):
        continue

    if "_" not in student_folder:
        continue

    student_id, student_name = student_folder.split("_", 1)

    embeddings = []

    for filename in os.listdir(folder_path):

        if not filename.endswith(".jpg"):
            continue

        image_path = os.path.join(folder_path, filename)
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

        embeddings.append(embedding)

    if len(embeddings) > 0:

        registered_students[student_id] = {
            "name": student_name,
            "embeddings": embeddings
        }

        print(
            f"Loaded {student_name} ({student_id}) "
            f"with {len(embeddings)} face embeddings"
        )

print(f"Total registered students: {len(registered_students)}")

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
            best_student = None

            for student_id, student_data in registered_students.items():

                for registered_embedding in student_data["embeddings"]:

                    score = recognizer.match(
                        live_embedding,
                        registered_embedding,
                        cv2.FaceRecognizerSF_FR_COSINE
                    )

                    if score > best_score:
                        best_score = score
                        best_student = student_data

            if best_score >= 0.363 and best_student is not None:

                name = best_student["name"]
                student_id = next(
                    student_id
                    for student_id, data in registered_students.items()
                    if data is best_student
                )

                label = f"{name} ({student_id})"

            else:

                label = "Unknown"

            cv2.rectangle(
                frame,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                label,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

    cv2.imshow("AI Attendance - Multiple Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()