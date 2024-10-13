from flask import Blueprint, request, jsonify
from models.recipe import Recipe
import os, boto3

recipe_bp = Blueprint('recipe', __name__)
recipe_handler = Recipe()

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

    data = request.json
    suggestions = recipe_handler.suggest(data['inventory'])
    return jsonify({"suggestions": suggestions})
