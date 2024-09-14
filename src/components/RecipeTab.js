import React, { useState, useEffect } from 'react';
import { TbSearch } from "react-icons/tb";
import { IoIosHourglass } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdOutlineStarBorderPurple500 } from "react-icons/md";

import RecipeInfo from './RecipeInfo';
import FilterPopup from './FilterPop';
import '../App.css';

const RecipeTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // The current page
  const [searchQuery, setSearchQuery] = useState(''); // The search input value
  const [recipes, setRecipes] = useState([]); // The fetched recipes
  const [totalPages, setTotalPages] = useState(1); // The total number of pages
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [recipePage, setRecipePage] = useState(1); // The current recipe page
  const [isInfoOpen, setInfoOpen] = useState(false); // The recipe info modal state
  const [selectedRecipe, setSelectedRecipe] = useState(null); // The selected recipe for the info modal
  const [isFilterOpen, setIsFilterOpen] = useState(false); // The filter popup state
  const [availableTags, setAvailableTags] = useState([]); // The available tags for filtering
  const [availableIngredients, setAvailableIngredients] = useState([]); // The available ingredients for filtering
  const [includedTags, setIncludedTags] = useState([]); // The included tags for filtering
  const [excludedTags, setExcludedTags] = useState([]); // The excluded tags for filtering
  const [includedIngredients, setIncludedIngredients] = useState([]); // The included ingredients for filtering
  const [excludedIngredients, setExcludedIngredients] = useState([]); // The excluded ingredients for filtering


  const recipesPerPage = 10; // Limit the number of recipes per page
  const max_tags = 3; // Limit the number of tags to display
  const max_ingredients = 4; // Limit the number of ingredients to display

  // Toggle the book tab when clicking the container
  const toggleBook = () => {
    // close the filter popup when the book tab is closed
    if (isOpen) {
      setIsFilterOpen(false);
    }
    // close the recipe info modal when the book tab is closed
    if (isInfoOpen) {
      setInfoOpen(false);
      setSelectedRecipe(null);
    }

    setIsOpen(!isOpen);
  };

  // Change the content of the book based on the clicked bookmark
  const changePage = (page) => {
    setCurrentPage(page);
    // close the filter popup when changing the page
    setIsFilterOpen(false);
    // close the recipe info modal when changing the page
    if (isInfoOpen) {
      setInfoOpen(false);
      setSelectedRecipe(null);
    }
  };

  // Handle the search input change and reset the page to 1
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setRecipePage(1); // Reset the current page to 1 whenever the search input changes
  };

  // Fetch recipes from the server based on the current page, search query, includedItems, and excludedItems
  const fetchRecipes = async (page, query, includedTags = [],  excludedTags = [], includedIngredients = [],  excludedIngredients = []) => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST', // Change to POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                limit: recipesPerPage,
                search: query,
                includeT : includedTags,
                excludeT : excludedTags,
                includeI : includedIngredients,
                excludeI : excludedIngredients
            }),
        });
        
        const data = await response.json();

        // if data.recipes is undefined, set it to an empty array
        if (!data.recipes) {
            data.recipes = [];
        }

        setRecipes(data.recipes); // Set the recipes returned from the backend

        // if total pages is undefined or less than 1, set it to 1
        if (!data.totalPages || data.totalPages < 1) {
            data.totalPages = 1;
        }

        setTotalPages(data.totalPages); // Set the total number of pages

        setAvailableIngredients(data.ingredients.sort()); // Set the available ingredients for filtering
        setAvailableTags(data.tags.sort()); // Set the available tags for filtering


    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  // Fetch recipes when `recipePage`, `searchQuery`, `includedTags`, `excludedTags`, `includedIngredients`, or `excludedIngredients` change
  useEffect(() => {
    if (isOpen) {
        fetchRecipes(recipePage, searchQuery, includedTags, excludedTags, includedIngredients, excludedIngredients);
    }
  }, [recipePage, searchQuery, isOpen, includedTags, excludedTags, includedIngredients, excludedIngredients]);


  // Handle pagination (next and previous page)
  const nextPage = () => {
    if (recipePage < totalPages) {
      setRecipePage(recipePage + 1);
    }
  };

  const prevPage = () => {
    if (recipePage > 1) {
      setRecipePage(recipePage - 1);
    }
  };

  // Toggle the recipe info modal
  const toggleInfo = (recipe) => {
    setSelectedRecipe(recipe);
    setInfoOpen(!isInfoOpen);
  };

  const closeInfo = () => {
    setInfoOpen(false);
    setSelectedRecipe(null);
  }

  // Toggle the filter popup
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  }

  const handleFiltersChange = (includedTags, excludedTags, includedIngredients, excludedIngredients) => {
    setIncludedTags(includedTags);
    setExcludedTags(excludedTags);
    setIncludedIngredients(includedIngredients);
    setExcludedIngredients(excludedIngredients);
    setRecipePage(1); // Reset the current page to 1 whenever the filters change
  };

  return (
    <div className={`recipe-tab-container ${isOpen ? "open" : ""}`}>
      {/* Book content area */}
      <div className='book-container background' onClick={toggleBook}>
        <div className="book-container" onClick={toggleBook}>
          <div className="book-content">
            {currentPage === 1 &&
              <div className='browse-recipe'>
                <div className='tab-title'>BROWSE RECIPES</div>
                <div className='search-bar-container' onClick={(e) => e.stopPropagation()}>
                  <input
                    className='search-bar'
                    type='text'
                    placeholder='Search for recipes'
                    value={searchQuery}
                    onChange={handleSearch} // Trigger search and page reset on input change
                  />
                  <TbSearch className='search-icon' />
                  <LuFilter className='filter-icon' onClick={() => toggleFilter()} />
                </div>

                {/* Recipe container with pagination */}
                <div className='recipe-containers custom-scroll' onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                      <div className='recipe-list' key={index}>
                        <div className='recipe-title'>
                          <a href={recipe.Link} target="_blank" rel="noopener noreferrer">
                            {recipe.Name}
                          </a>
                          <div className="icon-container"> {/* Added container for icons */}
                            <AiOutlineInfoCircle className='info-icon' onClick={() => toggleInfo(recipe)} />
                            <MdOutlineStarPurple500 className='star-icon filled' />
                            <MdOutlineStarBorderPurple500 className='star-icon border' />
                          </div>
                        </div>
                        <div className='recipe-tags'>
                          {recipe.Tag.slice(0, max_tags).map((tag, index) => (
                            <span className='r-tag' key={index}>{tag}</span>
                          ))}
                        </div>
                        <div className='recipe-ingredients'>
                          {recipe.Ingredients.slice(0, max_ingredients).map((ingredient, index) => (
                            <span className='r-ing' key={index}>{ingredient}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No recipes found</div>
                  )}
                  <RecipeInfo isOpen={isInfoOpen} onClose={closeInfo} recipe={selectedRecipe} />
                  <FilterPopup isOpen={isFilterOpen} onClose={closeFilter} availableTags={availableTags} availableIngredients={availableIngredients} onFiltersChange={handleFiltersChange} />
                </div>

                {/* Pagination controls */}
                <div className='pagination-controls' onClick={(e) => e.stopPropagation()}>
                  <button className='prev-btn' onClick={prevPage} disabled={recipePage === 1}>
                    Previous
                  </button>
                  <span className='page-num'>Page {recipePage} of {totalPages}</span>
                  <button className='next-btn' onClick={nextPage} disabled={recipePage === totalPages}>
                    Next
                  </button>
                </div>
              </div>
            }
            {currentPage === 2 &&
              <div className='recommendation-tab'>
                <div className='tab-title'>RECOMMENDATION</div>
                <div className='search-bar-container' onClick={(e) => e.stopPropagation()}>
                  <input className='search-bar' type='text' placeholder='Search for recipes' />
                  <TbSearch className='search-icon' />
                  <LuFilter className='filter-icon' />
                </div>
                <div className='recipe-containers custom-scroll'>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 1</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 2</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 3</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 4</div>
                </div>
              </div>
            }
            {currentPage === 3 &&
              <div className='history-tab'>
                <div className='tab-title'>HISTORY</div>
                <div className='search-bar-container' onClick={(e) => e.stopPropagation()}>
                  <input className='search-bar' type='text' placeholder='Search for recipes' />
                  <TbSearch className='search-icon' />
                  <LuFilter className='filter-icon' />
                </div>
                <div className='recipe-containers custom-scroll'>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 1</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 2</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 3</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 4</div>
                </div>
              </div>
            }
            {currentPage === 4 &&
              <div className='favourite-tab'>
                <div className='tab-title'>FAVOURITES</div>
                <div className='search-bar-container' onClick={(e) => e.stopPropagation()}>
                  <input className='search-bar' type='text' placeholder='Search for recipes' />
                  <TbSearch className='search-icon' />
                  <LuFilter className='filter-icon' />
                </div>
                <div className='recipe-containers custom-scroll'>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 1</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 2</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 3</div>
                  <div className='recipe-list' onClick={(e) => e.stopPropagation()}>Recipe 4</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Bookmarks (always visible) */}
      <div className={`bookmarks ${isOpen ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div onClick={() => changePage(1)} className={`bookmark ${currentPage === 1 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <TbSearch size={30} />
        </div>
        <div onClick={() => changePage(2)} className={`bookmark ${currentPage === 2 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <LuBookOpenCheck size={30} />
        </div>
        <div onClick={() => changePage(3)} className={`bookmark ${currentPage === 3 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <IoIosHourglass size={30} />
        </div>
        <div onClick={() => changePage(4)} className={`bookmark ${currentPage === 4 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <MdOutlineStarPurple500 size={30} />
        </div>
      </div>
    </div>
  );
};

export default RecipeTab;
