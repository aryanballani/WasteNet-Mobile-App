from flask import Blueprint, request, jsonify
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv  # Import load_dotenv to read .env variables
from models.users import Users  # Assuming you have a User model
import jwt

user_bp = Blueprint('user', __name__)

user_model = Users()
SECRET_KEY = os.getenv('SECRET_KEY')  # Get the secret key from environment variables

# 1. POST /login -> Login and authenticate user
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"status": "error", "message": "Missing username or password"}), 400
    
    user = user_model.authenticate(username, password)  # Assuming the User model has an `authenticate` method
    
    if user:
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration time
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"status": "success", "message": "User authenticated successfully", "token": token}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid username or password"}), 401

# 2. POST /create -> Create a new user
@user_bp.route('/create', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password or not email:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    if user_model.is_username_taken(username):
        return jsonify({"status": "error", "message": "Username is already taken"}), 400
    
    user = user_model.create_user(username, password, email)  # Assuming `create_user` adds a new user
    
    if user:
        return jsonify({"status": "success", "message": "User successfully created", "user_id": user.id}), 201
    else:
        return jsonify({"status": "error", "message": "Error while creating user"}), 400

# Additional: GET /protected -> Protected endpoint example
@user_bp.route('/protected', methods=['GET'])
def protected_route():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"status": "error", "message": "Token is missing"}), 403

    try:
        # Decode token
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']
        # You can fetch user information or perform other actions here

        return jsonify({"status": "success", "message": "Token is valid", "user_id": user_id}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"status": "error", "message": "Token has expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"status": "error", "message": "Invalid token"}), 403
