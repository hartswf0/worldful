from PIL import Image
import glob

for f in sorted(glob.glob("readable_book/assets/images/*.png"))[:6]:
    img = Image.open(f)
    print(f"{f}: size={img.size}, mode={img.mode}")
