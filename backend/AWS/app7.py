import logging
import boto3
from botocore.exceptions import ClientError
from PIL import Image
# import pytesseract

# # If you are on Windows, specify the path to the Tesseract executable
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# # Open an image file
# img = Image.open('veggie-grocery-receipt_orig.jpeg')

# # Use pytesseract to extract text
# text = pytesseract.image_to_string(img)

# # Print the extracted text
# print(text)





logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def generate_conversation(bedrock_client,
                          model_id,
                          system_prompts,
                          messages):
    """
    Sends messages to a model.
    Args:
        bedrock_client: The Boto3 Bedrock runtime client.
        model_id (str): The model ID to use.
        system_prompts (JSON) : The system prompts for the model to use.
        messages (JSON) : The messages to send to the model.

    Returns:
        response (JSON): The conversation that the model generated.
    """

    logger.info("Generating message with model %s", model_id)

    # Inference parameters to use.
    temperature = 0.5
    top_k = 200

    # Base inference parameters to use.
    inference_config = {"temperature": temperature}
    # Additional inference parameters to use.
    additional_model_fields = {"top_k": top_k}

    # Send the message.
    response = bedrock_client.converse(
        modelId=model_id,
        messages=messages,
        system=system_prompts,
        inferenceConfig=inference_config,
        additionalModelRequestFields=additional_model_fields
    )

    # Log token usage.
    token_usage = response['usage']
    logger.info("Input tokens: %s", token_usage['inputTokens'])
    logger.info("Output tokens: %s", token_usage['outputTokens'])
    logger.info("Total tokens: %s", token_usage['totalTokens'])
    logger.info("Stop reason: %s", response['stopReason'])

    return response

def main():
    """
    Entrypoint for Anthropic Claude 3 Sonnet example.
    """

    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s: %(message)s")

    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    # Setup the system prompts and messages to send to the model.
    system_prompts = [{"text": 
                       """You are an NLP parser. You will be given a data like this
                       ZUCHINNI GREEN $4.66
                        0.778kg NET @ $5.99/kg
                        BANANA CAVENDISH $1.32
                        0.442kg NET @ $2.99/kg
                        POTATOES BRUSHED $3.97
                        1.328kg NET @ $2.99/kg
                        GRAPES GREEN $7.03
                        1.174kg NET @ $5.99/kg
                        PEAS SNOW $3.27. I want you to parse this by giving me the output in the following json format:
                        {
  "items": [
    {
      "name": "BANANA CAVENDISH",
      "weight": 1.326
    },
    {
      "name": "GRAPES GREEN",
      "weight": 3.522
    },
    {
      "name": "PEAS SNOW",
      "weight": 0.654
    },
    {
      "name": "POTATOES BRUSHED",
      "weight": 3.984
    },
    {
      "name": "ZUCHINNI GREEN",
      "weight": 2.334
    }
  ]
}"""}]

    # Define the user message directly as a variable
    user_text = "pls generate anything"

    # Create a message using the provided user input
    message_1 = {
        "role": "user",
        "content": [{"text": user_text}]
    }

    messages = []

    try:

        bedrock_client = boto3.client(service_name='bedrock-runtime')

        # Start the conversation with the 1st message.
        messages.append(message_1)
        response = generate_conversation(
            bedrock_client, model_id, system_prompts, messages)

        # Add the response message to the conversation.
        output_message = response['output']['message']
        messages.append(output_message)

        # Show the complete conversation.
        for message in messages:
            print(f"Role: {message['role']}")
            for content in message['content']:
                print(f"Text: {content['text']}")
            print()

    except ClientError as err:
        message = err.response['Error']['Message']
        logger.error("A client error occurred: %s", message)
        print(f"A client error occurred: {message}")

    else:
        print(f"Finished generating text with model {model_id}.")

if __name__ == "__main__":
    main()
