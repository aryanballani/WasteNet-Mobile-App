from flask import Blueprint, request, jsonify
from models.inventory import Inventory

inventory_bp = Blueprint('inventory', __name__)

inventory = Inventory()

# 1
@inventory_bp.route('/view', methods=['GET'])
def get_inventory():
    return jsonify(inventory.get_items()), 200

# 2
@inventory_bp.route('/view/$id', methods=['GET'])
def view_item(item_id):
    if item_id <= 0 or not item_id.isdigit():
        return jsonify({"error": "Invalid ID"}), 415

    item = inventory.get_item(item_id)

    if item is None:
        return jsonify({"error": f"No entry found for ID {item_id}"}), 400

    return jsonify({"item": item}), 200


@inventory_bp.route('/add', methods=['POST'])
def add_item():
    data = request.json
    for item in data['items']:
        inventory.add_item(item['name'], item['quantity'], item['expiry_date'])
    return jsonify({"message": "Inventory updated", "inventory": inventory.get_items()})

@inventory_bp.route('/view', methods=['GET'])
def get_inventory():
    return jsonify(inventory.get_items())

@inventory_bp.route('/update', methods=['PUT'])
def update_inventory():
    data = request.json
    for item in data['items']:
        inventory.update_item(item['name'], item['used_quantity'])
    return jsonify({"message": "Inventory updated", "inventory": inventory.get_items()})
