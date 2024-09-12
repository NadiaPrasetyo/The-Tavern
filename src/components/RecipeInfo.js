import React, { useEffect } from 'react';
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
      <div className="recipe-info-content" onClick={(e) => e.stopPropagation()}>
        <h2>{recipe.Name}</h2>
        <h3>Tags:</h3>
        <ul>
          {recipe.Tag.map((tag, index) => (
            <li className='recipe-tags' key={index}>{tag}</li>
          ))}
        </ul>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.Ingredients.map((ingredient, index) => (
            <li className='recipe-ingredients' key={index}>{ingredient}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RecipeInfo;
