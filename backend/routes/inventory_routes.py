from flask import Blueprint, request, jsonify
from models.inventory import Inventory
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__)

inventory = Inventory()

# 1. GET /inventory -> list all items
@inventory_bp.route('/inventory', methods=['GET'])
def get_inventory():
    items = inventory.get_items()
    if not items:
        return jsonify({"status": "error", "message": "No items in inventory"}), 404
    return jsonify({"status": "success", "data": items}), 200

# 2. GET /inventory/<int:item_id> -> get specific item by ID
@inventory_bp.route('/inventory/<int:item_id>', methods=['GET'])
def get_item(item_id):
    if item_id <= 0:
        return jsonify({"status": "error", "message": "Invalid ID"}), 422

    item = inventory.get_item(item_id)
    if item is None:
        return jsonify({"status": "error", "message": "Item not found"}), 404

    return jsonify({"status": "success", "data": item}), 200

# 3. GET /inventory/user/<int:user_id> -> get items by user ID
@inventory_bp.route('/inventory/user/<int:user_id>', methods=['GET'])
def get_items_by_user(user_id):
    if user_id <= 0:
        return jsonify({"status": "error", "message": "Invalid user ID"}), 422

    items = inventory.get_items_by_user(user_id)
    if not items:
        return jsonify({"status": "error", "message": "No items found for user"}), 404

    return jsonify({"status": "success", "data": items}), 200

# 4. GET /inventory/search -> search by name and expiry_date
@inventory_bp.route('/inventory/search', methods=['GET'])
def search_inventory():
    name = request.args.get('name')
    expiry_date = request.args.get('expiry_date')
    
    try:
        expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid expiry date format"}), 422

    items = inventory.get_items_by_name_and_expiry(name, expiry_date)
    if not items:
        return jsonify({"status": "error", "message": "No items found"}), 404

    return jsonify({"status": "success", "data": items}), 200

# 5. POST /inventory -> Add a new item
@inventory_bp.route('/inventory', methods=['POST'])
def add_item():
    data = request.json
    try:
        name = data.get('name')
        quantity = int(data.get('quantity'))
        expiry_date = datetime.strptime(data.get('expiry_date'), '%Y-%m-%d').date()
        user_id = int(data.get('user_id'))

        if not name or quantity <= 0 or user_id <= 0:
            raise ValueError("Invalid data types or values")

        added = inventory.add_item(name, quantity, expiry_date, user_id)

        if added:
            return jsonify({"status": "success", "message": "Item successfully added"}), 201
        else:
            return jsonify({"status": "error", "message": "Error while adding item"}), 400

    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid input data"}), 422

# 6. PATCH /inventory/<int:item_id> -> Update an item
@inventory_bp.route('/inventory/<int:item_id>', methods=['PATCH'])
def update_item(item_id):
    data = request.json
    try:
        name = data.get('name')
        quantity = data.get('quantity')
        expiry_date = data.get('expiry_date')
        user_id = data.get('user_id')

        if expiry_date:
            expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d').date()
        if quantity:
            quantity = int(quantity)
        if user_id:
            user_id = int(user_id)

        updated = inventory.update_item(item_id, name, quantity, expiry_date, user_id)

        if updated:
            return jsonify({"status": "success", "message": "Item successfully updated"}), 200
        else:
            return jsonify({"status": "error", "message": "Error while updating item"}), 400

    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid input data"}), 422
