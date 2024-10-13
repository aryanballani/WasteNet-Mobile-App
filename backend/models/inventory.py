import pymongo
import os


class Inventory:

    def __init__(self):
        # STEP 1 : Connect to your MongoDB server
        conn_str = os.getenv('MONGODB_CONNECTION_STRING')
        try:
            client = pymongo.MongoClient(conn_str)
            print("Connected to MongoDB successfully")
        except Exception:
            print("Connection Failed")
            print("Error:" + Exception)
            
        print(client.list_database_names())
    
        # STEP 2 : Get the database i.e collection
        self.table = client["dubhacks24"].dubhacks
    
        self.items = {}

    def add_item(self, id, name, quantity, expiry_date, user_id):
        self.items[name] = {'quantity': quantity, 'expiry_date': expiry_date}

    def update_item(self, name, used_quantity):
        if name in self.items:
            self.items[name]['quantity'] -= used_quantity
            if self.items[name]['quantity'] <= 0:
                del self.items[name]

    def get_item(self, item_id):
        for item in self.items:
            if self.items[item]['id'] == item_id:
                return self.items[item]
        return None
    
    def get_items(self):
        return self.items
