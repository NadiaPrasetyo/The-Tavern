import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ProfileBar from '../components/profilebar.js';
import RecipeTab from '../components/RecipeTab.js';

import MenuColumn from '../components/MenuColumn.js';


function Menu() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [menu, setMenu] = useState({
    RecipeList: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    console.log(source, destination);

    if (source.droppableId === 'RecipeList') {
      // if the destination is the recipeList go back
      if (destination.droppableId === 'RecipeList') return;

      const clonedRecipe = { ...menu.RecipeList[source.index] };
      const destinationDay = menu[destination.droppableId];

      destinationDay.splice(destination.index, 0, clonedRecipe);

      setMenu({
        ...menu,
        [destination.droppableId]: destinationDay,
      });


    } else if (source.droppableId !== destination.droppableId) {
      const sourceDay = menu[source.droppableId];
      const destinationDay = menu[destination.droppableId];
      const [removed] = sourceDay.splice(source.index, 1);
      destinationDay.splice(destination.index, 0, removed);

      setMenu({
        ...menu,
        [source.droppableId]: sourceDay,
        [destination.droppableId]: destinationDay,
      });
    } else {
      const day = menu[source.droppableId];
      const [removed] = day.splice(source.index, 1);
      day.splice(destination.index, 0, removed);

      setMenu({
        ...menu,
        [source.droppableId]: day,
      });
    }
  
    
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="App">
        <header class = "App-header">
          <ProfileBar/>
        </header>

        <aside>
          <Sidebar source = "Menu"/>
        </aside>

        <main className ="content">
          <div className="menu-table">
            {days.map((day, index) => (
              <MenuColumn key={day} columnId={day} items={menu[day]} />
            ))}
            <RecipeTab menu={menu} setMenu={setMenu} />
          </div>
        </main>


        <footer>
          <p>Footer</p>
        </footer>

      </div>
    </DragDropContext>
  );
}




export default Menu;
