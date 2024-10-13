
import logging
import boto3

from botocore.exceptions import ClientError


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

bedrock_agent_runtime_client = boto3.client("bedrock-agent-runtime", region_name="us-west-2")

def ask_bedrock_llm_with_knowledge_base(query: str, model_arn: str, kb_id: str) -> str:
    response = bedrock_agent_runtime_client.retrieve_and_generate(
        input={
            'text': query
        },
        retrieveAndGenerateConfiguration={
            'type': 'KNOWLEDGE_BASE',
            'knowledgeBaseConfiguration': {
                'knowledgeBaseId': kb_id,
                'modelArn': model_arn
            }
        },
    )

    return response

def main():

    region_name = "us-west-2"
    model_id = "anthropic.claude-v2:1"  # set the foundation model

    model_arn = f'arn:aws:bedrock:{region_name}::foundation-model/{model_id}'
    kb_id = "1FRGCSAAT4"

    query = "give me a recipe for cake?"

    response = ask_bedrock_llm_with_knowledge_base(query, model_arn, kb_id)

    print(response)

main()