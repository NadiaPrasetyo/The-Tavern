import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import '../App.css'; 

const RecipeInfo = ({ isOpen, onClose, recipe, highlighted, setHighlighted, inInventory, inGroceryList, fromRecipeTab }) => {
  const [infoPopUp, setInfoPopUp] = useState(false);
  // Close the modal when the Esc key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose(); // Call the onClose function when Esc is pressed
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
    const handleClickOutside = () => {
      if (infoPopUp) {
        setInfoPopUp(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Set a timeout to close the popup automatically after 5 seconds
    const timeoutId = setTimeout(() => {
      if (infoPopUp) {
        setInfoPopUp(false);
      }
    }, 5000); 

    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(timeoutId); // Clear the timeout on cleanup
    };
  }, [infoPopUp]);

  if (!isOpen) return null; // Don't render anything if not open

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

  return (
    <div className="recipe-info-overlay" onClick={onClose}>
      <div className="recipe-info-background background">
        <div className="recipe-info-content" onClick={(e) => e.stopPropagation()}>
          <h2>{recipe.Name}</h2>
          <div className='scrollable custom-scroll'>
            {/* add image depending on origin tag (Wok Of Life, or Preppy Kitchen) */}
            {recipe.Tag.includes('Wok Of Life') ? <img className='origin-image' src='WokOfLife.jpeg' alt='Wok Of Life logo' /> : null}
            {recipe.Tag.includes('Preppy Kitchen') ? <img className='origin-image' src='PreppyKitchen.jpeg' alt='Preppy Kitchen logo' /> : null}
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
                        <p>Highlight the ingredients you want to add to grocery list (will be added to 'From Menu' category)</p>
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
