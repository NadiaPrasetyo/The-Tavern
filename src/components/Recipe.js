import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdOutlineStarBorderPurple500, MdOutlineStarPurple500 } from 'react-icons/md';
import { Draggable } from 'react-beautiful-dnd';

const Recipe = ({ recipe, index, toggleInfo, toggleFavourite, favouriteSet, max_tags, max_ingredients, useIdAsDraggableId, removeRecipe }) => {

  // Use `id` as the draggableId if specified, otherwise use `Name`
  const draggableId = useIdAsDraggableId ? recipe.id : recipe.Name;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          className={`recipe-list ${useIdAsDraggableId ? 'menu-recipe' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className='recipe-title'>
            <a href={recipe.Link} target="_blank" rel="noopener noreferrer">
              {recipe.Name}
            </a>
            <div className="icon-container">
              <AiOutlineInfoCircle className='info-icon' onClick={() => toggleInfo(recipe)} />
              {favouriteSet != null ? (
                favouriteSet.has(recipe.Name) ? (
                  <MdOutlineStarPurple500 className='star-icon filled' onClick={() => toggleFavourite(recipe)} />
                ) : (
                  <MdOutlineStarBorderPurple500 className='star-icon border' onClick={() => toggleFavourite(recipe)} />
                )
              ) : 
                <RiDeleteBack2Fill className='remove-icon' onClick={() => removeRecipe(recipe)} />
              }
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
