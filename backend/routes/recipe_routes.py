from flask import Blueprint, request, jsonify
from models.recipe import Recipe

recipe_bp = Blueprint('recipe', __name__)
recipe_handler = Recipe()

@recipe_bp.route('/', methods=['POST'])
def suggest_recipes():
    data = request.json
    suggestions = recipe_handler.suggest(data['inventory'])
    return jsonify({"suggestions": suggestions})
