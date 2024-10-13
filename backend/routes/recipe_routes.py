from flask import Blueprint, request, jsonify
from models.aws import get_gen_ai_reponse
import os, boto3
from routes.inventory_routes import get_items_by_user_logic
from dotenv import load_dotenv 

load_dotenv()

recipe_bp = Blueprint('recipe', __name__)

# 1. POST /recipe -> Get recipes based on user inventory
# Body: user_id
@recipe_bp.route('/', methods=['POST'])
def suggest_recipes():
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_DEFAULT_REGION')

    bedrock_client = boto3.client(
        'bedrock-runtime',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=aws_region
    )

    data = request.get_json()
    user_id = data.get('user_id')

    response, status_code = get_items_by_user_logic(user_id)
    
    if status_code != 200:
        return jsonify(response), status_code
    
    print(response)
    
    response, status_code = get_gen_ai_reponse(response, bedrock_client)
    print(4)

    return jsonify(response), status_code

