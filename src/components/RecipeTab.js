import React, { useState, useEffect, useRef } from 'react';
import { TbSearch } from "react-icons/tb";
import { IoIosHourglass } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Droppable } from 'react-beautiful-dnd';
import Recipe from './Recipe';

import RecipeInfo from './RecipeInfo';
import FilterPopup from './FilterPop';
import Loading from './Loading';
import DropDown from './DropDown';
import '../App.css';

const RecipeTab = ({ userdata, recipeList, setRecipeList, isOpenDrag, setIsOpenDrag,  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // The current page
  const [searchQuery, setSearchQuery] = useState(''); // The search input value
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // Add a debounced version of the search query
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
  const [favouriteRecipes, setFavouriteRecipes] = useState([]); // State for favourite recipes
  const [favouriteSet, setFavouriteSet] = useState(new Set()); // Set for favorite recipes
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false); // Loading state for favourites
  const [recommendationRecipes, setRecommendationRecipes] = useState([]); // State for recommendation recipes
  const [isOpenRecommendation, setIsOpenRecommendation] = useState(false); // The recommendation tab state
  const [recipePageRecommendation, setRecipePageRecommendation] = useState(1); // The current recipe page for recommendations
  const [recommendationMessage, setRecommendationMessage] = useState('No recommendations'); // The recommendation message
  const [isVisibleRecPopUp, setIsVisibleRecPopUp] = useState(false); // The recommendation info popup state
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const containerRef = useRef(null); // Reference to the container element
  const [containerMaxHeight, setContainerMaxHeight] = useState(0);

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
    
    // if closed get favourites
    if (!isOpen) {
      getFavourites();
    }

    setIsOpen(!isOpen);
    setIsOpenDrag(!isOpen);
  };

  function getComputedMaxHeight() {
    // get container height
    const containerHeight = containerRef.current.offsetHeight;
    let totalHeaderHeight = 0;
    const headerHeight = containerRef.current.querySelector('.tab-title').offsetHeight;
    totalHeaderHeight += headerHeight;
    if (containerRef.current.querySelector('.search-bar-container')) {
      const searchHeight = containerRef.current.querySelector('.search-bar-container').offsetHeight;
      totalHeaderHeight += searchHeight;
    }
    if (containerRef.current.querySelector('.pagination-controls')) {
      const paginationHeight = containerRef.current.querySelector('.pagination-controls').offsetHeight;
      totalHeaderHeight += paginationHeight + 30; // 20 is the padding/margin
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

    const debounceResize = () => {
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

    if (page === 2) {
      setIsOpenRecommendation(true);
    } else {
      setIsOpenRecommendation(false);
    }

    // Fetch favourite recipes when the Favourites page is clicked
    if (page === 4) {
      getFavourites();
    }
  };

  // Handle the search input change and reset the page to 1
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setRecipePage(1); // Reset the current page to 1 whenever the search input changes
    setRecipePageRecommendation(1); // Reset the current page to 1 whenever the search input changes
  };

  // Fetch recipes from the server based on the current page, search query, includedItems, and excludedItems
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

  useEffect(() => {
    if (isOpen && currentPage === 1) {
      fetchRecipes(recipePage, debouncedSearchQuery, includedTags, excludedTags, includedIngredients, excludedIngredients);
    }
  }, [recipePage, debouncedSearchQuery, isOpen, includedTags, excludedTags, includedIngredients, excludedIngredients, currentPage]);


  // Handle pagination (next and previous page)
  const nextPage = () => {
    if (isOpenRecommendation) {
      if (recipePageRecommendation < totalPages) {
        setRecipePageRecommendation(recipePageRecommendation + 1);
      }
    } else if (recipePage < totalPages) {
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
    setRecipePageRecommendation(1); // Reset the current page to 1 whenever the filters change
  };

  // FAVOURITES FUNCTIONS

  // Add a recipe to favourites using a post request
  const addFavourite = async (recipe) => {
    try {
      const response = await fetch('/api/add-favorite-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,
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


  // Remove a recipe from favourites using a delete request
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

      if (response.status === 404) {
        console.log(data.message);
        return false;
      } else if (response.status === 200) {
        console.log(data.message);
        return true;
      }

    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  // Toggle a recipe as a favorite
  const toggleFavourite = async (recipe) => {
    const updatedFavourites = new Set(favouriteSet);

    if (favouriteSet.has(recipe.Name)) {
      const removeSuccess = await removeFavourite(recipe); // Update backend and check for success
      if (removeSuccess) {
        updatedFavourites.delete(recipe.Name);
        setFavouriteSet(updatedFavourites); // Only update the state if successful
      }
    } else {
      const addSuccess = await addFavourite(recipe); // Update backend and check for success
      if (addSuccess) {
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
      if (!data.favourites) {
        data.favourites = [];
      }
      setFavouriteRecipes(data.favourites);
      const favSet = new Set(data.favourites.map((recipe) => recipe.Name));
      setFavouriteSet(favSet);

      setRecipeList(data.favourites);

    } catch (error) {
      console.error("Error getting favourites:", error);
    }
    setIsLoadingFavourites(false);
  };

  // RECOMENDATION FUNCTIONS

  // Get all recommendation recipes
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

      const data = await response.json();

      // if data.recipes is undefined, set it to an empty array
      if (!data.recipes) {
        data.recipes = [];
        setRecommendationMessage('No recommendations');
      }

      if (data.recipes.length === 0) {
        setRecommendationMessage(data.message);
      }

      setRecommendationRecipes(data.recipes); // Set the recipes returned from the backend
      setTotalPages(data.totalPages); // Set the total number of pages
      setAvailableIngredients(data.ingredients.sort()); // Set the available ingredients for filtering
      setAvailableTags(data.tags.sort()); // Set the available tags for filtering

      setRecipeList(data.recipes);

    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpenRecommendation) {
      fetchRecommendations(recipePageRecommendation, debouncedSearchQuery, includedTags, excludedTags, includedIngredients, excludedIngredients);
    }
  }, [recipePageRecommendation, debouncedSearchQuery, isOpenRecommendation, includedTags, excludedTags, includedIngredients, excludedIngredients]);

  // Toggle the recommendation info modal

  const toggleRecInfo = (e) => {
    e.stopPropagation();
    setIsVisibleRecPopUp(!isVisibleRecPopUp);
  }


  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isVisibleRecPopUp) {
        setIsVisibleRecPopUp(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', (e) => {
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

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          setIsVisibleRecPopUp(false);
        }
      });
      clearTimeout(timeoutId); // Clear the timeout on cleanup
    };
  }, [isVisibleRecPopUp]);

  return (
    <>
    <DropDown isOpen={dropDownOpen} setIsOpen={setDropDownOpen} options={[{label: 'Okay'}]} message={'You already have the maximum amount of favorite recipes'}/>
    <div className={`recipe-tab-container ${isOpen ? "recipe-open" : ""}`} ref={containerRef}>
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
                    Previous
                  </button>
                  <span className='page-num'>Page {recipePageRecommendation} of {totalPages}</span>
                  <button className='next-btn' onClick={nextPage} disabled={recipePageRecommendation === totalPages}>
                    Next
                  </button>
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
                <div className='recipe-containers custom-scroll' style={{ maxHeight: containerMaxHeight }} onClick={(e) => e.stopPropagation()}>
                  <div className='recipe-list'>COMING SOON!</div>
                </div>
              </div>
            }
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
          <IoIosHourglass size={30} />
        </div>
        <div onClick={() => changePage(4)} className={`bookmark ${currentPage === 4 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <MdOutlineStarPurple500 size={30} />
        </div>
      </div>
    </div>
  </>
  );
};

export default RecipeTab;
