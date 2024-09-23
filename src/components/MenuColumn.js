// MenuColumn.js
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Recipe from './Recipe';


const MenuColumn = ({ columnId, items, widthpx, toggleInfo, updateItems }) => {

    const removeRecipe = (recipe) => {
        const updatedItems = items.filter((item) => item.id !== recipe.id);
        updateItems(columnId, updatedItems);
    }

    return (
        <Droppable droppableId={columnId}>
            {(provided) => (
                <div className='menu-column'
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        width: widthpx
                    }}
                >
                    <h3 className='day-title'>{columnId}</h3>
                    {items.map((item, index) => (
                        <Recipe recipe={item} 
                        index={index} 
                        toggleInfo={toggleInfo}
                        max_tags={2}
                        max_ingredients={0}
                        useIdAsDraggableId={true}
                        removeRecipe={removeRecipe}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default MenuColumn;
