# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Shows how to use the Bedrock Agent API to generate conversations with a knowledge base.
"""

import logging
import boto3
from botocore.exceptions import ClientError
import uuid

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def invoke_bedrock_agent(bedrock_client, agent_alias_id, agent_id, input_text, session_id):
    """
    Invokes a Bedrock agent with input and optional session and knowledge base configurations.

    Args:
        bedrock_client: The Boto3 Bedrock runtime client.
        agent_alias_id (str): The alias ID of the Bedrock agent.
        agent_id (str): The unique ID of the Bedrock agent.
        input_text (str): The user's query or text input.
        session_id (str): The session ID for maintaining conversation state (optional).

    Returns:
        dict: The agent's response as a dictionary.
    """
    logger.info(f"Invoking Bedrock agent {agent_id} with alias {agent_alias_id}")

    # Example session state with knowledge base and file handling
    session_state = {
        # 'files': [
        #     {
        #         'name': 'example-recipe.txt',
        #         'source': {
        #             'byteContent': {
        #                 'data': b'Tomato, basil, wheat pasta - create a recipe.',
        #                 'mediaType': 'text/plain'
        #             },
        #             'sourceType': 'BYTE_CONTENT'
        #         },
        #         'useCase': 'CHAT'
        #     }
        # ],
    #     'invocationId': 'example-invocation-id',  # Invocation ID for tracking
    #     'knowledgeBaseConfigurations': [
    #         {
    #             'knowledgeBaseId': '1FRGCSAAT4',
    #             'retrievalConfiguration': {
    #                 'vectorSearchConfiguration': {
    #                     'filter': {
    #                         'equals': {
    #                             'key': 'category',
    #                             'value': 'sustainable-recipes'
    #                         }
    #                     },
    #                     'numberOfResults': 5,
    #                     'overrideSearchType': 'SEMANTIC'
    #                 }
    #             }
    #         }
    #     ],
    #     'sessionAttributes': {
    #         'user': 'example-user'
    #     }
    # }
        'invocationId': 'example-invocation-id',  # Invocation ID for tracking
        'knowledgeBaseConfigurations': [
            {
                'knowledgeBaseId': '1FRGCSAAT4',  # Replace with your valid knowledgeBaseId
                'retrievalConfiguration': {
                    'vectorSearchConfiguration': {
                        'numberOfResults': 5,
                        'overrideSearchType': 'SEMANTIC'
                    }
                }
            }
        ],
        'sessionAttributes': {
            'user': 'example-user'
        }
    }

    try:
        # Send the request to the Bedrock agent
        # response = bedrock_client.invoke_agent(
        #     agentAliasId=agent_alias_id,
        #     agentId=agent_id,
        #     enableTrace=True,
        #     endSession=False,
        #     inputText=input_text,
        #     sessionId=session_id,
        #     sessionState=session_state
        # )
        params = {
            'agentAliasId': agent_alias_id,
            'agentId': agent_id,
            'enableTrace': False,
            'endSession': False,
            'inputText': input_text,
            'sessionState': session_state
        }

        if session_id:
            params['sessionId'] = session_id

        logger.info(f"Params: {params}")

        # Send the request to the Bedrock agent
        response = bedrock_client.invoke_agent(**params)
            
        logger.info("Agent invoked successfully.")
        return response

    except ClientError as err:
        logger.error(f"A client error occurred: {err}")
        raise


# def process_response(response):
#     """
#     Processes the response from the agent and prints the results.

#     Args:
#         response (dict): The response from the agent.
#     """
#     if 'completion' in response:
#         # Extract the response from the event stream
#         event_stream = response.get('completion', None)
#         if event_stream:
#             for event in event_stream:
#                 print(f"Agent response: {event.get('text', '')}")
#         else:
#             logger.info("No event stream found.")
#     else:
#         logger.warning("Completion field is missing from the response.")


def main():
    """
    Main function to invoke the Bedrock agent and handle the conversation.
    """
    # Define agent information
    agent_alias_id = "VAAHM9ABR7"  # Replace with your actual Bedrock Agent Alias ID
    agent_id = "MMFK5OJNNE"  # Replace with your actual Bedrock Agent ID
    input_text = "I have tomato, basil, and wheat pasta. Can you create 3 recipes?"
    session_id = str(uuid.uuid4())  # Replace with a session ID if continuing a conversation

    try:
        # Initialize the Bedrock runtime client
        bedrock_client = boto3.client('bedrock-agent-runtime', region_name='us-west-2')

        

        # Invoke the agent
        response = invoke_bedrock_agent(bedrock_client, agent_alias_id, agent_id, input_text, session_id)

        new_session_id = response.get('sessionId', None)
        if new_session_id:
            logger.info(f"New Session ID: {new_session_id}")
            # Reuse this session_id for subsequent interactions

        session_id = new_session_id


        # Process and display the response
        # process_response(response)
        print(response)
    except ClientError as err:
        logger.error(f"A client error occurred: {err}")


if __name__ == "__main__":
    main()
