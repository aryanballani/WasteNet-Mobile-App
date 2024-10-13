from flask import Blueprint, request, jsonify       # type: ignore
from models.inventory import Inventory
from models.users import Users
from datetime import datetime


inventory_bp = Blueprint('inventory', __name__)

inventory = Inventory()
user_model = Users()

# 1. GET / -> list all items
@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    items = inventory.get_items()
    return jsonify({"status": "success", "data": items}), 200


# 2. GET /user/<user_id> -> get items by user ID
@inventory_bp.route('/user/<user_id>', methods=['GET'])
def get_items_by_user(user_id):
    if not user_model.is_userid_taken(user_id):
        return jsonify({"status": "error", "message": "Invalid user ID"}), 422

    items = inventory.get_items_by_user(user_id)
    if not items:
        return jsonify({"status": "error", "message": "No items found for user"}), 404

    return jsonify({"status": "success", "data": items}), 200


# 3. GET /search -> search by name and expiry_date
@inventory_bp.route('/search', methods=['GET'])
def search_inventory():
    name = request.args.get('name')
    expiry_date = request.args.get('expiry_date')
    
    try:
        expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d')
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid expiry date format"}), 422

    items = inventory.get_items_by_name_and_expiry(name, expiry_date)
    if not items:
        return jsonify({"status": "error", "message": "No items found"}), 404

    return jsonify({"status": "success", "data": items}), 200

# 4. POST /add -> Add a new item
@inventory_bp.route('/add', methods=['POST'])
def add_item():
    data = request.json
    try:
        name = data.get('name')
        quantity = int(data.get('quantity'))
        expiry_date = datetime.strptime(data.get('expiry_date'), '%Y-%m-%d')
        unit_of_measure = data.get('unit_of_measurement')
        user_id = data.get('user_id')

        if not name or quantity <= 0:
            raise ValueError("Invalid data types or values")

        added = inventory.add_item(name, quantity, unit_of_measure, expiry_date, user_id)

        if added:
            return jsonify({"status": "success", "message": "Item successfully added"}), 201
        else:
            return jsonify({"status": "error", "message": "Error while adding item"}), 400

    except (ValueError, TypeError) as e:
        print(e)
        return jsonify({"status": "error", "message": "Invalid input data"}), 422

# 5. PATCH /update -> Update an item
@inventory_bp.route('/update', methods=['PATCH'])
def update_inventory():
    data = request.get_json()  # Get the JSON data from the request body
    name = data.get('name')
    expiry_date = datetime.strptime(data.get('expiry_date'), '%Y-%m-%d')
    update_data = data.get('update_data')  # Get the updated data from the request body

    if update_data <= 0:
        deleted = inventory.delete_item(name, expiry_date)

        if deleted:
            return jsonify({"status": "success", "message": "Item successfully deleted"}), 200
        else:
            return jsonify({"status": "error", "message": "Error while deleting item"}), 400
    
    # Validate the input
    if not name or not expiry_date:
        return jsonify({"status": "error", "message": "Missing name or expiry_date"}), 400
    
    try:
        expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d')
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid expiry date format"}), 422

    # Check if there is any data to update
    if not update_data:
        return jsonify({"status": "error", "message": "No fields to update"}), 400

    # Call the update_item function in the Inventory class
    updated_item = inventory.update_item(name, expiry_date, update_data)
    
    if not updated_item:
        return jsonify({"status": "error", "message": "No item found to update"}), 404

    return jsonify({"status": "success", "data": str(updated_item)}), 200

# 6. DELETE /delete -> Delete an item
@inventory_bp.route('/delete', methods=['DELETE'])
def delete_item():
    data = request.json
    try:
        # Extracting the required fields from the request body
        expiry_date = datetime.strptime(data.get('expiry_date'), '%Y-%m-%d') 
        name = data.get('name')

        if not name or not expiry_date:
            raise ValueError("Missing item ID or user ID")

        # Call the inventory service to delete the item
        deleted = inventory.delete_item(name, expiry_date)

        if deleted:
            return jsonify({"status": "success", "message": "Item successfully deleted"}), 200
        else:
            return jsonify({"status": "error", "message": "Error while deleting item"}), 400

    except (ValueError, TypeError) as e:
        print(e)
        return jsonify({"status": "error", "message": "Invalid input data"}), 422


def get_items_by_user_logic(user_id):
    if not user_model.is_userid_taken(user_id):
        return {"status": "error", "message": "Invalid user ID"}, 422

    items = inventory.get_items_by_user(user_id) 
    if not items:
        return {"status": "error", "message": "No items found for user"}, 404

    return {"status": "success", "data": items}, 200

