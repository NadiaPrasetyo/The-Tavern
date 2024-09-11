import React, { useState } from 'react';
import { TbSearch } from "react-icons/tb";
import { IoIosHourglass } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import '../App.css';

const RecipeTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle the tab when clicking anywhere on the book container except for bookmarks or content
  const toggleBook = () => {
    setIsOpen(!isOpen);
  };

  // Change the content of the book based on the clicked bookmark
  const changePage = (page) => {
    setCurrentPage(page);
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
        <div onClick={() => changePage(1)} className="bookmark bookmark-1">
          <TbSearch size={30} />
        </div>
        <div onClick={() => changePage(2)} className="bookmark bookmark-2">
          <LuBookOpenCheck size={30}/>
        </div>
        <div onClick={() => changePage(3)} className="bookmark bookmark-3">
          <IoIosHourglass size={30}/>
        </div>
        <div onClick={() => changePage(4)} className="bookmark bookmark-4">
          <MdOutlineStarPurple500 size={30}/>
        </div>
      </div>
    </div>
  );
};

export default RecipeTab;
