import pymongo # type: ignore
import os
import bcrypt   # type: ignore

class Users:
    def __init__(self):
        # STEP 1 : Connect to your MongoDB server
        conn_str = os.getenv('MONGODB_CONNECTION_STRING')
        try:
            client = pymongo.MongoClient(conn_str)      # type: ignore
            print("Connected to MongoDB successfully")
        except Exception:
            print("Connection Failed")
            print("Error:" + str(Exception))
            
        print(client.list_database_names())
    
        # STEP 2 : Get the database i.e collection
        database = client.get_database('dubhacks')
        self.collection = database.get_collection('users')

    def is_username_taken(self, username):  
        docs = self.collection.find({'username': username})
        if list(docs):
            return True
        return False
    
    def create_user(self, username, password, email):
        hashed_password = self.hash_password(password)
        user_document = {
            'username': username,
            'password': hashed_password,
            'email': email
        }
        inserted_document = self.collection.insert_one(user_document)
        return inserted_document.inserted_id
    
    def authenticate(self, username, password):
        docs = self.collection.find({'username': username})
        for doc in docs:
            if self.verify_password(password, doc['password']):
                return doc['_id']
        return None

    
    def hash_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()) 

    def verify_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

    
