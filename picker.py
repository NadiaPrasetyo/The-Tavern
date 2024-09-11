
from pymongo import MongoClient

import winsound

from dotenv import load_dotenv
import os


# connect to MongoDB from the .env file MONGODB_URI
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

collection = client['The-tavern']['RecipeList']

tags = ["Main Dishes", "Wok Of Life"]

# get recipes that has the tag from "Tag" field which is an array
recipes = collection.find({"Tag": {"$all": tags}})

print()
# print the recipes
for recipe in recipes:
    print(recipe['Name'] + "\n")
    print(recipe['Link'])
    print(recipe['Ingredients'])
    print(recipe['Tag'])
    
    print()
    
    # winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
    # Ask the user to keep or delete the recipe
    inp = input("Keep (enter) or delete (\"del\")?")
    if inp == "del":
        collection.delete_one({'Name': recipe['Name']})
        print("Deleted")
    
    