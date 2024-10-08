
from pymongo import MongoClient

import difflib

import winsound

from dotenv import load_dotenv
import os

import re

# connect to MongoDB from the .env file MONGODB_URI
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

client = MongoClient(MONGODB_URI)

collection = client['The-tavern']['RecipeList']

recipeList = client['The-tavern']['RecipeList']

memoised = {}

def clean(ing):
    # remove any leading or trailing spaces
    ing = ing.strip()
    # remove any leading or trailing parentheses
    ing = ing.strip("()")
    # remove any korean characters using character ranges
    ing = re.sub(r'[\u3131-\ucb4c]', '', ing)
    
    # remove any symbols like * 
    ing = ing.replace("*", "")
    # replace - with a space
    ing = ing.replace("-", " ")
    # replace . with nothing
    ing = ing.replace(".", "")
    # replace ' with nothing
    ing = ing.replace("'", "")
    
    ing = ing.replace("á", " ")
    
    ing = ing.replace("cm/″", "")
    
    if ing.startswith("Egg") or "egg" in ing:
        ing = "Egg"
    
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
        
    if ing.startswith("¬ω"):
        ing = ing[2:]
        
    ing = ing.replace("  ", " ")
    ing = ing.replace("  ", " ")
    
    if ing.startswith("Ts"):
        if ing.startswith("Ts of "):
            ing = ing[6:]
        else:
            ing = ing[2:]
    
    if ing.startswith("Tbs"):
        if ing.startswith("Tbs of "):
            ing = ing[7:]
        else:
            ing = ing[3:]
            
    if ing.startswith("Tablespoon"):
        if ing.startswith("Tablespoon of "):
            ing = ing[14:]
        else:
            ing = "Tablespoon"
            
    if ing.startswith("Table spoon"):
        if ing.startswith("Table spoon of "):
            ing = ing[14:]
        else:
            ing = "Table spoon"
            
    if ing.startswith("Plus "):
        ing = ing[5:]
        
    if ing.startswith("Peeled "):
        ing = ing[7:]
        
    if ing.startswith("Package "):
        if ing.startswith("Package of "):
            ing = ing[10:]
        else:
            ing = ing[8:]
    
    if ing.startswith("Or "):
        ing = ing[3:]
    
    if ing.startswith("Onion"):
        ing = "Onion"
        
    if ing.startswith("Napa cabbage"):
        ing = "Napa cabbage"
        
    if ing.startswith("Gochujang"):
        ing = "Gochujang"
    if ing.startswith("Gochugaru"):
        ing = "Gochugaru"
    if ing.startswith("Gochu garu"):
        ing = "Gochugaru"
    
    if ing.startswith("Cubed "):
        ing = ing[6:]

    if ing.startswith("Crushed "):
        ing = ing[8:]
        
    if ing.startswith("Cooking oil"):
        ing = "oil"
        
    if ing.startswith("Jalapeo") or ing.startswith("Jalapeno"):
        ing = "Jalapeno"
        
#daikon radish == daikon == korean radish
#gim == nori == seaweed
#red pepper == gochugaru
#green onion == scallion*** == spring onion
#watercress error in ingredient
#korean pear == nashi pear
#asian chives == chive
#anchovy kelp stock == dashi
#toasted sesame seed == sesame seed

    if ing.startswith("Daikon") or ing.startswith("Korean radish"):
        ing = "daikon radish"
    
    if ing.startswith("Gim") or ing.startswith("Seaweed") or "seaweed" in ing or "nori" in ing or "gim" in ing:
        ing = "nori"
    
    if ing.startswith("Red pepper"):
        ing = "gochugaru"
        
    if ing.startswith("Green onion") or ing.startswith("Spring onion") or "green onion" in ing or "spring onion" in ing:
        ing = "scallion"
    
    if ing.startswith("Watercre"):
        ing = "watercress"
    
    if ing.startswith("Korean pear"):
        ing = "nashi pear"
        
    if ing.startswith("Asian chive"):
        ing = "chive"
    
    if ing.startswith("Anchovy kelp stock") or "anchovy kelp stock" in ing:
        ing = "dashi"
    
    if ing.startswith("Toasted sesame seed") or "toasted sesame seed" in ing:
        ing = "sesame seed"
    
    if ing.startswith("Cabbage"):
        ing = "cabbage"
    
    if ing.startswith("Toasted sesame oil"):
        ing = "sesame oil"
    
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

