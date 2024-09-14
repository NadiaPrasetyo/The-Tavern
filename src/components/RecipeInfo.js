import React, { useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import '../App.css'; 

const RecipeInfo = ({ isOpen, onClose, recipe }) => {
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

  if (!isOpen) return null; // Don't render anything if not open

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
            <div className='ingredients-header'>INGREDIENTS</div>
            <ul className='recipe-ingredients-container'>
              {recipe.Ingredients.map((ingredient, index) => (
                <li className='recipe-ingredients-info' key={index}>{ingredient}</li>
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
