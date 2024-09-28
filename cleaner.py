
from pymongo import MongoClient

import difflib

import winsound

from dotenv import load_dotenv
import os


# connect to MongoDB from the .env file MONGODB_URI
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

collection = client['The-tavern']['RecipeList']

memoised = {}

def clean(ing):
    # remove any leading or trailing spaces
    ing = ing.strip()
    # remove any leading or trailing spaces
    ing = ing.strip()
    # remove any symbols like * 
    ing = ing.replace("*", "")
    # replace - with a space
    ing = ing.replace("-", " ")
    # replace . with nothing
    ing = ing.replace(".", "")
    # replace ' with nothing
    ing = ing.replace("'", "")
    # if start with Small, Medium, Large, Jumbo, or Extra-Large remove it as long as the next word isn't size, piece, slice, to, bunch, hand, whole
    if ing.startswith("Small ") and not ing.startswith("Small size") and not ing.startswith("Small piece") and not ing.startswith("Small slice") and not ing.startswith("Small to ") and not ing.startswith("Small bunch") and not ing.startswith("Small hand") and not ing.startswith("Small whole"):
        ing = ing[6:]
    if ing.startswith("Medium ") and not ing.startswith("Medium size") and not ing.startswith("Medium piece") and not ing.startswith("Medium slice") and not ing.startswith("Medium to ") and not ing.startswith("Medium bunch") and not ing.startswith("Medium hand") and not ing.startswith("Medium whole"):
        ing = ing[7:]
    if ing.startswith("Large ") and not ing.startswith("Large size") and not ing.startswith("Large piece") and not ing.startswith("Large slice") and not ing.startswith("Large to ") and not ing.startswith("Large bunch") and not ing.startswith("Large hand") and not ing.startswith("Large whole"):
        ing = ing[6:]
    if ing.startswith("Jumbo ") and not ing.startswith("Jumbo size") and not ing.startswith("Jumbo piece") and not ing.startswith("Jumbo slice") and not ing.startswith("Jumbo to ") and not ing.startswith("Jumbo bunch") and not ing.startswith("Jumbo hand") and not ing.startswith("Jumbo whole"):
        ing = ing[6:]
        
    # if start with Of a or Of a small or Of
    if ing.startswith("Of a "):
        ing = ing[5:]
    if ing.startswith("Of a small "):
        ing = ing[11:]
    if ing.startswith("Of "):
        ing = ing[3:]
        
    # if start with Bakers conrner remove it
    if ing.startswith("Bakers corner "):
        ing = ing[15:]
        
    # remove any plural s
    if ing.endswith("s"):
        ing = ing[:-1]
    
    # if end with leave change to leaf
    if ing.endswith(" leave"):
        ing = ing[:-5] + " leaf"
    
    # if end with berrie change to berry
    if ing.endswith(" berrie"):
        ing = ing[:-7] + " berry"
        
    # if start with Garlic just use Garlic
    if ing.startswith("Garlic "):
        ing = "Garlic"
        
    if ing.startswith("All spice") or ing.startswith("Allsprice"):
        ing = "Allspice"
        
    if ing.startswith("Fresh ") or ing.startswith("Freshly "):
        ing = ing[6:]
    
    if ing.startswith("Sliced ") and not ing.startswith("Sliced cheese"):
        ing = ing[7:]
    
    if ing.startswith("Thinly sliced ") and not ing.startswith("Thinly sliced fatty beef"):
        if ing.startswith("Thinly sliced raw "):
            ing = ing[17:]
        else:
            ing = ing[14:]
    
    if ing.startswith('Y '):
        ing = ing[2:]
    
    if ing.startswith("Cold "):
        ing = ing[5:]
        
    if ing.startswith("Crme"):
        ing = "Creme" + ing[4:]
               
    if ing.startswith("Lao gan ma"):
        ing = "Lao gan ma"
        
    if ing.startswith("Julienned "):
        ing = ing[10:]
        
    if ing.endswith("sweetener"):
        ing = "sweetener"
    
    # capitalize the first letter of the ingredient
    ing = ing.capitalize()
    
    ing = ing.strip()
    return ing

def getDistinctIngredients():
    # get all the ingredients from the database
    ingredients = collection.find({}, {"Ingredients": 1, "_id": 0})
    # create a set to store all the ingredients
    allIngredients = set()
    # loop through the ingredients and add them to the set
    for ingredient in ingredients:
        for ing in ingredient['Ingredients']:
            allIngredients.add(ing)
    # return the set
    return allIngredients

