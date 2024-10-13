import pymongo           # type: ignore
import os
from datetime import datetime

class Inventory:

    def __init__(self):
        # STEP 1 : Connect to your MongoDB server
        conn_str = os.getenv('MONGODB_CONNECTION_STRING')
        try:
            client = pymongo.MongoClient(conn_str)
            print("Connected to MongoDB successfully")
        except Exception:
            print("Connection Failed")
            print("Error:" + str(Exception))
            
        print(client.list_database_names())
    
        # STEP 2 : Get the database i.e collection
        database = client.get_database('dubhacks')
        self.collection = database.get_collection('inventory')

    def add_item(self, name, quantity, expiry_date, user_id):
        people_documents = {
                            "name": name,
                            "quantity": quantity,
                            "expiry_date": expiry_date,   # May 7, 1954
                            "user_id": user_id
                            }
         
        inserted_documents = self.collection.insert_one(people_documents)
        print(inserted_documents)
        return True

    def update_item(self, name, expiry_date, update_data):
        expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d')
        query = {"name": name, "expiry_date": expiry_date}
        print(query)
        # Update the fields with new values (only fields passed in `update_data`)
        updated_item = self.collection.find_one_and_update(
            query,
            {"$set": update_data},
            return_document=ReturnDocument.AFTER  # Returns the updated document # type: ignore
        )
        
        return updated_item

    def get_items_by_name_and_expiry(self, name, expiry_date):
        docs = self.collection.find({'name': name, 'expiry_date': expiry_date})
        # Convert ObjectId to string and return the list of items
        items = []
        for doc in docs:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
            items.append(doc)
        return items
    

    def get_items(self):
        docs = self.collection.find()
        # Convert ObjectId to string and return the list of items
        items = []
        for doc in docs:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
            items.append(doc)
        return items
