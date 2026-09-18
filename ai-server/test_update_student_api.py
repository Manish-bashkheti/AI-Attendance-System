import requests

url = "http://localhost:8080/students/103"

student_data = {
    "name": "Updated Student",
    "branch": "CSE",
    "semester": 7
}

response = requests.put(
    url,
    json=student_data
)

print("Status Code:", response.status_code)
print("Response:", response.text)