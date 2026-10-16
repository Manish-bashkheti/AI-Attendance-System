import cv2
import os
import requests
import time
import urllib.request
import numpy as np
import threading
import signal
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

YUNET_MODEL = os.path.join(
    BASE_DIR,
    "models",
    "face_detection_yunet_2023mar.onnx"
)

SFACE_MODEL = os.path.join(
    BASE_DIR,
    "models",
    "face_recognition_sface_2021dec.onnx"
)

STUDENTS_FOLDER = os.path.join(
    BASE_DIR,
    "data",
    "students"
)

BACKEND_URL = "http://localhost:8080/attendance"

# Mobile camera snapshot endpoint
CAMERA_URL = "http://172.21.138.159:8080/shot.jpg"

registered_students = {}
present_students = set()


# Browser video stream: serves the processed OpenCV frame as MJPEG.
STREAM_HOST = "0.0.0.0"
STREAM_PORT = 5001
latest_jpeg = None
frame_lock = threading.Lock()
stop_event = threading.Event()
stream_server = None


class VideoStreamHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/video_feed":
            self.send_error(404, "Not Found")
            return

        self.send_response(200)
        self.send_header("Age", "0")
        self.send_header("Cache-Control", "no-cache, private")
        self.send_header("Pragma", "no-cache")
        self.send_header("Content-Type", "multipart/x-mixed-replace; boundary=frame")
        self.end_headers()

        try:
            while True:
                with frame_lock:
                    frame_bytes = latest_jpeg

                if frame_bytes is None:
                    time.sleep(0.05)
                    continue

                self.wfile.write(b"--frame\r\n")
                self.wfile.write(b"Content-Type: image/jpeg\r\n")
                self.wfile.write(
                    f"Content-Length: {len(frame_bytes)}\r\n\r\n".encode("ascii")
                )
                self.wfile.write(frame_bytes)
                self.wfile.write(b"\r\n")
                time.sleep(0.03)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def log_message(self, format, *args):
        return


def start_video_stream_server():
    server = ThreadingHTTPServer((STREAM_HOST, STREAM_PORT), VideoStreamHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    print(f"Processed video stream: http://localhost:{STREAM_PORT}/video_feed")
    return server


def request_shutdown(signum=None, frame=None):
    """Ask the camera loop to stop; used for Ctrl+C and process termination."""
    stop_event.set()


attendance_started = False

current_session_id = None
current_class_id = None
current_subject_id = None

last_session_check = 0
SESSION_CHECK_INTERVAL = 2


def get_active_session():
    try:
        response = requests.get(
            "http://localhost:8080/attendance-sessions/active",
            timeout=5
        )

        if response.status_code == 200:
            return response.json()

        return None

    except requests.RequestException:
        return None


def sync_active_session():
    global attendance_started
    global current_session_id
    global current_class_id
    global current_subject_id

    session_data = get_active_session()

    if session_data is None:
        if attendance_started:
            attendance_started = False
            current_session_id = None
            current_class_id = None
            current_subject_id = None

            present_students.clear()

            print()
            print("Attendance session is no longer active.")

        return

    session_id = session_data["sessionId"]

    if not attendance_started or current_session_id != session_id:
        current_session_id = session_id
        current_class_id = session_data["classId"]
        current_subject_id = session_data["subjectId"]

        attendance_started = True
        present_students.clear()

        print()
        print("Active attendance session detected.")
        print(f"Session ID: {current_session_id}")
        print(f"Class ID: {current_class_id}")
        print(f"Subject ID: {current_subject_id}")
        print("AI attendance is now active.")


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

        if response.status_code in (200, 201, 204):
            print(f"Attendance marked successfully: {student_id}")
            return True
        if response.status_code == 409:
            print(f"Attendance already marked: {student_id}")
            return True

        print(f"Attendance API error: {response.status_code} - {response.text}")
        return False

    except requests.RequestException as exception:
        print(f"Could not connect to backend: {exception}")
        return False


def mark_present(student_id, student_name):
    if not attendance_started:
        return

    if student_id in present_students:
        return

    succeeded = send_attendance(student_id, current_session_id)
    if not succeeded:
        # Do not cache a failed attempt; the next frame can retry.
        return

    present_students.add(student_id)
    current_time = datetime.now().strftime("%H:%M:%S")
    print(f"Attendance marked: {student_name} ({student_id}) at {current_time}")


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
                    print(
                        f"{name} ({student_id}) - PRESENT"
                    )
                else:
                    print(
                        f"{name} ({student_id}) - ABSENT"
                    )

            print()

        else:
            print(
                f"Could not finish attendance session: "
                f"{response.status_code} - {response.text}"
            )

    except requests.RequestException as exception:
        print(
            f"Could not connect to backend: "
            f"{exception}"
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

    student_id, student_name = student_folder.split(
        "_",
        1
    )

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
# Mobile camera connection
# --------------------------------------------------

print()
print("Connecting to mobile camera...")
print(f"Camera URL: {CAMERA_URL}")

try:
    with urllib.request.urlopen(CAMERA_URL, timeout=10) as camera_response:
        camera_response.read(1)
    print("Mobile camera connected successfully.")

except Exception as exception:

    print("Could not connect to mobile camera.")
    print(f"Error: {exception}")
    exit()


print()
print("Mobile AI face recognition started.")
print("Press 'q' to quit.")
signal.signal(signal.SIGINT, request_shutdown)
if hasattr(signal, "SIGTERM"):
    signal.signal(signal.SIGTERM, request_shutdown)
stream_server = start_video_stream_server()


# --------------------------------------------------
# Main camera loop
# --------------------------------------------------

while not stop_event.is_set():

    try:
        with urllib.request.urlopen(CAMERA_URL, timeout=5) as response:
            image_data = response.read()

        image_array = np.frombuffer(
            image_data,
            dtype=np.uint8
        )

        frame = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if frame is None:
            print("Could not decode mobile camera frame.")
            continue

    except Exception as exception:

        print(
            f"Failed to receive mobile camera frame: "
            f"{exception}"
        )

        time.sleep(1)
        continue


    # ----------------------------------------------
    # Check active attendance session
    # ----------------------------------------------

    current_time = time.time()

    if (
        current_time - last_session_check
        >= SESSION_CHECK_INTERVAL
    ):

        sync_active_session()

        last_session_check = current_time


    # ----------------------------------------------
    # Face detection
    # ----------------------------------------------

    height, width = frame.shape[:2]

    detector.setInputSize(
        (width, height)
    )

    _, faces = detector.detect(frame)


    if faces is not None:

        for face in faces:

            x, y, w, h = face[:4].astype(int)


            # --------------------------------------
            # Generate live face embedding
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
            # Compare with registered students
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
                # Mark attendance only when active
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
                (x, max(y - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )


    # ----------------------------------------------
    # Publish the processed frame to the browser
    # ----------------------------------------------

    success, encoded_frame = cv2.imencode(
        ".jpg",
        frame,
        [int(cv2.IMWRITE_JPEG_QUALITY), 75]
    )
    if success:
        with frame_lock:
            latest_jpeg = encoded_frame.tobytes()

    # ----------------------------------------------
    # Show mobile camera
    # ----------------------------------------------

    # The dashboard displays this processed stream; no separate OpenCV window is required.
    # Press Ctrl+C or terminate the Python process to stop the service.


# --------------------------------------------------
# Cleanup
# --------------------------------------------------

cv2.destroyAllWindows()