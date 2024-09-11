import React, {useState} from 'react';
import '../App.css';

const RecipeTab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  
    // Toggle the book sliding in and out
    const toggleBook = () => {
      setIsOpen(!isOpen);
    };
  
    // Change the content of the book based on the clicked bookmark
    const changePage = (page) => {
      setCurrentPage(page);
    };
  
    return (
      <div className={`book-container ${isOpen ? "open" : ""}`}>
        {/* Book content area */}
        <div className="book-content">
          <div className="book-header">
            <h2>Book Title</h2>
            <button className="close-btn" onClick={toggleBook}>
              {isOpen ? "Close" : "Open"}
            </button>
          </div>
          <div className="book-page">
            {currentPage === 1 && <div>Page 1 Content</div>}
            {currentPage === 2 && <div>Page 2 Content</div>}
            {currentPage === 3 && <div>Page 3 Content</div>}
          </div>
        </div>
  
        {/* Bookmarks */}
        <div className="bookmarks">
          <button onClick={() => changePage(1)} className="bookmark bookmark-1">
            Page 1
          </button>
          <button onClick={() => changePage(2)} className="bookmark bookmark-2">
            Page 2
          </button>
          <button onClick={() => changePage(3)} className="bookmark bookmark-3">
            Page 3
          </button>
        </div>
      </div>
    );
  };

export default RecipeTab;


