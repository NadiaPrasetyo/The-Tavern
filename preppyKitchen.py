# pip install beautifulsoup4 pymongo selenium

from pymongo import MongoClient

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
    return text


# Starting URL
base_url = 'https://preppykitchen.com/recipes/'

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
            # if ingredients has digits or units (pound, cup, teaspoon, tsp, tablespoon, tbs, kg, grams, inch), ask the user to fix it
            if any(char.isdigit() for char in cleaned_ing or 'pound' in cleaned_ing or 'cup' in cleaned_ing or 'teaspoon' in cleaned_ing or 'tsp' in cleaned_ing or 'tablespoon' in cleaned_ing or 'tbs' in cleaned_ing or 'kg' in cleaned_ing or 'grams' in cleaned_ing or 'inch' in cleaned_ing):
                print(f"Recipe: {name}")
                print(f"Ingredient: {cleaned_ing}")
                ing = input("Please fix the ingredient list or enter to skip: ")
                if ing != '': 
                    ingredients.append(ing)
            else:
                ingredients.append(cleaned_ing)
            

        recipe_data.append({
            'Name': name,
            'Link': link,
            'Ingredients': ingredients,
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
    
    
def scrape_by_category(url, tag):
    tags_list = [tag]
    # Get the types of dishes
    driver.get(url)
    response = driver.page_source
    soup = BeautifulSoup(response, 'html.parser')
    
    dishes_types = soup.find('ul', class_='feast-category-index-list feast-grid-half feast-desktop-grid-fourth feast-category-index-list-overlay').find_all('a')
    
    for dish_t in dishes_types:
        dish_link = dish_t['href']
        dish_name = clean_up(dish_t.find('div', class_='fsci-title').text)
        print(f"Type of dish: {dish_name}")
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
                    # if the exising recipe already has the tag, don't add it again
                    if recipe['Tag'] not in existing_recipe['Tag']:            
                        recipe['Tag'] = existing_recipe['Tag'] + recipe['Tag']
                        collection.update_one({'Name': recipe['Name']}, {'$set': recipe})
                        
                else:
                    collection.insert_one(recipe)
            current_url = find_next_page(soup)
        
        
        
        
        

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
        print("Press 'Enter' to continue")
        cat = input()
        
        scrape_by_category(category_link, cat)
        
        
        
    

# Scrape by category
scrape_all(base_url)
print("Scraping complete!")



# disconnect from MongoDB

client.close()