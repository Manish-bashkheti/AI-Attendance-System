import cv2

model_path = "ai-server/models/face_recognition_sface_2021dec.onnx"

recognizer = cv2.FaceRecognizerSF.create(
    model_path,
    ""
)

print("SFace model loaded successfully!")