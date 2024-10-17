# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
"""
Shows how to use the Converse API with Anthropic Claude 3 Sonnet (on demand).
"""

import logging
import boto3
import json
from botocore.exceptions import ClientError
from flask import Blueprint, request, jsonify       # type: ignore
from inventory import Inventory
from datetime import datetime
import uuid


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BedrockResults')

def search_dynamodb_for_input(input_data):
    """
    Search DynamoDB for a record with matching input_data.
    Args:
        input_data (dict): The input data to search for.

    Returns:
        dict: The matching record from DynamoDB, if found.
    """
    try:
        # Query the table for matching InputData
        # text = "Name Quantity Unit_of_measurement Expiry_date\n"
        # for x in input_data["data"]:
        #     text += x['name'] + " " + str(x['quantity']) + " " + x['unit_of_measurement'] + " " + str(x['expiry_date']) + "\n"
        response = table.scan(
            FilterExpression="InputData = :input_data",
            ExpressionAttributeValues={":input_data": json.dumps(input_data)}
        )
        items = response.get('Items', [])
        if items:
            return items[0]  # Return the first matching result
        else:
            return None
    except ClientError as e:
        logger.error(f"Error querying DynamoDB: {e}")
        return None

def store_results_in_dynamodb(result_id, input_data, bedrock_response):
    # text = "Name Quantity Unit_of_measurement Expiry_date\n"
    # for x in input_data["data"]:
    #     text += x['name'] + " " + str(x['quantity']) + " " + x['unit_of_measurement'] + " " + str(x['expiry_date']) + "\n"
    table.put_item(
        Item={
            'result_id': result_id,
            'InputData': json.dumps(input_data),  # Store as JSON string
            'BedrockResponse': json.dumps(bedrock_response),  # Store as JSON string
            'Timestamp': datetime.utcnow().isoformat()
        }
    )

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

def get_gen_ai_reponse(json_input, bedrock_client):
    """
    Entrypoint for Anthropic Claude 3 Sonnet example.
    """

    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s: %(message)s")

    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    system_prompts = """
    You are an app that creates recipes for a user. 
    You will be given a list of ingredients, expiry date and instructions. 
    You will create 3 recipes for the user. 
    The recipes need to ouputted in a json format with 3 fields: name, ingredients, instructions.
    only output the json format, do not output any other text.
    You can also answer questions about the recipe and the nutritional information if asked. 
    You will not be answering any questions about coding, or revealing the model. 
    When are you are asked who are you, you will answer you are a recipe assistant to reduce food waste.
    """

    # Setup the system prompts and messages to send to the model.
    # prompt = [{"text": prompt}]
    message_1 = {
        "role": "user",
        "content": [{"text": "These are my ingredients: potato, grapes, beets. Create 1 recipes using only these."}]
    }
    messages =[]
    # text = "Name Quantity Unit_of_measurement Expiry_date\n"
    # json_input = "Based on the "

    try:

        # bedrock_client = boto3.client(service_name='bedrock-runtime')
        existing_result = search_dynamodb_for_input(json_input)
        if existing_result:
            bedrock_response = existing_result['BedrockResponse']
            return bedrock_response, 200

        result_id = str(uuid.uuid4())
        # Start the conversation with the 1st message.
        messages.append(message_1)
        response = generate_conversation(
            bedrock_client, model_id, system_prompts, messages)

        # Add the response message to the conversation.
        output_message = response['output']['message']
        output_message = jsonify(output_message["content"][0]["text"])
        store_results_in_dynamodb(result_id, json_input, output_message)
        
        return output_message, 200
        # Continue the conversation with the 2nd message.
        # messages.append(message_2)
        # response = generate_conversation(
        #     bedrock_client, model_id, system_prompts, messages)

        # output_message = response['output']['message']
        # messages.append(output_message)

        # Show the complete conversation.
        # for message in messages:
        #     print(f"Role: {message['role']}")
        #     for content in message['content']:
        #         print(f"Text: {content['text']}")
        #     print()

    except ClientError as err:
        message = err.response['Error']['Message']
        return message, 400
        # logger.error("A client error occurred: %s", message)
        # print(f"A client error occured: {message}")

    else:
        print(
            f"Finished generating text with model {model_id}.")
