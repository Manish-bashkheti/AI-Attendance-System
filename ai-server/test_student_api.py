import requests

url = "http://localhost:8080/students"

student_data = {
    "studentId": 103,
    "name": "Test Student",
    "branch": "CSE",
    "semester": 6
}

response = requests.post(
    url,
    json=student_data
)

print("Status Code:", response.status_code)
print("Response:", response.text)