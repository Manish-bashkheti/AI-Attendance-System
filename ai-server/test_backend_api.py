import requests

url = "http://localhost:8080/attendance"

attendance_data = {
    "studentId": 101,
    "classId": 1,
    "subjectId": 1,
    "attendanceDate": "2026-09-18",
    "status": "PRESENT",
    "markedTime": "13:55:00",
    "sessionId": 3
}

response = requests.post(url, json=attendance_data)

print("Status Code:", response.status_code)
print("Response:", response.text)