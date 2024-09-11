# pip install requests beautifulsoup4 pymongo

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

collection = client['The-tavern']['RecipeList']

# Function to clean up text data
def clean_up(text):
    # remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    # remove any empty parentheses
    text = re.sub(r'\(\)', '', text)
    # replace ", )" with ")"
    text = re.sub(r',\s\)', ')', text)
    # replace "  " with " "
    text = re.sub(r'\s\s', ' ', text)
    return text.capitalize()


# # Starting URL
base_url = 'https://thewoksoflife.com/visual-recipe-index/'

# memoisation of the ingredients to the fixed ones
fixed_ingredients = {}


# Function to scrape a single page of recipes
def scrape_page(url, tag):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all recipes on the page
    recipes = soup.find_all('h2', class_='entry-title')  # Adjust class accordingly

    # Extract and return recipe data
    recipe_data = []
    for recipe in recipes:
        name = clean_up(recipe.find('a', class_='entry-title-link').text)
        
        # if recipe already exists, just take the same ingredients and links
        existing_recipe = collection.find_one({'Name': name})
        if existing_recipe:
            recipe_data.append({
                'Name': name,
                'Link': existing_recipe['Link'],
                'Ingredients': existing_recipe['Ingredients'],
                'Tag': [tag]
            })
            continue
        
        link = recipe.find('a', class_='entry-title-link')['href']

        # Get additional details by scraping the individual recipe page
        recipe_response = requests.get(link)
        recipe_soup = BeautifulSoup(recipe_response.content, 'html.parser')


        ingredients = []
        for ingredient in recipe_soup.find_all('span', class_='wprm-recipe-ingredient-name'):            
            # if there's nothing, there should be a link with the ingredient   
            cleaned_ing = ''         
            if ingredient.text == '':
                cleaned_ing = clean_up(ingredient.find('a').text)
            else:
                cleaned_ing = clean_up(ingredient.text)
            # if ingredients has digits or units (pound, cup, teaspoon, tsp, tablespoon, tbs, kg, grams, inch, drop, small, medium, large, wad, dollop, drizzle, slice, chop, dash), ask the user to fix it
            if any(char.isdigit() for char in cleaned_ing or 'pound' in cleaned_ing or 'cup' in cleaned_ing or 'teaspoon' in cleaned_ing or 'tsp' in cleaned_ing or 'tablespoon' in cleaned_ing or 'tbs' in cleaned_ing or 'kg' in cleaned_ing or 'grams' in cleaned_ing or 'inch' in cleaned_ing or 'drop' in cleaned_ing or 'small' in cleaned_ing or 'medium' in cleaned_ing or 'large' in cleaned_ing or 'wad' in cleaned_ing or 'dollop' in cleaned_ing or 'drizzle' in cleaned_ing or 'slice' in cleaned_ing or 'chop' in cleaned_ing or 'dash' in cleaned_ing):
                # if the ingredient is already fixed, use the fixed one
                if cleaned_ing in fixed_ingredients:
                    if fixed_ingredients[cleaned_ing] != '':
                        ingredients.append(fixed_ingredients[cleaned_ing])
                    else:
                        True
                    continue
                
                print(f"Recipe: {name}")
                print(f"Ingredient: {cleaned_ing}")
                winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
                ing = input("Please fix the ingredient list or enter to skip: ")
                fixed_ingredients[cleaned_ing] = ing
                if ing != '': 
                    ing = clean_up(ing)
                    ingredients.append(ing)
            else:
                ingredients.append(cleaned_ing)
            

        recipe_data.append({
            'Name': name,
            'Link': link,
            'Ingredients': list(set(ingredients)),
            'Tag': [tag]
        })
    
    return recipe_data, soup

# Function to find the next page link
def find_next_page(soup):
    # if there's no next button, return None
    if not soup.find('li', class_='pagination-next'):
        return None
    
    next_button = soup.find('li', class_='pagination-next').find('a')  # Adjust class based on actual structure
    if next_button:
        return next_button['href']
    else:
        return None

def scrape_by_category(url, class_name):
    response = requests.get(url)
    base_soup = BeautifulSoup(response.content, 'html.parser')
    
    # get the course links
    course_links = base_soup.find('li', class_=class_name).find('ul', class_='sub-menu').find_all('a')
    
    for course_link in course_links:
        course_url = course_link['href']
        course_name = course_link.find('span').text
        
        # scrape the course
        current_url = course_url
        while current_url!=None:
            print(f"Scraping: {current_url}")
            recipes, soup = scrape_page(current_url, course_name)

            # Modify the recipe data to include the tag
            for recipe in recipes:
                # if recipe has an empty ingredient list, skip it
                if recipe['Ingredients'] == []:
                    continue
                
                # find the existing recipe in mongoDB
                existing_recipe = collection.find_one({'Name': recipe['Name']})
                if existing_recipe:
                    # if the exising recipe already has the tag, don't add it again
                    if recipe['Tag'][0] not in existing_recipe['Tag']:            
                        recipe['Tag'] = existing_recipe['Tag'] + recipe['Tag']
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                        
                    if "Wok Of Life" not in existing_recipe['Tag']:
                        recipe['Tag'] = existing_recipe['Tag'] + ["Wok Of Life"]
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                else:
                    if "WokOfLife" not in recipe['Tag']:
                        recipe['Tag'] = recipe['Tag'] + ["Wok Of Life"]
                    collection.insert_one(recipe)
            # Find the next page
            current_url = find_next_page(soup)
    

# Scrape by category
course = 'menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-50587'
collect = 'menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-50586'
scrape_by_category(base_url, course)
scrape_by_category(base_url, collect)
print("Scraping complete!")



# disconnect from MongoDB

client.close()