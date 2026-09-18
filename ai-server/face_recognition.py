import cv2
import os
import requests
from datetime import datetime

YUNET_MODEL = "ai-server/models/face_detection_yunet_2023mar.onnx"
SFACE_MODEL = "ai-server/models/face_recognition_sface_2021dec.onnx"
STUDENTS_FOLDER = "ai-server/data/students"

BACKEND_URL = "http://localhost:8080/attendance"

registered_students = {}
present_students = set()
attendance_started = False

current_session_id = None
current_class_id = None
current_subject_id = None
def get_active_session():
    try:
        response = requests.get(
            "http://localhost:8080/attendance-sessions/active",
            timeout=5
        )

        if response.status_code == 200:
            session_data = response.json()

            return session_data

        print(
            f"Could not get active session: "
            f"{response.status_code} - {response.text}"
        )

    except requests.RequestException as exception:
        print(f"Could not connect to backend: {exception}")

    return None


def send_attendance(student_id, session_id):
    attendance_data = {
        "studentId": int(student_id),
        "classId": int(current_class_id),
        "subjectId": int(current_subject_id),
        "attendanceDate": datetime.now().strftime("%Y-%m-%d"),
        "status": "PRESENT",
        "markedTime": datetime.now().strftime("%H:%M:%S"),
        "sessionId": int(session_id)
    }

    try:
        response = requests.post(
            BACKEND_URL,
            json=attendance_data,
            timeout=5
        )

        if response.status_code == 200:
            print(
                f"Attendance sent successfully for student {student_id}."
            )

        elif response.status_code == 409:
            print(
                f"Attendance already marked for student {student_id}."
            )

        else:
            print(
                f"Attendance API error: "
                f"{response.status_code} - {response.text}"
            )

    except requests.RequestException as exception:
        print(
            f"Could not connect to backend: {exception}"
        )

def start_attendance():
    global attendance_started
    global current_session_id
    global current_class_id
    global current_subject_id

    session_data = get_active_session()

    if session_data is None:
        print()
        print("No active attendance session found.")
        print("Start an attendance session from the backend first.")
        return

    current_session_id = session_data["sessionId"]
    current_class_id = session_data["classId"]
    current_subject_id = session_data["subjectId"]

    attendance_started = True
    present_students.clear()

    print()
    print("Attendance session started.")
    print(f"Active session ID: {current_session_id}")
    print(f"Class ID: {current_class_id}")
    print(f"Subject ID: {current_subject_id}")
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

    send_attendance(
        student_id,
        current_session_id
    )


def finish_attendance():
    global attendance_started

    if not attendance_started:
        print("Attendance session has not started.")
        return

    try:
        response = requests.post(
            f"http://localhost:8080/attendance-sessions/"
            f"{current_session_id}/finish",
            timeout=5
        )

        if response.status_code == 200:
            attendance_started = False

            print()
            print("Attendance session finished successfully.")
            print(f"Session ID: {current_session_id}")
            print()

            for student_id, student_data in registered_students.items():

                name = student_data["name"]

                if student_id in present_students:
                    print(f"{name} ({student_id}) - PRESENT")
                else:
                    print(f"{name} ({student_id}) - ABSENT")

            print()

        else:
            print(
                f"Could not finish attendance session: "
                f"{response.status_code} - {response.text}"
            )

    except requests.RequestException as exception:
        print(
            f"Could not connect to backend: {exception}"
        )


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