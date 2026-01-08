import React, { useState, useEffect, useRef } from 'react';
import { TbSearch } from "react-icons/tb";
import { RiDiceLine } from "react-icons/ri";
import { FaDiceD20 } from "react-icons/fa";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Droppable } from 'react-beautiful-dnd';
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import Recipe from './Recipe';
import RecipeInfo from './RecipeInfo';
import FilterPopup from './FilterPop';
import Loading from './Loading';
import DropDown from './DropDown';
import '../App.css';

/**
 * RECIPE TAB COMPONENT of the application
 * @param {object} userdata the user data
 * @param {function} setRecipeList the function to set the recipe list
 * @param {boolean} isOpenDrag the state of the drag
 * @param {function} setIsOpenDrag the function to set the drag state
 * @returns the recipe tab
 */
const RecipeTab = ({ userdata, setRecipeList, isOpenDrag, setIsOpenDrag,  }) => {
  const [isOpen, setIsOpen] = useState(false); // The book tab state (open or closed)
  const [currentPage, setCurrentPage] = useState(1); // The current page of the book tab
  const [searchQuery, setSearchQuery] = useState(''); // The search input value
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // Add a debounced version of the search query
  const [recipes, setRecipes] = useState([]); // The fetched recipes array
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
  const [favouriteRecipes, setFavouriteRecipes] = useState([]); // State for favourite recipes
  const [favouriteSet, setFavouriteSet] = useState(new Set()); // Set for favorite recipes (to check if a recipe is a favourite, cannot have duplicates)
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false); // Loading state for favourites
  const [recommendationRecipes, setRecommendationRecipes] = useState([]); // State for recommendation recipes
  const [isOpenRecommendation, setIsOpenRecommendation] = useState(false); // The recommendation tab state
  const [recipePageRecommendation, setRecipePageRecommendation] = useState(1); // The current recipe page for recommendations
  const [recommendationMessage, setRecommendationMessage] = useState('No recommendations'); // The recommendation message
  const [isVisibleRecPopUp, setIsVisibleRecPopUp] = useState(false); // The recommendation info popup state
  const [dropDownOpen, setDropDownOpen] = useState(false); // The dropdown state (used as alert)
  const [randomRecipe, setRandomRecipe] = useState(null); // The random recipe 
  const [successAlertOpen, setSuccessAlertOpen] = useState(false); // The info text for alerts

  const containerRef = useRef(null); // Reference to the container element
  const [containerMaxHeight, setContainerMaxHeight] = useState(0); // The maximum height of the container

  const favouriteMax = 10; // Maximum number of favourite recipes
  const recipesPerPage = 10; // Limit the number of recipes per page
  const max_tags = 3; // Limit the number of tags to display
  const max_ingredients = 4; // Limit the number of ingredients to display

  // if there's changes in isOpenDrag, set isOpen to it 
  useEffect(() => {
    setIsOpen(isOpenDrag);
    // close the recipe info modal when the book tab is closed
    if (!isOpenDrag) {
      setInfoOpen(false);
      setSelectedRecipe(null);
    }
    // close the filter popup when the book tab is closed
    setIsFilterOpen(false);

  }, [isOpenDrag]);

  // Toggle the book tab when clicking the container
  const toggleBook = () => {
    // close the filter popup when the book tab is closed
    setIsFilterOpen(false);
    // close the recipe info modal 
    setInfoOpen(false);
    setSelectedRecipe(null);

    setIsOpen(!isOpen);
    setIsOpenDrag(!isOpen);
  };

  /**
   * Function to get the computed max height of the container
   * @returns the computed max height of the container
   */
  function getComputedMaxHeight() {
    // get container height
    const containerHeight = containerRef.current.offsetHeight;
    let totalHeaderHeight = 0;
    const headerHeight = containerRef.current.querySelector('.tab-title').offsetHeight; // Get the height of the tab title
    totalHeaderHeight += headerHeight;
    if (containerRef.current.querySelector('.search-bar-container')) { // Check if the search bar exists
      const searchHeight = containerRef.current.querySelector('.search-bar-container').offsetHeight;
      totalHeaderHeight += searchHeight; // Add the height of the search bar
    }
    if (containerRef.current.querySelector('.pagination-controls')) { // Check if the pagination controls exist
      const paginationHeight = containerRef.current.querySelector('.pagination-controls').offsetHeight;
      totalHeaderHeight += paginationHeight + 30; // add the height of the pagination controls and some extra padding
    }
    // Calculate available height for recipes
    const availableHeight = containerHeight - totalHeaderHeight - 40; // Adjust for any extra padding/margins
    return availableHeight > 0 ? availableHeight : 0;
  }

  useEffect(() => {
    if (isOpen) {
      // Recalculate max height after the currentPage changes
      setContainerMaxHeight(getComputedMaxHeight());
    }
  }, [currentPage, isOpen]);

  // Debounce resize handler to avoid multiple recalculations on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setContainerMaxHeight(getComputedMaxHeight());
      }
    };
    
    /**
     * Function to debounce the resize event
     */
    const debounceResize = () => {
      setIsFilterOpen(false);
      setInfoOpen(false);
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(handleResize, 100); // 100ms debounce
    };

    window.addEventListener('resize', debounceResize);

    return () => {
      window.removeEventListener('resize', debounceResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [isOpen]);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  /**
   * Function to change the current page
   * @param {int} page 
   */
  const changePage = (page) => {
    // set the current page
    setCurrentPage(page);
    // close the filter popup when changing the page
    setIsFilterOpen(false);
    // close the recipe info modal when changing the page
    if (isInfoOpen) {
      setInfoOpen(false);
      setSelectedRecipe(null);
    }

    if (page === 2) { // Open the recommendation tab
      setIsOpenRecommendation(true);
    } else { // Close the recommendation tab
      setIsOpenRecommendation(false);
    }

    if (page ===3){
      // random page
      getRandomRecipe();
    }

    // Fetch favourite recipes when the Favourites page is clicked
    if (page === 4) {
      getFavourites();
    }
  };

  /**
   * Handle the search input change and reset the page to 1
   * @param {Event} e 
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Set the search query
    setRecipePage(1); // Reset the current page to 1 whenever the search input changes
    setRecipePageRecommendation(1); // Reset the current page to 1 whenever the search input changes
  };

  /**
   * Fetch recipes from the server based on the current page, search query, includedItems, and excludedItems
   * @param {int} page 
   * @param {string} query 
   * @param {Array} includedTags 
   * @param {Array} excludedTags 
   * @param {Array} includedIngredients 
   * @param {Array} excludedIngredients 
   */
  const fetchRecipes = async (page, query, includedTags = [], excludedTags = [], includedIngredients = [], excludedIngredients = []) => {
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
          includeT: includedTags,
          excludeT: excludedTags,
          includeI: includedIngredients,
          excludeI: excludedIngredients
        }),
      });

      const data = await response.json();

      // if data.recipes is undefined, set it to an empty array
      if (!data.recipes) {
        data.recipes = [];
      }

      setRecipes(data.recipes); // Set the recipes returned from the backend
      setRecipeList(data.recipes); // Set the recipes returned from the backend

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

  // Fetch recipes on initial load, when the search query changes, or when the page changes, and when the filters change
  useEffect(() => { 
    if (isOpen && currentPage === 1) { // Only fetch recipes when the book tab is open and the current page is 1 (browse recipes)
      fetchRecipes(recipePage, debouncedSearchQuery, includedTags, excludedTags, includedIngredients, excludedIngredients);
    }
  }, [recipePage, debouncedSearchQuery, isOpen, includedTags, excludedTags, includedIngredients, excludedIngredients, currentPage]);


  // Handle pagination (next and previous page)
  const nextPage = () => {
    if (isOpenRecommendation) { // Check if the recommendation tab is open
      if (recipePageRecommendation < totalPages) {
        setRecipePageRecommendation(recipePageRecommendation + 1);
      }
    } else if (recipePage < totalPages) { // Check if the browse recipes tab is open
      setRecipePage(recipePage + 1);
    }
  };

  const prevPage = () => {
    if (isOpenRecommendation) {
      if (recipePageRecommendation > 1) {
        setRecipePageRecommendation(recipePageRecommendation - 1);
      }
    } else if (recipePage > 1) {
      setRecipePage(recipePage - 1);
    }
  };

  /**
   * Function to toggle the recipe info modal
   * @param {dictionary} recipe 
   * @param {Event} e 
   */
  const toggleInfo = (recipe, e) => {
    e.stopPropagation();
    if (e.type === 'touchstart') {
      setTimeout(() => {
        setSelectedRecipe(recipe);
        setInfoOpen(!isInfoOpen);
      }, 300); // Delay the opening of the info modal on touch devices
    } else {
      setSelectedRecipe(recipe);
      setInfoOpen(!isInfoOpen);
    }
  };

  /**
   * Function to close the recipe info modal
   * @param {Event} e
  */
  const closeInfo = (e) => {
    e.stopPropagation();
    if (e.type === 'touchstart') {
      setTimeout(() => {
        setInfoOpen(false);
        setSelectedRecipe(null);
      }, 300); // Delay the closing of the info modal on touch devices
    } else {
      setInfoOpen(false);
      setSelectedRecipe(null);
    }
  };

  // Toggle the filter popup
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => { // Close the filter popup
    setIsFilterOpen(false);
  }

  /**
   * Function to handle the filters change
   * @param {Array} includedTags 
   * @param {Array} excludedTags 
   * @param {Array} includedIngredients 
   * @param {Array} excludedIngredients 
   */
  const handleFiltersChange = (includedTags, excludedTags, includedIngredients, excludedIngredients) => {
    setIncludedTags(includedTags);
    setExcludedTags(excludedTags);
    setIncludedIngredients(includedIngredients);
    setExcludedIngredients(excludedIngredients);
    setRecipePage(1); // Reset the current page to 1 whenever the filters change
    setRecipePageRecommendation(1); // Reset the current page to 1 whenever the filters change
  };

  // FAVOURITES FUNCTIONS

  /**
   * Function to add a favourite recipe
   * @param {dictionary} recipe 
   * @returns true if successful, false otherwise
   */
  const addFavourite = async (recipe) => {
    try {
      const response = await fetch('/api/add-favorite-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: recipe.Name,
          max_favourites: favouriteMax,
        }),
      });

      const data = await response.json();
      if (response.status === 409) {
        // make it known that the user has reached the maximum number of favourites
        // open dropdown instead of alert
        setDropDownOpen(true);
        // console.log(data.message);
        return false;
      } else if (response.status === 200) {
        return true;
      } else {
        console.log(data.message);
        return false;
      }

    } catch (error) {
      console.error("Error adding favourite:", error);
    }
  };

  /**
   * Function to remove a favourite recipe
   * @param {dictionary} recipe
   * @returns true if successful, false otherwise
   */
  const removeFavourite = async (recipe) => {
    try {
      const response = await fetch('/api/remove-favorite-recipe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,
          Name: recipe.Name,
        }),
      });

      const data = await response.json();

      if (response.status === 404) { // if the recipe is not found
        console.log(data.message);
        return false;
      } else if (response.status === 200) { // if successful
        console.log(data.message);
        return true;
      }

    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  /**
   * Function to toggle a favourite recipe
   * @param {dictionary} recipe
   */
  const toggleFavourite = async (recipe) => {
    const updatedFavourites = new Set(favouriteSet);

    if (favouriteSet.has(recipe.Name)) { // Check if the recipe is already a favourite
      const removeSuccess = await removeFavourite(recipe); // Update backend and check for success
      if (removeSuccess) { // If successful, remove the recipe from the favourites
        updatedFavourites.delete(recipe.Name);
        setFavouriteSet(updatedFavourites); // Only update the state if successful
      }
    } else {
      const addSuccess = await addFavourite(recipe); // Update backend and check for success
      if (addSuccess) { // If successful, add the recipe to the favourites
        updatedFavourites.add(recipe.Name);
        setFavouriteSet(updatedFavourites); // Only update the state if successful
      }
    }
  };


  // Get all favourite recipes
  const getFavourites = async () => {
    setIsLoadingFavourites(true);
    try {
      const username = userdata.username;
      const response = await fetch(`/api/get-favorite-recipes?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!data.favourites) { // if favourites is undefined, set it to an empty array
        data.favourites = [];
      }
      setFavouriteRecipes(data.favourites); // Set the favourite recipes
      const favSet = new Set(data.favourites.map((recipe) => recipe.Name)); // Create a set of favourite recipes
      setFavouriteSet(favSet);
      setRecipeList(data.favourites);
      

    } catch (error) {
      console.error("Error getting favourites:", error);
    }
    setIsLoadingFavourites(false);
  };

  // RECOMENDATION FUNCTIONS

  /**
   * Function to fetch recommendations based on the current page, search query, includedTags, excludedTags, includedIngredients, and excludedIngredients
   * @param {int} page
   * @param {string} query
   * @param {Array} includedTags
   * @param {Array} excludedTags
   * @param {Array} includedIngredients
   * @param {Array} excludedIngredients
   */
  const fetchRecommendations = async (page, query, includedTags = [], excludedTags = [], includedIngredients = [], excludedIngredients = []) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userdata.username,
          page: page,
          limit: recipesPerPage,
          search: query,
          includeT: includedTags,
          excludeT: excludedTags,
          includeI: includedIngredients,
          excludeI: excludedIngredients
        }),
      });

      const data = await response.json(); // Get the response data

      // if data.recipes is undefined, set it to an empty array
      if (!data.recipes) {
        data.recipes = [];
        setRecommendationMessage('No recommendations');
      }

      if (data.recipes.length === 0) { // if no recipes are found
        setRecommendationMessage(data.message);
      }

      setRecommendationRecipes(data.recipes); // Set the recipes returned from the backend
      setTotalPages(data.totalPages); // Set the total number of pages
      setAvailableIngredients(data.ingredients.sort()); // Set the available ingredients for filtering
      setAvailableTags(data.tags.sort()); // Set the available tags for filtering

      setRecipeList(data.recipes); // Set the recipes returned from the menu

    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => { // Fetch recommendations on initial load, when the search query changes, or when the page changes, and when the filters change
    if (isOpenRecommendation) { // Only fetch recommendations when the recommendation tab is open
      fetchRecommendations(recipePageRecommendation, debouncedSearchQuery, includedTags, excludedTags, includedIngredients, excludedIngredients);
    }
  }, [recipePageRecommendation, debouncedSearchQuery, isOpenRecommendation, includedTags, excludedTags, includedIngredients, excludedIngredients]);

  /**
   * Function to toggle the info popup for the recommendation
   * @param {Event} e 
   */
  const toggleRecInfo = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up
    setIsVisibleRecPopUp(!isVisibleRecPopUp); // Toggle the recommendation info popup
  }


  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isVisibleRecPopUp) {
        setIsVisibleRecPopUp(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', (e) => { // Close the popup when pressing the escape key
      if (e.key === 'Escape') {
        setIsVisibleRecPopUp(false);
      }
    });

    // Set a timeout to close the popup automatically after 5 seconds
    const timeoutId = setTimeout(() => {
      if (isVisibleRecPopUp) {
        setIsVisibleRecPopUp(false);
      }
    }, 5000); 

    return () => { // Cleanup
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          setIsVisibleRecPopUp(false);
        }
      });
      clearTimeout(timeoutId); // Clear the timeout on cleanup
    };
  }, [isVisibleRecPopUp]); // Run the effect when isVisibleRecPopUp changes

  // Get a random recipe
  const getRandomRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-random-recipe-unfiltered', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.recipe) {
        console.log(data.message);
        return;
      }

      setRandomRecipe(data.recipe[0]); // Set the random recipe
      setRecipeList(data.recipe); // Set the recipe list

    }
    catch (error) {
      console.error("Error getting random recipe:", error);
    }
    setIsLoading(false);
  }

  // ADDING RECIPE FUNCTIONS
  const handleAddRecipe = (e) => {
    const username = userdata.username;
    e.preventDefault();
    // get the form data
    const form = e.target;
    const formData = new FormData(form);
    // correct the comma separated inputs to arrays, the rest stays as Strings
    const tags = formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    // add username to the tags of the new recipe
    tags.push(username);
    const ingredients = formData.get('ingredients').split(',').map(ing => ing.trim()).filter(ing => ing !== '');
    const newRecipe = {
      Name: formData.get('title'),
      Ingredients: ingredients,
      Tags: tags,
      IngredientAmounts: formData.get('ingredientAmounts'),
      Instructions: formData.get('instructions'),
    };
    console.log(newRecipe);
    // send the new recipe to the backend
    fetch('/api/add-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecipe),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      // clear the form
      form.reset();
      // popup alert to inform the user that the recipe was added successfully
      setSuccessAlertOpen(true);
    })
    .catch(error => {
      console.error("Error adding recipe:", error);
    });
  };

  return (
    <>
    <DropDown isOpen={dropDownOpen} setIsOpen={setDropDownOpen} options={[{label: 'Okay'}]} message={'You already have the maximum amount of favorite recipes'}/>
    <div className={`recipe-tab-container ${isOpen ? "recipe-open" : ""}`} ref={containerRef}>
      {/* Book content area */}
      <div className='book-container background' onClick={toggleBook}>
        <div className="book-container" onClick={toggleBook}>
          <div className="book-content">
            {/* Browse recipes (default) */}
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
                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <div className='loading-cont'>
                      <Loading />
                    </div>
                  ) : recipes.length > 0 ? (
                    <Droppable droppableId="RecipeList">
                      {(provided) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {recipes.map((recipe, index) => (
                            <Recipe recipe={recipe} 
                            index={index} 
                            toggleInfo={toggleInfo} 
                            toggleFavourite={toggleFavourite} 
                            favouriteSet={favouriteSet}
                            max_tags={max_tags}
                            max_ingredients={max_ingredients}/>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div className='no-result'>No recipes found</div>
                  )}
                </div>

                {/* Pagination controls */}
                <div className='pagination-controls' onClick={(e) => e.stopPropagation()}>
                  <button className='prev-btn' onClick={prevPage} disabled={recipePage === 1}>
                    Prev
                  </button>
                  <button className='prev-media' onClick={prevPage} disabled={recipePage === 1}>
                    <GrPrevious size={10} />
                  </button>

                  <span className='page-num'>Page {recipePage} of {totalPages}</span>
                  <span className='page-num-media'>{recipePage} / {totalPages}</span>
                  <button className='next-btn' onClick={nextPage} disabled={recipePage === totalPages}>
                    Next
                  </button>
                  <button className='next-media' onClick={nextPage} disabled={recipePage === totalPages}>
                    <GrNext size={10} />
                  </button>
                </div>
              </div>
            }
            {/* Recommendation tab */}
            {currentPage === 2 &&
              <div className='recommendation-tab'>
                <div className='tab-title'>RECOMMENDATION</div>
                <AiOutlineInfoCircle className='recommendation-info' onClick={toggleRecInfo} />
                {isVisibleRecPopUp && (
                  <div className="rec-info-popup">
                    <p>We recommend recipes based on the ingredients you have. The more matching ingredients, the higher the recipe appears.</p>
                  </div>
                )}
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

                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <div className='loading-cont'>
                      <Loading />
                    </div>
                  ) : recommendationRecipes.length > 0 ? (
                    <Droppable droppableId="RecipeList">
                      {(provided) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {recommendationRecipes.map((recipe, index) => (
                            <Recipe recipe={recipe} 
                            index={index} 
                            toggleInfo={toggleInfo} 
                            toggleFavourite={toggleFavourite} 
                            favouriteSet={favouriteSet}
                            max_tags={max_tags}
                            max_ingredients={max_ingredients}/>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div className='no-result'>{recommendationMessage}</div>
                  )}
                </div>
                {/* Pagination controls */}
                <div className='pagination-controls' onClick={(e) => e.stopPropagation()}>
                  <button className='prev-btn' onClick={prevPage} disabled={recipePageRecommendation === 1}>
                    Prev
                  </button>
                  <button className='prev-media' onClick={prevPage} disabled={recipePageRecommendation === 1}>
                    <GrPrevious size={10} />
                  </button>
                  <span className='page-num'>Page {recipePageRecommendation} of {totalPages}</span>
                  <span className='page-num-media'>{recipePageRecommendation} / {totalPages}</span>
                  <button className='next-btn' onClick={nextPage} disabled={recipePageRecommendation === totalPages}>
                    Next
                  </button>
                  <button className='next-media' onClick={nextPage} disabled={recipePageRecommendation === totalPages}>
                    <GrNext size={10} />
                  </button>
                </div>
              </div>
            }
            {/* Random tab */}
            {currentPage === 3 &&
              <div className='random-tab'>
                <div className='tab-title'>RANDOM</div>
                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <div className='loading-cont'>
                      <Loading />
                    </div>
                  ) : randomRecipe ? (
                    <Droppable droppableId="RecipeList">
                      {(provided) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}>
                          <Recipe recipe={randomRecipe} 
                          index={0} 
                          toggleInfo={toggleInfo} 
                          toggleFavourite={toggleFavourite} 
                          favouriteSet={favouriteSet}
                          max_tags={max_tags}
                          max_ingredients={max_ingredients}/>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div className='no-result'>No random recipe found</div>
                  )}
                </div>
                {/* button for random */}
                <div className='random-btn-container' onClick={(e) => e.stopPropagation()}>
                  <button className='random-btn' onClick={getRandomRecipe} >
                    Get Random Recipe <RiDiceLine className='random-icon' size={20} />
                  </button>
                </div>
              </div>
            }
            {/* Favourites tab */}
            {currentPage === 4 &&
              <div className='favourite-tab'>
                <div className='tab-title'>FAVOURITES</div>
                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  {isLoadingFavourites ? (
                    <div className='loading-cont'>
                      <Loading />
                    </div>
                  ) : favouriteRecipes.length > 0 ? (
                    <Droppable droppableId="RecipeList">
                      {(provided) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {favouriteRecipes.map((recipe, index) => (
                            <Recipe recipe={recipe} 
                            index={index} 
                            toggleInfo={toggleInfo} 
                            toggleFavourite={toggleFavourite} 
                            favouriteSet={favouriteSet}
                            max_tags={max_tags}
                            max_ingredients={max_ingredients}/>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div className='no-result'>No favourite recipes found</div>
                  )}
                </div>
              </div>
            }
            {/* Add Recipe Tab */}
            {currentPage === 5 &&
              <div className='add-recipe-tab'>
                <div className='tab-title'>CREATE YOUR OWN RECIPE</div>
                <DropDown isOpen={successAlertOpen} setIsOpen={setSuccessAlertOpen} options={[{label: 'Okay'}]} message={'Recipe added successfully!'}/>
                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  {/* add recipe form */}
                  <form onSubmit={handleAddRecipe}>
                    <div className="form-group">
                      <label htmlFor="recipe-title">Title</label>
                      <input
                        type="text"
                        id="recipe-title"
                        name="title"
                        placeholder="Enter recipe title"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="recipe-ingredients">List of ingredients (comma separated)</label>
                      <textarea
                        id="recipe-ingredients"
                        name="ingredients"
                        placeholder="e.g. tomato, onion, garlic"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="recipe-tags">Tags (comma separated)</label>
                      <input
                        type="text"
                        id="recipe-tags"
                        name="tags"
                        placeholder="e.g. vegan, quick, dinner"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="recipe-ingredient-amounts">Ingredients Amounts (bullet points)</label>
                      <textarea
                        id="recipe-ingredient-amounts"
                        name="ingredientAmounts"
                        placeholder="e.g. - 2 cups flour&#10;- 1 tsp salt"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="recipe-instructions">Instructions (numbered steps)</label>
                      <textarea
                        id="recipe-instructions"
                        name="instructions"
                        placeholder="e.g. 1. Preheat oven to 180°C&#10;2. Mix ingredients..."
                      />
                    </div>
                    <button type='submit'>Add Recipe</button>
                    <button type='reset'>Clear</button>
                  </form>
                </div>
              </div>
            }
            <div className='popup' onClick={(e) => e.stopPropagation()}>
              <FilterPopup isOpen={isFilterOpen} onClose={closeFilter} availableTags={availableTags} availableIngredients={availableIngredients} onFiltersChange={handleFiltersChange} />
              <RecipeInfo isOpen={isInfoOpen} onClose={closeInfo} recipe={selectedRecipe} fromRecipeTab={true}/>
            </div>
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
          <FaDiceD20 size={30} />
        </div>
        <div onClick={() => changePage(4)} className={`bookmark ${currentPage === 4 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <MdOutlineStarPurple500 size={30} />
        </div>
        <div onClick={() => changePage(5)} className={`bookmark ${currentPage === 5 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <FaPlus size={30} />
        </div>
      </div>
    </div>
  </>
  );
};

export default RecipeTab;