def printDistinctIngredients():
    # get all the distinct ingredients
    allIngredients = getDistinctIngredients()
    # sort the ingredients
    allIngredients = sorted(allIngredients)
    # loop through the ingredients and print them
    for ing in allIngredients:
        print(ing)

def flagSus(ingredient):
    # condition to check if the ingredient is suspicious
    sus_start = [
        # "A ", "An ", "The ", "a ", "an ", "the ", "Of", "Some", "(", "Jumbo", "Large", "Inch", "Or", "For", " To ", "Chop", "Small", "Medium", "Juiced", "Optional", "One", "Very", "Your", "Garnish", "Sprig", "Choice", "Kepp", "Ap"
        # "Eggs", "Grated", "Melted", "Shredded", "Thin", "Warm", "Water", "Wide"
        # "Boneeless", "Cup", "Egg", "Firm", "Flakey", "Thawed"
    ]
    sus_has_word = [
        # ",", "large", "inch", " or ", "for", " to ", "chop", "small", "medium", "juiced", "optional", " one ", "very", "your", "garnish", ":", "(", " a ", "sprig", "choice", "homemade", "kepp", " of "
        # "crme"
        # "nice quality", " ros ", "room temperature"
    ]
    sus_end = [
        # "oe", "leave", "rie", "heaping"
        # "crump"
        # "Bonele", "kisse", "i use rao"
    ]
    if ingredient.startswith(tuple(sus_start)):
        return True
    if ingredient.endswith(tuple(sus_end)):
        return True
    for word in sus_has_word:
        if word in ingredient:
            return True
    return False

def askUserToFix(ingredient, recipe_name):
    print(f"Recipe: {recipe_name}")
    # ask the user to fix the ingredient
    print(f"Please fix the ingredient or '' to remove or 'keep' to keep current: {ingredient}")
    # get the new ingredient from the user
    new_ingredient = input("New ingredient: ")
    # return the new ingredient
    return new_ingredient

def fixRecipe(recipe):
    # get the ingredients from the recipe
    ingredients = recipe['Ingredients']
    # create a list to store the new ingredients
    new_ingredients = set()
    # loop through the ingredients
    for ingredient in ingredients:
        cleaned = clean(ingredient)
        # check if the ingredient is suspicious
        if flagSus(cleaned):
            
            # check if the ingredient is already in the memoised dictionary
            if cleaned in memoised:
                # get the new ingredient from the memoised dictionary
                new_ingredient = memoised[cleaned]
                # if the new ingredient is empty skip the ingredient
                if not new_ingredient:
                    continue
                # add the new ingredient to the list
                new_ingredients.add(new_ingredient)
                continue
            
            # play a sound to notify the user
            # winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
            # ask the user to fix the ingredient
            new_ingredient = askUserToFix(cleaned, recipe["Name"])
            # if the new ingredient is not empty
            if new_ingredient:
                if new_ingredient == "keep":
                    new_ingredient = cleaned
                # clean the new ingredient
                new_ingredient = clean(new_ingredient)
                # add the new ingredient to the list
                new_ingredients.add(new_ingredient)
                # add the new ingredient to the memoised dictionary
                memoised[cleaned] = new_ingredient
        else:
            # add the cleaned ingredient to the list
            new_ingredients.add(cleaned)
    # update the recipe with the new ingredients
    listed = list(new_ingredients)
    collection.update_one({"_id": recipe["_id"]}, {"$set": {"Ingredients": listed}})

def similar(a, list_b):
    # remove a from list_b
    list_b = [x for x in list_b if x != a]
    # find closest match for a in list_b
    closest = difflib.get_close_matches(a, list_b, n=list_b.__len__(), cutoff=0.7)
    if closest:
        print(f"{a}: {closest}")


def main():
    # get all Recipes
    recipes = collection.find({})
    # loop through the recipes
    for recipe in recipes:
        # fix the recipe
        fixRecipe(recipe)

# process ingredients
main()

# print all distinct ingredients use it by python cleaner.py > ingredients.txt
# printDistinctIngredients()

# Get matches for each ingredient use it by python cleaner.py > matches.txt
# distinctIngredients = getDistinctIngredients()

# for ing in distinctIngredients:
#     similar(ing, distinctIngredients)

client.close()
winsound.PlaySound("public/tada-fanfare-a-6313.wav", winsound.SND_FILENAME)
