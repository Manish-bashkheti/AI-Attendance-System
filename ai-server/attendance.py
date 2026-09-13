import os
from datetime import datetime

STUDENTS_FOLDER = "ai-server/data/students"

registered_students = {}


# Load all registered students
for student_folder in os.listdir(STUDENTS_FOLDER):

    folder_path = os.path.join(STUDENTS_FOLDER, student_folder)

    if not os.path.isdir(folder_path):
        continue

    if "_" not in student_folder:
        continue

    student_id, student_name = student_folder.split("_", 1)

    registered_students[student_id] = student_name


print(f"Total registered students: {len(registered_students)}")

for student_id, student_name in registered_students.items():
    print(f"Student: {student_name} ({student_id})")


present_students = set()
attendance_started = False


def start_attendance():
    global attendance_started

    attendance_started = True
    present_students.clear()

    print()
    print("Attendance session started.")
    print("Students can now be marked present.")


def mark_present(student_id):
    if not attendance_started:
        return

    if student_id not in registered_students:
        return

    if student_id in present_students:
        return

    present_students.add(student_id)

    student_name = registered_students[student_id]
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

    for student_id, student_name in registered_students.items():

        if student_id in present_students:
            print(f"{student_name} ({student_id}) - PRESENT")
        else:
            print(f"{student_name} ({student_id}) - ABSENT")


print()
print("Press 's' to start attendance.")
print("Press 'f' to finish attendance.")
print("Press 'q' to quit.")

while True:

    key = input("Enter command: ").lower()

    if key == "s":

        if attendance_started:
            print("Attendance is already running.")
        else:
            start_attendance()

            # Temporary test:
            # We will connect this with face recognition later.
            mark_present("101")

    elif key == "f":

        finish_attendance()

    elif key == "q":

        print("Program closed.")
        break

    else:

        print("Invalid command.")