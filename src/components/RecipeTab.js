import React, { useState, useEffect } from 'react';
import { TbSearch } from "react-icons/tb";
import { IoIosHourglass } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import '../App.css';

const RecipeTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // The current page
  const [searchQuery, setSearchQuery] = useState(''); // The search input value
  const [recipes, setRecipes] = useState([]); // The fetched recipes
  const [totalPages, setTotalPages] = useState(1); // The total number of pages
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [recipePage, setRecipePage] = useState(1); // The current recipe page

  const recipesPerPage = 10; // Limit the number of recipes per page

  // Toggle the book tab when clicking the container
  const toggleBook = () => {
    setIsOpen(!isOpen);
  };

  // Change the content of the book based on the clicked bookmark
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Handle the search input change and reset the page to 1
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setRecipePage(1); // Reset the current page to 1 whenever the search input changes
  };

  // Fetch recipes from the server based on the current page and search query
  const fetchRecipes = async (page, query) => {
    // if the tab is not open, do not fetch recipes
    if (!isOpen) {
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/recipes?page=${page}&limit=${recipesPerPage}&search=${query}`);
      const data = await response.json();

        // if data recipes is undefined, set it to an empty array
        if (!data.recipes) {
            data.recipes = [];
        }

      setRecipes(data.recipes); // Set the recipes returned from the backend
      
        //if total pages is undefined or less than 1, set it to 1
        if (!data.totalPages || data.totalPages < 1) {
            data.totalPages = 1;
        }

      setTotalPages(data.totalPages); // Set the total number of pages
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  // Fetch recipes when `recipePage` or `searchQuery` changes
  useEffect(() => {
    fetchRecipes(recipePage, searchQuery);
  }, [recipePage, searchQuery]);

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
                  <LuFilter className='filter-icon' />
                </div>

                {/* Recipe container with pagination */}
                <div className='recipe-containers' onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                      <div className='recipe-list' key={index}>
                        {recipe.Name}
                      </div>
                    ))
                  ) : (
                    <div>No recipes found</div>
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
                <div className='search-bar-container' onClick={(e) => e.stopPropagation()}>
                  <input className='search-bar' type='text' placeholder='Search for recipes' />
                  <TbSearch className='search-icon' />
                  <LuFilter className='filter-icon' />
                </div>
                <div className='recipe-containers'>
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
                <div className='recipe-containers'>
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
                <div className='recipe-containers'>
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
          <LuBookOpenCheck size={30}/>
        </div>
        <div onClick={() => changePage(3)} className={`bookmark ${currentPage === 3 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <IoIosHourglass size={30}/>
        </div>
        <div onClick={() => changePage(4)} className={`bookmark ${currentPage === 4 ? 'bookmark-active' : 'bookmark-inactive'}`}>
          <MdOutlineStarPurple500 size={30}/>
        </div>
      </div>
    </div>
  );
};

export default RecipeTab;
