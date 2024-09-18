// Recipe.js
import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdOutlineStarBorderPurple500, MdOutlineStarPurple500 } from 'react-icons/md';
import { Draggable } from 'react-beautiful-dnd';

const Recipe = ({ recipe, index, toggleInfo, toggleFavourite, favouriteSet }) => {
  const max_tags = 3;
  const max_ingredients = 4;

  return (
    <Draggable key={recipe.Name} draggableId={recipe.Name} index={index}>
      {(provided) => (
        <div
          className='recipe-list'
          key={recipe.Name}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className='recipe-title'>
            <a href={recipe.Link} target="_blank" rel="noopener noreferrer">
              {recipe.Name}
            </a>
            <div className="icon-container"> {/* Added container for icons */}
              <AiOutlineInfoCircle className='info-icon' onClick={() => toggleInfo(recipe)} />
              { favouriteSet && favouriteSet.has(recipe.Name) ? (
                <MdOutlineStarPurple500 className='star-icon filled' onClick={() => toggleFavourite(recipe)} />
              ) : (
                <MdOutlineStarBorderPurple500 className='star-icon border' onClick={() => toggleFavourite(recipe)} />
              )}
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
      )}
    </Draggable>
  );
};

export default Recipe;
