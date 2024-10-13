from pymongo import MongoClient
import os

class Users:
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
        database = client.get_database('dubhacks')
        self.collection = database.get_collection('users')

    
