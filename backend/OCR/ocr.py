from PIL import Image
import pytesseract

# If you are on Windows, specify the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Open an image file
img = Image.open('veggie-grocery-receipt_orig.jpeg')

# Use pytesseract to extract text
text = pytesseract.image_to_string(img)

# Print the extracted text
print(text)

