from flask import Blueprint, request, jsonify           # type: ignore
import os
from datetime import datetime, timedelta
from models.users import Users  # Assuming you have a User model
import jwt              # type: ignore

user_bp = Blueprint('user', __name__)

user_model = Users()

# 1. POST /login -> Login and authenticate user
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"status": "error", "message": "Missing username or password"}), 400
    
    if not user_model.is_username_taken(username):
        return jsonify({"status": "error", "message": "Username doens't exist"}), 400
    
    user_id = user_model.authenticate(username, password)  # Assuming the User model has an `authenticate` method

    if user_id:
        return jsonify({"status": "success", "message": "Login successful", "token": str(user_id)}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid username or password"}), 401

# 2. POST /create -> Create a new user
@user_bp.route('/create', methods=['POST'])
def create_user():
    data = request.json
    print(data)
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password or not email:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    if user_model.is_username_taken(username):
        return jsonify({"status": "error", "message": "Username is already taken"}), 400
    
    user_id = user_model.create_user(username, password, email)  # Assuming `create_user` adds a new user
    
    if user_id:
        return jsonify({"status": "success", "message": "User successfully created", "user_id": str(user_id)}), 201
    else:
        return jsonify({"status": "error", "message": "Error while creating user"}), 400
