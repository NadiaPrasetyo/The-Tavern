# pip install beautifulsoup4 pymongo selenium

from pymongo import MongoClient

import winsound

from selenium import webdriver
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


# Starting URL
base_url = 'https://preppykitchen.com/recipes/'

# memoisation of the ingredients to the fixed ones
fixed_ingredients = {}

# Setup the Chrome driver
driver = webdriver.Chrome()

# this will go to categories <h2 class=wp-block-heading> -> <a href text> 
# then to types of dishes <ul class=feast-category-index-list feast-grid-half feast-desktop-grid-fourth feast-category-index-list-overlay> -> <a href> -> <div class=fsci-title> text / we can also take the last part of the url for the type of dish
# then to recipes <h2 class=entry-title> -> <a class=entry-title-link text>
# then ingredients <span class=wprm-recipe-ingredient-name> text / if there's nothing, there should be an a link with the ingredient text

# Function to scrape a single page of recipes
def scrape_page(url, tag):
    driver.get(url)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')

    # Find all recipes on the page
    recipes = soup.find_all('h2', class_='entry-title')  # Adjust class accordingly

    # Extract and return recipe data
    recipe_data = []
    for recipe in recipes:
        name = clean_up(recipe.find('a', class_='entry-title-link').text)
        link = recipe.find('a', class_='entry-title-link')['href']
        
        # if recipe already exists, just take the same ingredients and links
        existing_recipe = collection.find_one({'Name': name})
        if existing_recipe:
            recipe_data.append({
                'Name': name,
                'Link': existing_recipe['Link'],
                'Ingredients': existing_recipe['Ingredients'],
                'Tag': tag
            })
            continue

        # Get additional details by scraping the individual recipe page
        driver.get(link)
        recipe_response = driver.page_source
        recipe_soup = BeautifulSoup(recipe_response, 'html.parser')


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
            'Tag': tag
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
    
    
def scrape_by_category(url, tag, ul_class):
    tags_list = [tag]
    # Get the types of dishes
    driver.get(url)
    response = driver.page_source
    soup = BeautifulSoup(response, 'html.parser')
    
    if ul_class == None:
        current_url = url
        while current_url!=None:
            print(f"Scraping: {current_url}")
            recipe_data, soup = scrape_page(current_url, tags_list)
            
            # for each recipe, add to the collection if it doesn't exist, else update the tag
            for recipe in recipe_data:
                # if recipe has an empty ingredient list, skip it
                if recipe['Ingredients'] == []:
                    continue
                
                # find the existing recipe in mongoDB
                existing_recipe = collection.find_one({'Name': recipe['Name']})
                if existing_recipe:
                    changed = False
                    # if the exising recipe already has the tag, don't add it again
                    for tag_name in recipe['Tag']:
                        if tag_name not in existing_recipe['Tag']:
                            recipe['Tag'] = existing_recipe['Tag'] + [tag_name]
                            changed = True
                    if changed:
                        recipe['Tag'] = list(set(recipe['Tag']))
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                    
                    if "Wok Of Life" not in existing_recipe['Tag'] and "Preppy Kitchen" not in existing_recipe['Tag']:
                        recipe['Tag'] = existing_recipe['Tag'] + ["Preppy Kitchen"]
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                        
                else:
                    if "Preppy Kitchen" not in recipe['Tag']:
                        recipe['Tag'] = recipe['Tag'] + ["Preppy Kitchen"]
                    collection.insert_one(recipe)
            current_url = find_next_page(soup)
        return True
    
    ul = soup.find('ul', class_=ul_class)
    if ul == None:
        return False

    dishes_types = ul.find_all('a')
    
    for dish_t in dishes_types:
        dish_link = dish_t['href']
        dish_div = dish_t.find('div', class_='fsci-title')
        if dish_div == None:
            continue
        dish_name = clean_up(dish_div.text)
        print(f"Type of dish: {dish_name}")
        winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
        dish = input("Please fix the Tag, \"NO\" to not add it as a tag, enter to add it as is, or type a new tag: ")
        
        # if dish is empty, add it, if "NO" skip it, else use the input
        if dish == "NO":
            # not add to tags_list
            tags_list = tags_list
        elif dish == "":
            tags_list.append(dish_name)
        else:
            tags_list.append(dish)
        
            
        
        # Scrape the page
        current_url = dish_link
        while current_url!=None:
            print(f"Scraping: {current_url}")
            recipe_data, soup = scrape_page(current_url, tags_list)
            
            # for each recipe, add to the collection if it doesn't exist, else update the tag
            for recipe in recipe_data:
                # if recipe has an empty ingredient list, skip it
                if recipe['Ingredients'] == []:
                    continue
                
                # find the existing recipe in mongoDB
                existing_recipe = collection.find_one({'Name': recipe['Name']})
                if existing_recipe:
                    changed = False
                    # if the exising recipe already has the tag, don't add it again
                    for tag_name in recipe['Tag']:
                        if tag_name not in existing_recipe['Tag']:
                            recipe['Tag'] = existing_recipe['Tag'] + [tag_name]
                            changed = True
                    if changed:
                        recipe['Tag'] = list(set(recipe['Tag']))
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                    
                    if "Wok Of Life" not in existing_recipe['Tag'] and "Preppy Kitchen" not in existing_recipe['Tag']:
                        recipe['Tag'] = existing_recipe['Tag'] + ["Preppy Kitchen"]
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                        
                else:
                    if "Preppy Kitchen" not in recipe['Tag']:
                        recipe['Tag'] = recipe['Tag'] + ["Preppy Kitchen"]
                    collection.insert_one(recipe)
            current_url = find_next_page(soup)
    return True
        

def scrape_all(url):
    driver.get(url)
    response = driver.page_source
    base_soup = BeautifulSoup(response, 'html.parser')
    # get the course links
    category_headers = base_soup.find_all('h2', class_="wp-block-heading")
    
    for category_head in category_headers:
        category_link = category_head.find('a')['href']
        # if link doesn't have a start of "https://preppykitchen.com/" add it
        if not category_link.startswith('https://preppykitchen.com'):
            category_link = 'https://preppykitchen.com' + category_link
        
        category_name = clean_up(category_head.find('a').text)
        # Ask user to change the category name
        print(f"Category: {category_name}")
        print("Please fix the category name")
        print("Press 'Enter' to continue, 'NO' to skip, or type a new category name")
        winsound.PlaySound("public/violin-spiccato-g2-91380.wav", winsound.SND_FILENAME)
        cat = input()
        if cat == "NO":
            continue
        elif cat == "":
            cat =category_name
        if (scrape_by_category(category_link, cat, 'feast-category-index-list feast-grid-half feast-desktop-grid-fourth feast-category-index-list-overlay')):
            continue
        elif (scrape_by_category(category_link, category_name, 'feast-category-index-list feast-grid-half feast-desktop-grid-third feast-category-index-list-overlay')):
            continue
        else:
            scrape_by_category(category_link, category_name, None)
            
        
        
    

# Scrape by category
scrape_all(base_url)
print("Scraping complete!")



# disconnect from MongoDB

client.close()