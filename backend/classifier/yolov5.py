import torch

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')


def yolov5(image):
    results = model(image)
    return results.pandas().xyxy[0].values.tolist()