def clean_name(name):
    # strip any leading or trailing spaces
    name = name.strip()

    # if there's an ( but no ), add a ) at the end
    if name.count("(") > name.count(")"):
        name += ")"
        
    # replace () with nothing
    name = name.replace("()", "")
    # remove any korean characters using character ranges
    name = re.sub(r'[\u3131-\ucb4c]', '', name)
    # remove any "( )"
    name = name.replace("( )", "")
    # strip any leading or trailing spaces
    name = name.strip()
    return name

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
        # "A ", "An ", "The ", "a ", "an ", "the ", "Of", "Some", "(", "Jumbo", "Large", "Inch", "Or", "For", " To ", "Chop", "Small", "Medium", "Juiced", "Optional", "One", "Very", "Your", "Garnish", "Sprig", "Choice", "Kepp", "Ap",
        # "Eggs", "Grated", "Melted", "Shredded", "Thin", "Warm", "Water", "Wide", "Garnish", "Cook ", "Clove ", "Cloves ", "Cleaned ", "Clean ", "Can of ", "Bunch ", "Bowl", "Boil", "Be ", "Ball ", "And ", "Any "
        # "Boneeless", "Cup", "Egg", "Firm", "Flakey", "Thawed", "Worth", "X ", "While", "Table", "Sheet", "Sliced", "Slices", "S ", "Quarts", "Put ", "Pkg", "Piece", "Package", "Mince", "Made ", "Little", "Lb", "Long ", "Kale", "Hi ", "Half"
        # "When", "Well", "Dropwort", "Trimmed", "Tofu", "To ", "Stir", "Steam", "Squeeze", "Soy ", "Soft", "Neoguri", "Mozzarella cheese", "Korean hot pepper ", "Kimchi juice", "Kilogram", "Jjapagetti", "Jalapeo", "Jjajangmyeon", "If ", "Hot pepper", "Homemade", "Head ",
        # "Garatteok", "Extra ", "Electric", "Emergency", "English", "Dae ", "Cotton", "Cook", "Chili", "Bunches", "Artificial", "Anchovy stock", "About"
        # "Any", "Peeled"
        ]
    sus_has_word = [
        # ",", "large", "inch", " or ", "for", " to ", "chop", "small", "medium", "juiced", "optional", " one ", "very", "your", "garnish", ":", "(", " a ", "sprig", "choice", "homemade", "kepp", " of ", "water"
        # "crme", "such as", "cleaned", "powder", " or ", "tbs", "pancake"
        # "nice quality", " ros ", "room temperature"
        # "stick", "skewer", "fluffy", "rice cake", "toasted", "bought", "buy", "radishe", "cooking wine", "cut", "shucked", "mandu", "with", "about", "meat", "washed", "that", "from", "ground", "/"
    ]
    sus_end = [
        # "oe", "leave", "ie", "heaping", "to taste"
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
    # if the ingredient is longer than 50 characters
    if len(ingredient) > 50:
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
            if cleaned:
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
        
def fixEmptyIngredients(recipe):
    # print the link and ask user to give the ingredients separated by commas
    print(recipe['Link'])
    
    print(f"Please enter the ingredients separated by commas for {recipe['Name']}")
    
    ingredients = input("Ingredients: ")
    
    # split the ingredients by commas
    
    ingredients = ingredients.split(",")
    
    # clean the ingredients
    
    ingredients = [clean(ing) for ing in ingredients]
    
    # update the recipe with the new ingredients
    
    collection.update_one({"_id": recipe["_id"]}, {"$set": {"Ingredients": ingredients}})

def checkIfIngredientsEmpty():
    # get all the recipes
    recipes = collection.find({})
    # loop through the recipes
    for recipe in recipes:
        # check if the ingredients are empty
        if not recipe['Ingredients'] or recipe['Ingredients'] == []:
            # fix the empty ingredients
            fixEmptyIngredients(recipe)
            
            # delete the recipe
            # collection.delete_one({"_id": recipe["_id"]})
            
def addCollections(collection1, collection2):
    # get all the recipes from collection1
    recipes = collection1.find({}) # maangchi
    # loop through the recipes
    for recipe in recipes:
        # make sure the schema is the same
        Name = recipe['Name']
        Link = recipe['Link']
        Ingredients = recipe['Ingredients']
        Ingredients_set = set(Ingredients)
        
        Tag = []
        if 'Tags' in recipe:
            Tag = recipe['Tags']
        else:
            Tag = recipe['Tag']
        Tag_set = set(Tag)
        
        
        # insert the recipe into collection2
        collection2.insert_one({ 'Name': Name, 'Link': Link, 'Ingredients': list(Ingredients_set), 'Tag': list(Tag_set) })

def cleanName(collection1):
    # get all the recipes
    recipes = collection1.find({})
    # loop through the recipes
    for recipe in recipes:
        # get the name
        name = recipe['Name']
        print(name)
        # clean the name
        name = clean_name(name)
        # update the recipe with the new name
        collection1.update_one({"_id": recipe["_id"]}, {"$set": {"Name": name}})

# process ingredients
# main()

# print all distinct ingredients use it by python cleaner.py > ingredients.txt
# printDistinctIngredients()

# Get matches for each ingredient use it by python cleaner.py > matches.txt
# distinctIngredients = getDistinctIngredients()

# for ing in distinctIngredients:
#     similar(ing, distinctIngredients)

# Fix empty Ingredients
# checkIfIngredientsEmpty()

# Add all recipes from one collection to another
# addCollections(collection, recipeList)

# Clean the name of the recipe
# cleanName(recipeList)

client.close()
winsound.PlaySound("public/tada-fanfare-a-6313.wav", winsound.SND_FILENAME)

#daikon radish == daikon == korean radish
#gim == nori == seaweed
#red pepper == gochugaru
#green onion == scallion*** == spring onion
#watercress error in ingredient
#korean pear == nashi pear
#asian chives == chive
#anchovy kelp stock == dashi
#toasted sesame seed == sesame seed