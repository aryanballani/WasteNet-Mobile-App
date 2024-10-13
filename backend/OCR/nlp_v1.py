# import re

# # Sample text from the Tesseract OCR output (replace with actual output)
# text = """
# ZUCHINNI GREEN $4.66
# 0.778kg NET @ $5.99/kg
# BANANA CAVENDISH $1.32
# 0.442kg NET @ $2.99/kg
# POTATOES BRUSHED $3.97
# 1.328kg NET @ $2.99/kg
# GRAPES GREEN $7.03
# 1.174kg NET @ $5.99/kg
# PEAS SNOW $3.27
# 0.218kg NET @ $14.99/kg
# """

# # Regular expression to match item names and quantities in kg
# def extract_items_and_weights(text):
#     # Refined pattern to capture item names and quantities in kilograms
#     pattern = r'([A-Za-z\s]+)\$\d+\.\d+\n(\d+\.\d+kg)'

#     # Find all matches
#     matches = re.findall(pattern, text)

#     # Clean and return the results
#     grocery_items = [{"item": match[0].strip(), "weight": match[1]} for match in matches]
#     return grocery_items

# # Extract the items and weights
# grocery_items = extract_items_and_weights(text)

# # Print the results
# for item in grocery_items:
#     print(f"Item: {item['item']}, Weight: {item['weight']}")
   
import spacy

# Load the small English model in spaCy
nlp = spacy.load("en_core_web_sm")

# Sample text from the Tesseract OCR output (replace with actual output)
text = """
ZUCHINNI GREEN $4.66
0.778kg NET @ $5.99/kg
BANANA CAVENDISH $1.32
0.442kg NET @ $2.99/kg
POTATOES BRUSHED $3.97
1.328kg NET @ $2.99/kg
GRAPES GREEN $7.03
1.174kg NET @ $5.99/kg
PEAS SNOW $3.27
0.218kg NET @ $14.99/kg
"""

# NLP-based extraction of item names and weights
def extract_items_and_weights_nlp(text):
    # Process the text with spaCy
    doc = nlp(text)
    
    grocery_items = []
    current_item = []
    current_weight = None

    # Iterate through the tokens in the processed text
    for token in doc:
        # Look for tokens that are numeric followed by "kg" for weight
        if "kg" in token.text:
            current_weight = token.text
        
        # Look for tokens that appear to be item names (not prices or other units)
        elif token.text.startswith('$'):
            if current_item and current_weight:
                grocery_items.append({"item": " ".join(current_item), "weight": current_weight})
            # Reset after finding the price
            current_item = []
            current_weight = None
        else:
            # Accumulate tokens that appear to be part of the item name
            current_item.append(token.text)

    # Add the last item if needed
    if current_item and current_weight:
        grocery_items.append({"item": " ".join(current_item), "weight": current_weight})
    
    return grocery_items

# Extract the items and weights using NLP
grocery_items = extract_items_and_weights_nlp(text)

# Print the results with numbering
for idx, item in enumerate(grocery_items, 1):
    print(f"{idx}. {item['item']}, Weight: {item['weight']}")
