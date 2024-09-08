# pip install requests beautifulsoup4 pymongo

from pymongo import MongoClient

import requests
from bs4 import BeautifulSoup
import csv
from dotenv import load_dotenv
import os
import re



# connect to MongoDB from the .env file MONGODB_URI
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)

collection = client['The-tavern']['RecipeList']


# Function to remove non-ASCII characters
def remove_non_ascii(text):
    return re.sub(r'[^\x00-\x7F]+', '', text)


# # Starting URL
base_url = 'https://thewoksoflife.com/visual-recipe-index/'


# Function to scrape a single page of recipes
def scrape_page(url, tag):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all recipes on the page
    recipes = soup.find_all('h2', class_='entry-title')  # Adjust class accordingly

    # Extract and return recipe data
    recipe_data = []
    for recipe in recipes:
        name = remove_non_ascii(recipe.find('a', class_='entry-title-link').text)
        link = recipe.find('a', class_='entry-title-link')['href']

        # Get additional details by scraping the individual recipe page
        recipe_response = requests.get(link)
        recipe_soup = BeautifulSoup(recipe_response.content, 'html.parser')


        ingredients = []
        for ingredient in recipe_soup.find_all('span', class_='wprm-recipe-ingredient-name'):            
            # if there's nothing, there should be a link with the ingredient            
            if ingredient.text == '':
                cleaned_ing = remove_non_ascii(ingredient.find('a').text)
                ingredients += [cleaned_ing]
            else:
                cleaned_ing = remove_non_ascii(ingredient.text)
                ingredients += [cleaned_ing]

        recipe_data.append({
            'Name': name,
            'Link': link,
            'Ingredients': ingredients,
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

def scrape_by_course(url):
    response = requests.get(url)
    base_soup = BeautifulSoup(response.content, 'html.parser')
    
    # get the course links
    course_links = base_soup.find('li', class_='menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-50587').find('ul', class_='sub-menu').find_all('a')
    
    for course_link in course_links:
        course_url = course_link['href']
        course_name = course_link.find('span').text
        
        # scrape the course
        current_url = course_url
        while current_url!=None:
            print(f"Scraping: {current_url}")
            recipes, soup = scrape_page(current_url, course_name)

            # Write recipes to the CSV
            for recipe in recipes:
                writer.writerow(recipe)
                collection.insert_one(recipe)

            # Find the next page
            current_url = find_next_page(soup)
    


# Open a CSV file to store the results
with open('recipes.csv', 'w', newline='') as csvfile:
    fieldnames = ['Name', 'Link', 'Ingredients', 'Tag']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    # Scrape by course
    scrape_by_course(base_url)

    print("Scraping complete!")


# disconnect from MongoDB

client.close()