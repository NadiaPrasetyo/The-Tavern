
from pymongo import MongoClient

import winsound
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
import re



# connect to MongoDB from the .env file MONGODB_URI
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)

collection = client['The-tavern']['Maangchi']

# Function to clean up text data
def clean_up(text):
    # remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    # remove any empty parentheses or parentheses with spaces in them
    text = re.sub(r'\(.*\)', '', text)
    # replace ", )" with ")"
    text = re.sub(r',\s\)', ')', text)
    # replace "  " with " "
    text = re.sub(r'\s\s', ' ', text)
    # replace ":" with ""
    text = re.sub(r':', '', text)
    return text.capitalize()

def clean_up_ingredients(ingredient_str):
    # remove the number
    ingredient_str = re.sub(r'\d+', '', ingredient_str)
    # remove any fractions (e.g., ¼, ½, ¾)
    ingredient_str = re.sub(r'[¼½¾⅓⅔⅛⅜⅝⅞]', '', ingredient_str)
    # remove the parentheses or anything in them
    ingredient_str = re.sub(r'\([^)]*\)', '', ingredient_str)
    # remove any units
    ingredient_str = re.sub(r'\b(?:g|kg|ml|l|tbsp|tsp|cup|cups|tbsps|tsps|gms|gm|gms|gm|g|oz|ozs|tablespoon|teaspoon|tablespoons|teaspoons|pounds|pound|ounces|ounce)\b', '', ingredient_str)
    # replace any - with a space
    ingredient_str = re.sub(r'-', ' ', ingredient_str)
    # take evrything before the comma
    ingredient_str = ingredient_str.split(',')[0]
    # remove any leading or trailing spaces
    ingredient_str = ingredient_str.strip()
    # remove multiple spaces (maybe more than 2)
    ingredient_str = re.sub(r'\s\s', ' ', ingredient_str)    
    # capitalize the first letter
    ingredient_str = ingredient_str.capitalize()
    
    return ingredient_str
    
    
def scrape_recipe(url):
    recipe_response = requests.get(url)
    recipe_soup = BeautifulSoup(recipe_response.content, 'html.parser')
    ingredients_containers = recipe_soup.find_all('ul', class_='wp-block-list')
    correct_ingredients = set()
    if not ingredients_containers:
        ingredients_ul = recipe_soup.find_all('ul')
        for i in range(4, len(ingredients_ul)):
            # if the ul has a class, break
            if ingredients_ul[i].has_attr('class'):
                # print the class name
                break
            else:
                ingredients = ingredients_ul[i].find_all('li')
                for ingredient in ingredients:
                    correct_ingredients.add(clean_up_ingredients(ingredient.text))
        
    else:
        for ingredients in ingredients_containers:
            for ingredient in ingredients.find_all('li'):
                correct_ingredients.add(clean_up_ingredients(ingredient.text))
                    
    return list(correct_ingredients)

def scrape_category(url, category):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    recipe_containers = soup.find_all('div', class_='taxonomy-card')
    recipe_data = []
    for recipe in recipe_containers:
        name = clean_up(recipe.find('a')['title'])
        print(name)
        
        existing_recipe = collection.find_one({'Name': name})
        if existing_recipe:
            # add tag to existing recipe
            tags = set(existing_recipe['Tags'])
            tags.add(category)
            collection.update_one({'Name': name}, {'$set': {'Tags': list(tags)}})
            
            continue
        
        link = recipe.find('a')['href']
        tags = set()
        tags.add("Maangchi")
        tags.add(category)
        ingredients = scrape_recipe(link)
        
        collection.insert_one({
            'Name': name,
            'Link': link,
            'Ingredients': ingredients,
            'Tags': list(tags)
        })    
        
        
    

def category_links():
    base_rul = 'https://www.maangchi.com/'
    response = requests.get(base_rul)
    soup = BeautifulSoup(response.content, 'html.parser')
    recipe_container = soup.find('ul', class_='tax-list')
    recipe_links = recipe_container.find_all('a')
    for link in recipe_links:
        category_url = link['href']
        # if category url doesn't have https://www.maangchi.com/, add it
        if 'https://www.maangchi.com' not in category_url:
            category_url = 'https://www.maangchi.com' + category_url
        
        category = clean_up(link.text)
        
        # ask the user whether to scrape the category
        winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
        print(f'Scrape {category}? (y/n)')
        scrape = input()
        if scrape.lower() == 'y':
            # ask the user to confirm the category
            print(f'{category}, change or keep or skip? (type/keep/\' \')')
            confirm = input()
            if confirm.lower() == ' ':
                continue
            elif confirm.lower() == 'keep':
                scrape_category(category_url, category)
            else:
                category = confirm
                scrape_category(category_url, category)
        else:
            continue
    
category_links()
# side dish, dessert, soup, main dish, fried chicken, BBQ, Street food, one bowl meal, spicy, cold dishes, vegetarian, vegan


# sus = plus, large, small, medium, size, and, or, for, to, with, without, of, in, on, at, plural s, about, peeled, cloves, (ginger, garlic, etc), 

# Name has  ( ) tteokbokki

# missed