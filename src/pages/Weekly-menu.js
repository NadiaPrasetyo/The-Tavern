import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ProfileBar from '../components/profilebar.js';
import RecipeTab from '../components/RecipeTab.js';

import MenuColumn from '../components/MenuColumn.js';


function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [recipeTabOpen, setRecipeTabOpen] = useState(false);
  const [wasRecipeTabOpen, setWasRecipeTabOpen] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const username = localStorage.getItem('username');
      const reponse = await fetch(`/api/get-menu?username=${encodeURIComponent(username)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const data = await reponse.json();
      
      setMenu({
        ...menu,
        Monday: data.Monday,
        Tuesday: data.Tuesday,
        Wednesday: data.Wednesday,
        Thursday: data.Thursday,
        Friday: data.Friday,
        Saturday: data.Saturday,
        Sunday: data.Sunday,
      });
      setIsLoading(false);

    } catch (error) {
      console.error('Error:', error);
    }
  };


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

  // when this component mounts, fetch the menu
  useEffect(() => {
    fetchMenu();
  } , []);

  const handleOnDragStart = () => {
    setIsDragging(true);
    setWasRecipeTabOpen(recipeTabOpen);
    setRecipeTabOpen(false);
  };
  
  const handleOnDragEnd = (result) => {
    setIsDragging(false);
    setRecipeTabOpen(wasRecipeTabOpen);
    const { source, destination } = result;

    if (!destination) return;

    if (!menu[source.droppableId] || !menu[destination.droppableId]) {
      alert('Invalid source or destination');
      return;
    }

    if (source.droppableId === 'RecipeList') {
      // if the destination is the recipeList go back
      if (destination.droppableId === 'RecipeList') return;

      const clonedRecipe = { 
        ...menu.RecipeList[source.index],
        id: `${menu.RecipeList[source.index].Name}-${Date.now()}`
      };

      console.log(clonedRecipe);

      const destinationDay = menu[destination.droppableId];

      destinationDay.splice(destination.index, 0, clonedRecipe);

      setMenu({
        ...menu,
        [destination.droppableId]: destinationDay,
      });


    } else if (destination.droppableId === 'RecipeList') {
      // remove from the source but do not add to the recipeList
      const sourceDay = menu[source.droppableId];
      sourceDay.splice(source.index, 1);

      setMenu({
        ...menu,
        [source.droppableId]: sourceDay,
      });
    }
    else if (source.droppableId !== destination.droppableId) {
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
    <DragDropContext 
    onDragStart={handleOnDragStart} 
    onDragEnd={handleOnDragEnd}>
      <div className="App">
        <header class = "App-header">
          <ProfileBar/>
        </header>

        <aside>
          <Sidebar source = "Menu" setIsOpen={setSidebarOpen} />
        </aside>

        <main className ="content">
          {isLoading? (
            <p>Loading...</p>
          ) : (
            <div className="menu-table">
              {days.map((day, index) => (
                <MenuColumn columnId={day} items={menu[day]} widthpx={sidebarOpen ? '165.5px' : '200px'} />
              ))}
              <RecipeTab menu={menu} setMenu={setMenu} isOpenDrag={recipeTabOpen} />
            </div>
          )}
        </main>


        <footer>
          <p>Footer</p>
        </footer>

      </div>
    </DragDropContext>
  );
}




export default Menu;
