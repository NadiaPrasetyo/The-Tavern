import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ProfileBar from '../components/profilebar.js';
import RecipeTab from '../components/RecipeTab.js';
import MenuColumn from '../components/MenuColumn.js';
import RecipeInfo from '../components/RecipeInfo.js';

function Menu() {
  const max_recipes_per_day = 6;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeTabOpen, setRecipeTabOpen] = useState(false);
  const [wasRecipeTabOpen, setWasRecipeTabOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const daysDefault = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const firstDay = localStorage.getItem('firstDay');
  // arrange days based on first day of the week 
  const days = daysDefault.slice(daysDefault.indexOf(firstDay)).concat(daysDefault.slice(0, daysDefault.indexOf(firstDay)));

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

  const closeInfo = () => {
    setIsInfoOpen(false);
    setSelectedRecipe(null);
  };

  const toggleInfo = (recipe) => {
    setSelectedRecipe(recipe);
    setIsInfoOpen(true);
  };

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`/api/get-menu?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

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

  useEffect(() => {
    fetchMenu();
  }, []);

  const updateMenu = async () => {
    if (!hasChanges) return; // Only update if there are changes
    try {
      const response = await fetch('/api/update-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          menu: menu,
        }),
      });
      const data = await response.json();
      console.log(data);
      setHasChanges(false); // Reset the flag after successful update
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Autosave every 5 minutes if changes were made
  useEffect(() => {
    const interval = setInterval(() => {
      updateMenu(); // This will only update if hasChanges is true
    }, 30000); // 5 minutes

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [hasChanges, menu]);

  // Add event listener for page unload (refresh, navigate away, or close tab)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasChanges) {
        updateMenu(); // Save changes before unloading the page
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const handleOnDragStart = (start) => {
    if (start.source.droppableId === 'RecipeList') {
      setWasRecipeTabOpen(recipeTabOpen);
      setRecipeTabOpen(false);
    } else {
      setWasRecipeTabOpen(recipeTabOpen);
    }
  };

  const handleOnDragEnd = (result) => {
    setRecipeTabOpen(wasRecipeTabOpen);
    const { source, destination } = result;

    if (!destination) return;

    if (!menu[source.droppableId] || !menu[destination.droppableId]) {
      alert('Invalid source or destination');
      return;
    }

    if (source.droppableId === 'RecipeList') {
      if (destination.droppableId === 'RecipeList') return;
      // if destination already has max recipes, return
      if (menu[destination.droppableId].length >= max_recipes_per_day) {
        alert('Maximum number of recipes reached for '+ destination.droppableId);
        return;
      }

      const clonedRecipe = {
        ...menu.RecipeList[source.index],
        id: `${menu.RecipeList[source.index].Name}-${Date.now()}`,
      };

      const destinationDay = menu[destination.droppableId];
      destinationDay.splice(destination.index, 0, clonedRecipe);

      setMenu({
        ...menu,
        [destination.droppableId]: destinationDay,
      });
    } else if (destination.droppableId === 'RecipeList') {
      const sourceDay = menu[source.droppableId];
      sourceDay.splice(source.index, 1);

      setMenu({
        ...menu,
        [source.droppableId]: sourceDay,
      });
    } else if (source.droppableId !== destination.droppableId) {
      if (menu[destination.droppableId].length >= max_recipes_per_day) {
        alert('Maximum number of recipes reached for '+ destination.droppableId);
        return;
      }
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
      if (menu[destination.droppableId].length >= max_recipes_per_day) {
        alert('Maximum number of recipes reached for '+ destination.droppableId);
        return;
      }
      const day = menu[source.droppableId];
      const [removed] = day.splice(source.index, 1);
      day.splice(destination.index, 0, removed);

      setMenu({
        ...menu,
        [source.droppableId]: day,
      });
    }
    setHasChanges(true);
  };

  const updateItems = (day, items) => {
    setMenu({
      ...menu,
      [day]: items,
    });
    setHasChanges(true);
  };

  return (
    <DragDropContext onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
      <div className="App">
        <header className="App-header">
          <ProfileBar />
        </header>

        <aside>
          <Sidebar source="Menu" setIsOpen={setSidebarOpen} />
        </aside>

        <main className="content">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div className="menu-table custom-scroll">
                {days.map((day) => (
                  <MenuColumn
                    key={day}
                    columnId={day}
                    items={menu[day]}
                    widthpx={sidebarOpen ? '10.6vw' : '12.6vw'}
                    toggleInfo={toggleInfo}
                    updateItems={updateItems}
                  />
                ))}
              </div>
              <RecipeTab
                menu={menu}
                setMenu={setMenu}
                isOpenDrag={recipeTabOpen}
                setIsOpenDrag={setRecipeTabOpen}
              />
            </div>
          )}
          <RecipeInfo isOpen={isInfoOpen} onClose={closeInfo} recipe={selectedRecipe} />
        </main>

        <footer>
          <p>Footer</p>
        </footer>
      </div>
    </DragDropContext>
  );
}

export default Menu;
