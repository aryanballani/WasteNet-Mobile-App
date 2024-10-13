import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize the Bedrock agent client
client = boto3.client("bedrock-agent-runtime", region_name="us-west-2")

def invoke_agent_with_session(agent_id: str, agent_alias_id: str, query: str, session_id: str = None):
    """
    Invokes a Bedrock agent with a given session, query, and knowledge base.
    
    Args:
        agent_id (str): The unique identifier of the Bedrock agent.
        agent_alias_id (str): The alias ID of the agent, if applicable.
        query (str): The text query or input to send to the agent.
        session_id (str): The session ID for maintaining the context of a conversation.
        
    Returns:
        dict: The response from the agent.
    """
    try:
        # Prepare the invocation request
        response = client.invoke_agent(
            agentAliasId=agent_alias_id,  # Alias of the agent
            agentId=agent_id,  # Unique identifier of the agent
            enableTrace=True,  # Enable tracing for debugging purposes
            endSession=False,  # Whether to end the session after this call
            inputText=query,  # The text input to send to the agent
            sessionId=session_id,  # Optional: Pass session ID to maintain conversation context
            sessionState={  # Optional: Manage session state (files, invocation results, attributes, etc.)
                'files': [
                    {
                        'name': 'example-file.txt',
                        'source': {
                            'byteContent': {
                                'data': b'example content',
                                'mediaType': 'text/plain'
                            },
                            'sourceType': 'BYTE_CONTENT'  # or 'S3' for file stored in S3
                        },
                        'useCase': 'CHAT'  # Define the use case (CODE_INTERPRETER or CHAT)
                    }
                ],
                'invocationId': 'example-invocation-id',  # Invocation ID for tracking purposes
                'knowledgeBaseConfigurations': [
                    {
                        'knowledgeBaseId': '1FRGCSAAT4',
                        'retrievalConfiguration': {
                            'vectorSearchConfiguration': {
                                'filter': {
                                    'equals': {
                                        'key': 'category',
                                        'value': 'sustainable-recipes'
                                    }
                                },
                                'numberOfResults': 5,  # Define how many results to retrieve
                                'overrideSearchType': 'SEMANTIC'  # Use SEMANTIC or HYBRID search
                            }
                        }
                    }
                ],
                'sessionAttributes': {
                    'user': 'example-user'
                }
            }
        )

        # Log and return the response
        logger.info(f"Agent response: {response}")
        return response

    except ClientError as err:
        message = err.response['Error']['Message']
        logger.error(f"A client error occurred: {message}")
        return None


def main():
    # Define agent information
    agent_id = "MMFK5OJNNE"  # Replace with your actual Bedrock Agent ID
    agent_alias_id = "VAAHM9ABR7"  # Replace with your actual Agent Alias ID
    query = "Tell me how to make a sustainable cake recipe."
    session_id = "your-session-id"  # Optional: Reuse session ID for maintaining conversation context

    # Invoke the agent
    response = invoke_agent_with_session(agent_id, agent_alias_id, query, session_id)

    if response:
        print("Agent's response:", response)
    else:
        print("Failed to invoke the agent.")


if __name__ == "__main__":
    main()
