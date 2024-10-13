# STEP 1 : Install and import necessary files
import pymongo
from pymongo import MongoClient
from bson.binary import Binary


# STEP 2 : Connect to your MongoDB server
conn_str = 'mongodb+srv://aryan763:vivaangod10@dubhacks24.oqole.mongodb.net/'
try:
    client = pymongo.MongoClient(conn_str)
    print("Connected to MongoDB successfully")
except Exception:
    print("Error:" + Exception)
# client = pymongo.MongoClient()
    

# STEP 3 : Create a database i.e collection
myDb = client["dubhacks24"]
print(myDb)