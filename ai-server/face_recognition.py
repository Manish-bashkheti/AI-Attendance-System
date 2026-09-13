import cv2
import os
from datetime import datetime

YUNET_MODEL = "ai-server/models/face_detection_yunet_2023mar.onnx"
SFACE_MODEL = "ai-server/models/face_recognition_sface_2021dec.onnx"
STUDENTS_FOLDER = "ai-server/data/students"

registered_students = {}
present_students = set()
attendance_started = False


def start_attendance():
    global attendance_started

    attendance_started = True
    present_students.clear()

    print()
    print("Attendance session started.")
    print("Students can now be marked present.")


def mark_present(student_id, student_name):
    if not attendance_started:
        return

    if student_id in present_students:
        return

    present_students.add(student_id)

    current_time = datetime.now().strftime("%H:%M:%S")

    print(
        f"Attendance marked: {student_name} ({student_id}) "
        f"at {current_time}"
    )


def finish_attendance():
    global attendance_started

    if not attendance_started:
        print("Attendance session has not started.")
        return

    attendance_started = False

    print()
    print("Attendance session finished.")
    print()

    for student_id, student_data in registered_students.items():

        name = student_data["name"]

        if student_id in present_students:
            print(f"{name} ({student_id}) - PRESENT")
        else:
            print(f"{name} ({student_id}) - ABSENT")

    print()


# --------------------------------------------------
# Load YuNet face detection model
# --------------------------------------------------

detector = cv2.FaceDetectorYN.create(
    YUNET_MODEL,
    "",
    (320, 320)
)


# --------------------------------------------------
# Load SFace face recognition model
# --------------------------------------------------

recognizer = cv2.FaceRecognizerSF.create(
    SFACE_MODEL,
    ""
)


# --------------------------------------------------
# Load registered students
# --------------------------------------------------

for student_folder in os.listdir(STUDENTS_FOLDER):

    folder_path = os.path.join(
        STUDENTS_FOLDER,
        student_folder
    )

    if not os.path.isdir(folder_path):
        continue

    if "_" not in student_folder:
        continue

    student_id, student_name = student_folder.split("_", 1)

    embeddings = []

    for filename in os.listdir(folder_path):

        if not filename.endswith(".jpg"):
            continue

        image_path = os.path.join(
            folder_path,
            filename
        )

        image = cv2.imread(image_path)

        if image is None:
            continue

        height, width = image.shape[:2]

        detector.setInputSize(
            (width, height)
        )

        _, faces = detector.detect(image)

        if faces is None or len(faces) == 0:
            continue

        face = faces[0]

        aligned_face = recognizer.alignCrop(
            image,
            face
        )

        embedding = recognizer.feature(
            aligned_face
        )

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


print(
    f"Total registered students: "
    f"{len(registered_students)}"
)


# --------------------------------------------------
# Start camera
# --------------------------------------------------

cap = cv2.VideoCapture(0)

if not cap.isOpened():

    print("Camera could not be opened!")
    exit()


print()
print("Live face recognition started.")
print("Press 's' to start attendance.")
print("Press 'f' to finish attendance.")
print("Press 'q' to quit.")


# --------------------------------------------------
# Main camera loop
# --------------------------------------------------

while True:

    ret, frame = cap.read()

    if not ret:

        print("Failed to receive frame!")
        break


    height, width = frame.shape[:2]

    detector.setInputSize(
        (width, height)
    )

    _, faces = detector.detect(frame)


    if faces is not None:

        for face in faces:

            x, y, w, h = face[:4].astype(int)


            # --------------------------------------
            # Generate embedding for live face
            # --------------------------------------

            aligned_face = recognizer.alignCrop(
                frame,
                face
            )

            live_embedding = recognizer.feature(
                aligned_face
            )


            best_score = -1
            best_student_id = None
            best_student = None


            # --------------------------------------
            # Compare with all registered students
            # --------------------------------------

            for student_id, student_data in registered_students.items():

                for registered_embedding in student_data["embeddings"]:

                    score = recognizer.match(
                        live_embedding,
                        registered_embedding,
                        cv2.FaceRecognizerSF_FR_COSINE
                    )

                    if score > best_score:

                        best_score = score
                        best_student_id = student_id
                        best_student = student_data


            # --------------------------------------
            # Identify student
            # --------------------------------------

            if (
                best_score >= 0.363
                and best_student is not None
            ):

                name = best_student["name"]

                label = (
                    f"{name} "
                    f"({best_student_id})"
                )


                # ----------------------------------
                # Mark attendance only when session
                # is active
                # ----------------------------------

                if attendance_started:

                    mark_present(
                        best_student_id,
                        name
                    )

            else:

                label = "Unknown"


            # --------------------------------------
            # Draw face rectangle
            # --------------------------------------

            cv2.rectangle(
                frame,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                2
            )


            # --------------------------------------
            # Draw student name
            # --------------------------------------

            cv2.putText(
                frame,
                label,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )


    # ------------------------------------------
    # Show camera
    # ------------------------------------------

    cv2.imshow(
        "AI Attendance - Face Recognition",
        frame
    )


    # ------------------------------------------
    # Keyboard controls
    # ------------------------------------------

    key = cv2.waitKey(1) & 0xFF


    if key == ord("s"):

        if attendance_started:

            print("Attendance is already running.")

        else:

            start_attendance()


    elif key == ord("f"):

        finish_attendance()


    elif key == ord("q"):

        break


# --------------------------------------------------
# Cleanup
# --------------------------------------------------

cap.release()
cv2.destroyAllWindows()