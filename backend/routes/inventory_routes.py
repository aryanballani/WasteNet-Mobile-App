from flask import Blueprint, request, jsonify
from models.inventory import Inventory

inventory_bp = Blueprint('inventory', __name__)
inventory = Inventory()

@inventory_bp.route('/', methods=['POST'])
def add_item():
    data = request.json
    for item in data['items']:
        inventory.add_item(item['name'], item['quantity'], item['expiry_date'])
    return jsonify({"message": "Inventory updated", "inventory": inventory.get_items()})

@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    return jsonify(inventory.get_items())

@inventory_bp.route('/', methods=['PUT'])
def update_inventory():
    data = request.json
    for item in data['items']:
        inventory.update_item(item['name'], item['used_quantity'])
    return jsonify({"message": "Inventory updated", "inventory": inventory.get_items()})
