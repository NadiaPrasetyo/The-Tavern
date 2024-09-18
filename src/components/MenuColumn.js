// MenuColumn.js
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Recipe from './Recipe';

const toggleInfo = (recipe) => {
    console.log('Info toggled for:', recipe.Name);
}

const MenuColumn = ({ columnId, items }) => {
    return (
        <Droppable droppableId={columnId}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        margin: '8px',
                        padding: '8px',
                        minHeight: '100px',
                        backgroundColor: '#f7f7f7',
                        width: '200px',
                    }}
                >
                    <h3 className='day-title'>{columnId}</h3>
                    {items.map((item, index) => (
                        <Recipe key={item.Name} recipe={item} index={index} toggleInfo={toggleInfo} toggleFavourite={null} favouriteSet={null} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default MenuColumn;
