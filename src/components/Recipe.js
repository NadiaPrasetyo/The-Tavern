import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdOutlineStarBorderPurple500, MdOutlineStarPurple500 } from 'react-icons/md';
import { Draggable } from 'react-beautiful-dnd';

const Recipe = ({ recipe, index, toggleInfo, toggleFavourite, favouriteSet, max_tags, max_ingredients, useIdAsDraggableId, removeRecipe }) => {

  // Use `id` as the draggableId if specified, otherwise use `Name`
  const draggableId = useIdAsDraggableId ? recipe.id : recipe.Name;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  return (
    <Draggable key={draggableId} draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          className={`recipe-list ${useIdAsDraggableId ? 'menu-recipe' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className='recipe-title' {...(!isTouchDevice && provided.dragHandleProps)}>
            <a href={recipe.Link} target="_blank" rel="noopener noreferrer" {...provided.dragHandleProps}>
              {recipe.Name}
            </a>
            <div className="icon-container">
              {/* Stop drag events for specific icons */}
              <AiOutlineInfoCircle 
                className='info-icon' 
                onClick={(e) => isTouchDevice ? e.stopPropagation() : toggleInfo(recipe, e)} 
                onTouchStart={(e) => { e.stopPropagation(); toggleInfo(recipe, e); }} 
                onMouseDown={(e) => e.stopPropagation()} // Stop drag on mouse too
              />
              {favouriteSet != null ? (
                favouriteSet.has(recipe.Name) ? (
                  <MdOutlineStarPurple500 
                    className='star-icon filled' 
                    onClick={(e) => isTouchDevice ? e.stopPropagation() : toggleFavourite(recipe)} 
                    onTouchStart={(e) => { e.stopPropagation(); toggleFavourite(recipe); }} 
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag on star click
                  />
                ) : (
                  <MdOutlineStarBorderPurple500 
                    className='star-icon border' 
                    onClick={(e) => isTouchDevice ? e.stopPropagation() : toggleFavourite(recipe)} 
                    onTouchStart={(e) => { e.stopPropagation(); toggleFavourite(recipe); }} 
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag on star click
                  />
                )
              ) : (
                <RiDeleteBack2Fill 
                  className='remove-icon' 
                  onClick={(e) => isTouchDevice ? e.stopPropagation() : removeRecipe(recipe)} 
                  onTouchStart={(e) => { e.stopPropagation(); removeRecipe(recipe); }} 
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag on delete click
                />
              )}
            </div>
          </div>
          <div className='recipe-tags' {...provided.dragHandleProps}>
            {recipe.Tag.slice(0, max_tags).map((tag, index) => (
              <span className='r-tag' key={index}>{tag}</span>
            ))}
          </div>
          <div className='recipe-ingredients' {...provided.dragHandleProps}>
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
