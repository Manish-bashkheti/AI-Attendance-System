import requests

url = "http://localhost:8080/students/103"

response = requests.delete(url)

print("Status Code:", response.status_code)
print("Response:", response.text)