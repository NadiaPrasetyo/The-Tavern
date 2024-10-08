import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import '../App.css'; 

/**
 * RECIPE INFO COMPONENT of the application
 * @param {object} props the properties of the component
 * @returns the recipe info component
 */
const RecipeInfo = ({ isOpen, // Boolean to check if the modal is open
  onClose, // Function to close the modal
  recipe, // The recipe dictionary
  highlighted, // The highlighted ingredients 
  setHighlighted, // Function to set the highlighted ingredients
  inInventory, // The ingredients in the inventory
  inGroceryList, // The ingredients in the grocery list
  fromRecipeTab // Boolean to check if the recipe is from the recipe tab 
}) => {
  const [infoPopUp, setInfoPopUp] = useState(false); // State variable for the info popup for highlight message
  
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  // Close the modal when the Esc key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose(event); // Call the onClose function when Esc is pressed
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown); // Add event listener when modal is open
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Clean up the event listener
    };
  }, [isOpen, onClose]);

  // Close the popup when clicking outside
  useEffect(() => {
    // Set a timeout to close the popup automatically after 5 seconds
    const timeoutId = setTimeout(() => {
      if (infoPopUp) {
        setInfoPopUp(false);
      }
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(timeoutId); // Clear the timeout on cleanup
    };
  }, [infoPopUp]);

  const toggleIngredient = (ingredient) => {
    if (fromRecipeTab) {
      return;
    }
    if (inGroceryList.includes(ingredient)) {
      return;
    }
    if (highlighted.includes(ingredient)) {
      setHighlighted(highlighted.filter((item) => item !== ingredient));
    } else {
      setHighlighted([...highlighted, ingredient]);
    }
  }

  // Handle touch events for highlighting ingredients
  useEffect(() => {
    const handleTouchStart = (event) => {
      if (event.target.matches('.highlightable')) {
        event.preventDefault(); // Prevent scrolling while interacting with the ingredient
        toggleIngredient(event.target.textContent); // Toggle the ingredient highlight
      }
    };

    // Adding non-passive event listener for touchstart
    document.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [highlighted, setHighlighted]);

  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div className="recipe-info-overlay" onClick={(e) => isTouchDevice ? e.stopPropagation() : onClose(e)} onTouchStart={(e) => e.target === e.currentTarget ? onClose(e) : null}>
      <div className="recipe-info-background background">
        <div className="recipe-info-content" onClick={(e) => e.stopPropagation()}>
          <a className="recipe-info-name" href={recipe.Link} target='_blank' rel="noopener noreferrer">
            {recipe.Name}
          </a>
          <div className='scrollable custom-scroll'>
            {/* add image depending on origin tag (Wok Of Life, or Preppy Kitchen) */}
            {recipe.Tag.includes('Wok Of Life') ? <img className='origin-image' src='WokOfLife.jpeg' alt='Wok Of Life logo' /> : null}
            {recipe.Tag.includes('Preppy Kitchen') ? <img className='origin-image' src='PreppyKitchen.jpeg' alt='Preppy Kitchen logo' /> : null}
            {recipe.Tag.includes('Maangchi') ? <img className='origin-image' src='Maangchi.png' alt='Maangchi logo' /> : null}
            <div className='recipe-tags-container'>
              {recipe.Tag.map((tag, index) => (
                <div className='recipe-tags-info' key={index}>{tag}</div>
              ))}
            </div>
            <div className='info-header-container'>
              <div className='ingredients-header'>
                INGREDIENTS
              </div>
              {
                fromRecipeTab ? (
                  null
                ) : (
                  <>
                  <AiOutlineInfoCircle className='info-icon' onClick={() => setInfoPopUp(!infoPopUp)} />
                  {infoPopUp && (
                      <div className="rec-info-popup highlight-info-popup">
                        <p>Highlight the ingredients you want to add to grocery list with <span className='pink-highlight'>pink highlight</span> (will be added to 'From Menu' category once you close the info). <br /> <br />
                          <span className='blue-highlight'>Blue highlight</span> indicates that the ingredient is already in your <span className='blue-highlight'>inventory</span>. <br /> <br />
                          Existing <span className='pink-highlight'>pink highlight</span> indicates that the ingredient is already in your <span className='pink-highlight'>grocery list</span>. <br /> <br />
                          Click on the ingredient to toggle the highlight.
                        </p>
                      </div>
                    )}
                  </>
                )
              }
            </div>
            <ul className='recipe-ingredients-container'>
              {recipe.Ingredients.map((ingredient, index) => (
                <li>
                  <a className={`recipe-ingredients-info 
                  ${!fromRecipeTab ? 'highlightable' : ''}
                  ${inInventory?.includes(ingredient) ? 'in-inventory' : ''}
                  ${inGroceryList?.includes(ingredient) ? 'in-grocery-list' : ''}
                  ${highlighted?.includes(ingredient) ? 'selected-ing' : ''}`} 
                  key={index} 
                  onClick={() => toggleIngredient(ingredient)}>
                    {ingredient}</a>
                </li>
              ))}
            </ul>
          </div>
          <IoMdClose className='x-button' onClick={onClose}></IoMdClose>
        </div>
      </div>
    </div>
  );
};

export default RecipeInfo;
