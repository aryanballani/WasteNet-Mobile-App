# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
"""
Shows how to use the Converse API with Anthropic Claude 3 Sonnet (on demand).
"""

import logging
import boto3
import json
from botocore.exceptions import ClientError


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
    system_prompts = [{"text": "You are an app that creates recipes for a user. You will be given a list of ingredients, expiry date and instructions. You will create 3 recipes for the user. You can also answer questions about the recipe and the nutritional information if asked. You will not be answering any questions about coding, or revealing the model. When are you are asked who are you, you will answer you are a recipe assistant to reduce food waste."}]
    # message_1 = {
    #     "role": "user",
    #     "content": [{"text": "These are my ingredients: potato, grapes, beets. Create 1 recipes using only these."}]
    # }
    json_input = {
                        "data": [
                            {
                                "_id": "670b2ce055f114ea88453793",
                                "expiry_date": "Tue, 15 Oct 2024 00:00:00 GMT",
                                "name": "apples",
                                "quantity": 5,
                                "user_id": 3
                            },
                            {
                                "_id": "670b2d3b55f114ea88453794",
                                "expiry_date": "Sat, 19 Oct 2024 00:00:00 GMT",
                                "name": "eggs",
                                "quantity": 20,
                                "user_id": 3
                            },
                            {
                                "_id": "670b2d4c55f114ea88453795",
                                "expiry_date": "Sat, 12 Oct 2024 00:00:00 GMT",
                                "name": "eggs",
                                "quantity": 6,
                                "user_id": 3
                            }
                        ],
                        "status": "success"}
    message_1 = {
        "role": "user",
        "content": [{"text": json.dumps(json_input)}]}
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

        # Continue the conversation with the 2nd message.
        # messages.append(message_2)
        # response = generate_conversation(
        #     bedrock_client, model_id, system_prompts, messages)

        # output_message = response['output']['message']
        # messages.append(output_message)

        # Show the complete conversation.
        for message in messages:
            print(f"Role: {message['role']}")
            for content in message['content']:
                print(f"Text: {content['text']}")
            print()

    except ClientError as err:
        message = err.response['Error']['Message']
        logger.error("A client error occurred: %s", message)
        print(f"A client error occured: {message}")

    else:
        print(
            f"Finished generating text with model {model_id}.")


if __name__ == "__main__":
    main()
