import os
import glob
import objc
from Foundation import NSURL, NSDictionary
import Vision
import Quartz

def ocr_image(image_path):
    url = NSURL.fileURLWithPath_(image_path)
    image = Quartz.CIImage.imageWithContentsOfURL_(url)
    if not image:
        return ""
    
    handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(image, {})
    request = Vision.VNRecognizeTextRequest.alloc().init()
    request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    
    success, error = handler.performRequests_error_([request], None)
    if not success or error:
        return ""
    
    results = request.results()
    lines = []
    if results:
        for obs in results[:15]:
            top = obs.topCandidates_(1)
            if top:
                lines.append(top[0].string())
    return " | ".join(lines)

files = sorted(glob.glob("book images/*.png"))
print(f"Scanning {len(files)} images...")
for f in files:
    text = ocr_image(f)
    print(f"{os.path.basename(f)} ===> {text[:140]}")
