import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, {useEffect, useState} from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { GiFruitBowl } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { LiaGrinBeamSweat } from "react-icons/lia";

const user = {
  username: 'User',
};

/**
 * Get specific date's menu from the server
 * @returns menu if found as an array
 */
function getMenuForDate(selectedDate) {
  //this is a function because I did not know it could be a const in the other main function
  const getMenuDate = async (e) => {
    // Get selected day's menu from the server
    const response = await fetch('/api/get-menu-date',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: user.username,
        Day: selectedDate.getDay(),
      }),
    });

     const menu = await response.json();

    if (response.status === 200) {
      return menu.menu;  // Update the state with the fetched menu
    } else {
      console.log("Error getting today's menu");
      return [];
    }
    
  } 

  return getMenuDate();
}
/**
 * TODAYMENU COMPONENT of the application
 * @param {object} props contains menu, selectedDay, onRecipeClick, highlightedRecipe
 * @returns the today's menu component
 */
function TodayMenu({ menu, selectedDay, onRecipeClick, highlightedRecipe }) {
  //get the string of the selected day
   let day_string = "";
   switch (selectedDay.getDay()) {
     case 0:
       day_string = "Sunday";
       break;
     case 1:
       day_string = "Monday";
        break;
      case 2:
        day_string = "Tuesday";
        break;
      case 3:
        day_string = "Wednesday";
        break;
      case 4:
        day_string = "Thursday";
        break;
      case 5:
        day_string = "Friday";
        break;
      case 6:
        day_string = "Saturday";
        break;
    }
  // If the menu is empty or not yet loaded, show a loading message
  if (!menu || menu.length === 0) {
    return (
      <section className='todayMenu'>
        <table>
          <thead>
            <tr>
              <th>Today</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Loading...</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }

  // If the menu is available, display the items
  return (
    <section className='todayMenu'>
      <table>
        <thead>
          <tr>
            <th>{day_string}</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item, index) => (
            <tr key={index}>
              <td
                onClick={() => onRecipeClick(item.Name)}  // Handle recipe click
                style={{ cursor: 'pointer' }}
                className={highlightedRecipe === item.Name ? 'highlighted' : ''}  // Add class if selected
              >
                {item.Name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Get the 5 last grocery list from the server
 * @returns the grocery list as an array
 */
function get5lastGroceryList() {
  // Get grocery list from the server
  const get5lastGroceryList = async (e) => {
    const response = await fetch('/api/get-5-last-grocery-list',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: user.username
      }),
    });

    const grocery = await response.json();

    if (response.status === 200) {
      return grocery.grocery;  // Update the state with the fetched grocery list
    } else {
      console.log("Error getting grocery list");
      return [];
    }
  }

  return get5lastGroceryList();
}

/**
 * GROCERYLIST COMPONENT of the application
 * @returns the grocery list component
 */
function GroceryList() {
  const [groceryList, setGroceryList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false); // Must be at top level

  // Fetch grocery list when the component mounts
  React.useEffect(() => {
    /**
     * Fetch the grocery list from the server by calling the get5lastGroceryList function
     * sets the grocery list and loading state
     */
    const fetchGroceryList = async () => {
      try {
        const grocery = await get5lastGroceryList();
        setGroceryList(grocery);
      } catch (error) {
        console.error("Error fetching grocery list:", error);
        setGroceryList([{ name: "No grocery list" }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroceryList();
  }, []);

  // Conditionally render based on loading state and data
  if (isLoading) {
    return (
      <section className="groceryList">
        <h4>Loading grocery list...</h4>
      </section>
    );
  }

  // If the grocery list is empty, display a message
  if (groceryList.length === 0) {
    return (
      <section className="groceryList">
        <form onKeyDown={(e) => e.key !== 'Enter'}>
          <h4>Grocery List</h4>
          <div>
            <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add grocery item..." />
            <button className="addGrocery" type="button" onClick={addGrocery}>
              <IoAddCircle />
            </button>
            <br />
          </div>
          <p>No grocery items found</p>
        </form>
      </section>
    );
  }

  /**
   * Add a grocery item to the list in the database
   * @param {string} value the grocery item to add
   * Sets the grocery list state with the updated grocery list
   */
  function addGroceryItem(value) {
    const addGroceryItem = async () => {
      const response = await fetch('/api/add-grocery-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: user.username,
          Name: value,
          Category: 'Grocery', // default category
        }),
      });

      if (response.status === 200) {
        // Update the grocery list
        get5lastGroceryList().then((grocery) => {
          setGroceryList(grocery);
        });
        document.querySelector('.addGroceryItem').value = ''; // Clear the input field
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item added to the list'; // Display a message in the input field
      } else if (response.status === 409) {
        document.querySelector('.addGroceryItem').value = '';// Clear the input field
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item already exists in the list';// Display a message in the input field
      } else {
        console.log("Error adding grocery item");
      }
    };

    return addGroceryItem();
  }

  /**
   * Add a grocery item to the list in the database
   * Toggles the grocery item open state
   * Sets the button and input field animations
   * Sets the placeholder text for the input field
   * Sets the button position
   * Sets the grocery item open state
   */
  function addGrocery() {
    const groceryItem = document.querySelector('.addGroceryItem');
    const button = document.querySelector('.addGrocery');

    if (!groceryItemOpen) {
      button.style.animation = 'moveRight 0.5s';
      button.style.left = leftMAX;
      groceryItem.placeholder = 'Add grocery item...';
      groceryItem.style.animation = 'openRight 0.5s';
      groceryItem.style.display = 'block';
    } else {
      const value = groceryItem.value;
      if (value === '') {
        console.log("Grocery item is empty");
      } else {
        // Add the grocery item to the list in the database
        addGroceryItem(value);
      }

      //delay the animation to close the input field after adding the item or showing the error message
      setTimeout(() => {
        button.style.animation = 'moveLeft 0.5s';
        button.style.left = '-3px';
        groceryItem.style.animation = 'closeLeft 0.5s';
        setTimeout(() => {
          groceryItem.style.display = 'none';
        }, 500);
      }, 1500);
    }

    setGroceryItemOpen(!groceryItemOpen);
  }

  /**
   * Add a grocery item to the inventory in the database
   * @param {object} event the event object
   * Updates the grocery list state with the updated grocery list
   */
  function addToInventory(event) {
    const item = event.target.parentNode.querySelector('.itemName').textContent;

    const addToInventory = async () => {
      const response = await fetch('/api/add-to-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: user.username,
          Name: item,
          Category: 'Inventory', // default category
        }),
      });

      if (response.status === 200 || response.status === 409) {
        console.log("Grocery item added to inventory");

        const response2 = await fetch('/api/remove-grocery-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: user.username,
            Name: item,
          }),
        });

        // Update the grocery list with the updated grocery list
        if (response2.status === 200) {
          get5lastGroceryList().then((grocery) => {
            setGroceryList(grocery);
          });

        } else {
          console.log("Error removing grocery item from list");
        }
      } else {
        console.log("Error adding grocery item to inventory");
      }
    };

    addToInventory();
  }

  return (
    <section className="groceryList">
      <form onKeyDown={(e) => e.key !== 'Enter'}>
        <h4>Grocery List</h4>
        <div>
          <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add grocery item..." />
          <button className="addGrocery" type="button" onClick={addGrocery}>
            <IoAddCircle />
          </button>
          <br />
        </div>
        {groceryList.map((item, index) => (
          <label key={index} className="groceryItem">
            <input type="checkbox" id={item.Name} name={item.Name} value={item.Name} />
            <span className="checkmark"></span>
            <span className="itemName">{item.Name}</span>
            <a onClick={addToInventory}> add to Inventory</a>
          </label>
        ))}
      </form>
    </section>
  );
}

/**
 * Function to get a random recipe from the server
 * @returns the random recipe from the server
 */
function getRandomRecipe() {
  const getRandom = async (e) => {
    const response = await fetch('/api/get-random-recipe',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const recipe = await response.json();

    if (response.status === 200) {
      //filter out the preppykitchen.com recipes
      recipe.recipe = recipe.recipe.filter(item => !item.Link.includes("preppykitchen.com"));
      return recipe.recipe;  // Update the state with the fetched recipe
    } else {
      console.log("Error getting recipe");
      return [];
    }
  }
  return getRandom();
}

/**
 * Function to find a recipe by name from the server
 * just to get the source of the recipe
 */
function findRecipe(RecipeName) {
  const findRecipe = async (e) => {
    const response = await fetch('/api/find-recipe',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: RecipeName
      }),
    });

    const recipe = await response.json();

    if (response.status === 200) {
      console.log(recipe.recipe);
      return recipe.recipe;  // Update the state with the fetched recipe
    } else {
      console.log("Error finding recipe");
      return [];
    }
  }
  return findRecipe();
}

/**
 * QUICKRECIPE COMPONENT of the application
 * @param {string} source the source of the recipe
 * @param {object} recipe the recipe object
 * @returns the quick recipe component
 * displays the recipe in an iframe
 */
function QuickRecipe({ source, recipe }) {
  // If the source is empty, display a loading message
  if (source === "") {
    return (
      <section className='quickRecipe'>
        <div className='iframeCannot'>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  //check if source includes preppykitchen.com
  if (source.includes("preppykitchen.com")){
    return(
      <section className='quickRecipe'>
        <div className= 'iframeCannot'>
          <h4>Sorry</h4>
          <p>We cannot show this recipe here <LiaGrinBeamSweat /></p>
          <a href={source} target="_blank">Click here to open the recipe!</a>
        </div>
      </section>
    );
  }

  if (source.includes("None")){
    const name = recipe && recipe.Name ? recipe.Name : "Recipe";
    const tagsArray = recipe && recipe.Tag
      ? (Array.isArray(recipe.Tag) ? recipe.Tag : String(recipe.Tag).split(',').map(s => s.trim()))
      : []; 
    const ingredientsArray = recipe && recipe.Ingredients
      ? (Array.isArray(recipe.Ingredients) ? recipe.Ingredients : String(recipe.Ingredients).split(',').map(s => s.trim()))
      : [];
    const ingredientAmounts = recipe && recipe.IngredientAmounts ? (Array.isArray(recipe.IngredientAmounts) ? recipe.IngredientAmounts.join(', ') : recipe.IngredientAmounts) : '';
    const instructions = recipe && recipe.Instructions ? (Array.isArray(recipe.Instructions) ? recipe.Instructions.join('\n') : recipe.Instructions) : '';

    return (
      <section className='quickRecipe'>
        <div className='user-made-recipe'>
          <h2>{name}</h2>
          <div className='user-recipe-subtext'>This is a user made recipe</div>
          {tagsArray.length > 0 && tagsArray.map((t, i) => (
            <span key={`tag-${i}`} className='tag'>{t}</span>
          ))}
          <br />
          {ingredientsArray.length > 0 && ingredientsArray.map((ing, i) => (
            <span key={`ing-${i}`} className='ing'>{ing}</span>
          ))}
          <h4>Ingredients</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ingredientAmounts}</p>
          <h4>Instructions</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{instructions}</p>
        </div>
      </section>
    );
  }
    
  return(
    <section className='quickRecipe'>
      <div className='iframeContainer'>
      <iframe  className='recipeiFrame' src={source} title="QuickRecipe" ></iframe>
      </div>
    </section>
  );
}

/**
 * Get the quick fruits from the server
 * @returns the quick fruits from the server
 */
function getQuickFruits() {
  const getQuickFruits = async (e) => {
    // Get quick fruits from the server

    const response = await fetch('/api/get-quick-fruits',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: user.username
      }),
    });

    const fruits = await response.json();

    if (response.status === 200) {
      return fruits.fruits;  // Update the state with the fetched fruits
    } else {
      console.log("Error getting quick fruits");
      return [];
    }
  }

  return getQuickFruits();
}

/**
 * get the quick vegetables from the server
 * @returns the quick vegetables from the server
 */
function getQuickVegetables() {
  const getQuickVegetables = async (e) => {
    // Get quick vegetables from the server

    const response = await fetch('/api/get-quick-vegetables',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: user.username
      }),
    });

    const vegetables = await response.json();

    if (response.status === 200) {
      return vegetables.vegetables;  // Update the state with the fetched vegetables
    } else {
      console.log("Error getting quick vegetables");
      return [];
    }
  }

  return getQuickVegetables();
}

// Counter to limit the number of retries for fetching quick ingredients
let counter4 = 0;
/**
 * Quick Fruits and Vegetables component of the application
 * @returns the quick fruits and vegetables component
 */
function QuickIngredient(){
  counter4 ++;
  const [fruits, setFruit] = React.useState([]);
  const [vegetables, setVegetable] = React.useState([]);

  if (fruits.length === 0) {
    if (counter4 > 10){
      setFruit([{Name: "Fruits"}]);
      return;
    }

    getQuickFruits().then((fruit) => {
      //trim the array to only 3 items
      fruit = fruit.slice(0, 3);
      setFruit(fruit);
      return;
    });
  }

  if (vegetables.length === 0) {
    if (counter4 > 10){
      setVegetable([{Name: "Vegetables"}]);
      return;
    }
    getQuickVegetables().then((vegetable) => {
      //trim the array to only 3 items
      vegetable = vegetable.slice(0, 3);
      setVegetable(vegetable);
      return;
    }
    );
  }


  if (fruits === "" && vegetables === "") {
    return (
      <section className='quickIngredient'>
      <table>
        <tr>
          <th className='first'><GiFruitBowl /></th>
          <th><LuSalad /></th>
        </tr>
          <tbody>
            <tr>
              <td className='first'>Loading...</td>
              <td>Loading...</td>
            </tr>
          </tbody>
      </table>
    </section>
    );
  }

  return(
    <section className='quickIngredient'>
      <table>
        <tr>
          <th className='first'><GiFruitBowl /></th>
          <th><LuSalad /></th>
        </tr>
          <tbody>
            <tr>
              <td className='first'>
                {fruits.map((item, index) => (
                  <li key={index}>{item.Name}</li>
                ))}
              </td>
              <td>
                {vegetables.map((item, index) => (
                  <li key={index}>{item.Name}</li>
                ))}
              </td>
            </tr>
          </tbody>
      </table>
    </section>
  );
}

/**
 * WEEKCALENDAR COMPONENT of the application
 * @returns the week calendar component
 * displays the week calendar
 * based on the first day of the week
 * and highlights the current day
 * and displays the date
 * and the day of the week
 */
/**
 * WEEKCALENDAR COMPONENT of the application
 * @param {object} props contains selectedDay and onDateClick
 * @returns the week calendar component
 * displays the week calendar
 * and highlights the selected day
 */
function WeekCalendar({ selectedDay, onDateClick }) {
  const firstDay = localStorage.getItem('firstDay') || 'Monday'; // Default to Monday if no firstDay set

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysArranged = days.slice(days.indexOf(firstDay)).concat(days.slice(0, days.indexOf(firstDay)));
  const daysShortArranged = daysArranged.map(day => day.slice(0, 1));

  // Map weekday names to ISO day numbers (Monday=1 ... Sunday=7)
  const isoMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  // Today's ISO day (1..7)
  const today = new Date();
  const jsDay = today.getDay(); // 0 (Sunday) - 6 (Saturday)
  const isoToday = jsDay === 0 ? 7 : jsDay; //change Sunday from 0 to 7

  // First day of the week in ISO format
  const firstDayIso = isoMap[firstDay] || 1; //5

  // Compute the week start by subtracting the difference - Date handles month/year rollovers
  const diff = isoToday - firstDayIso;
  const weekStart = new Date(today);
  weekStart.setHours(0, 0, 0, 0);
  //if diff is negative, add 7 to it
  if (diff < 0) {
    weekStart.setDate(today.getDate() - (diff + 7));
  } else {
  weekStart.setDate(today.getDate() - diff);
  }

  // Build the 7-day array starting from weekStart
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const handleDateClick = (date) => {
    onDateClick(date);
  };

  function trimDate(date) {
    const isSelected = selectedDay instanceof Date && date.toDateString() === selectedDay.toDateString();
    const style = {
      background: isSelected ? '#79855b73' : 'transparent', // Highlight selected date
      borderRadius: '20px',
      paddingLeft: '3px',
      paddingRight: '3px',
    };
    const dayNum = String(date.getDate()).padStart(2, '0');
    return <span style={style}>{dayNum}</span>;
  }

  return (
    <section className='weekCalendar'>
      <table>
        <thead>
          <tr>
            {daysShortArranged.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dates.map((date, index) => (
              <td key={index} onClick={() => handleDateClick(date)}>
                {trimDate(date)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
     
// Set the maximum left position for the add grocery button in terms of left position default is 250px
let leftMAX = '250px';

/**
 * HOME COMPONENT of the application
 * @param {object} userdata the user data
 * @returns the home component
 */
function Home({userdata}) {
  user.username = userdata.username;
  document.onkeydown = function(event) {
    if (event.keyCode === 13) {  // 13 is the keyCode for the 'Enter' key
      event.preventDefault();  // Prevent the default form submission on Enter key
      document.querySelector('.addGrocery').click();  // Simulate a button click
    }
  };

  const [source, setSource] = useState("");  // State for iframe source
  const [recipe, setRecipe] = useState(null);  // State for recipe data
  const [menu, setMenu] = useState([]);    // State for selected day's menu
  const [highlightedRecipe, setHighlightedRecipe] = useState(""); // Track highlighted recipe
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedDay, setSelectedDay] = useState(new Date()); // Track selected day

  // Update the window width state when the window is resized
  useEffect(() => {
    if (windowWidth < 800) {
      leftMAX = '130px';//change the left position of the add grocery button if the window width is less than 800px
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize
    );
  }, []);

  // Fetch the menu data (this would typically come from an API)
  // Fetch today's menu and set the first menu item as the default highlighted recipe
  useEffect(() => {
    let counter = 0;
    const MAX_RETRIES = 1;

      // Fetch the menu for the selected day
      const fetchMenu = (selectedDate) => {
        getMenuForDate(selectedDate).then((menuData) => {
          if (menuData.length > 0) {
            // If menu exists for the selected day, highlight the first item and set the source
            setMenu(menuData);
            setHighlightedRecipe(menuData[0].Name);
            findRecipe(menuData[0].Name).then((recipe) => {
              if (recipe.length > 0) {
                setSource(recipe[0].Link);  // Set iframe source to the first recipe
                setRecipe(recipe[0]);
              }
            });
          } else if (counter < MAX_RETRIES) {
            // Retry fetching menu if counter is less than max retries
            counter++;
            fetchMenu(selectedDate);
          } else {
            setMenu([{ Name: "No menu found" }]);
            getRandomRecipe().then((recipe) => {
              if (recipe.length > 0) {
                setSource(recipe[0].Link);  // Set iframe source to a random recipe
                setRecipe(recipe[0]);
              }
            });// If no menu is found after max retries, get a random recipe
          }
        }).catch((error) => {
          console.log('Error fetching menu:', error);
        });
      };

      // Trigger fetch whenever the selectedDay changes
      fetchMenu(selectedDay);
  }, [selectedDay]);

  // This function will update the iframe source when a menu item is clicked
  const handleMenuClick = (recipeName) => {
    findRecipe(recipeName).then((recipe) => {
      if (recipe.length > 0) {
        setSource(recipe[0].Link);   // Update the iframe source
        setRecipe(recipe[0]);
        setHighlightedRecipe(recipeName);  // Highlight clicked recipe
      }
    });
  };

  // Function to handle date change (from WeekCalendar)
  const handleDateChange = (newDate) => {
    setSelectedDay(newDate);  // Update the selected day
  };

  return (
      
    <div className="App">
      <header className = "App-header">
        <ProfileBar userdata={userdata} source={"BasePage"}/>
      </header>
      <aside>
        <Sidebar source = "Home"/>
      </aside>

      <main className="content">
        {/* Pass the selectedDay to TodayMenu and handle recipe click */}
        <TodayMenu menu={menu} selectedDay={selectedDay} onRecipeClick={handleMenuClick} highlightedRecipe={highlightedRecipe} />

        {/* Pass selectedDay and handle date change */}
        <WeekCalendar selectedDay={selectedDay} onDateClick={handleDateChange} />

        <GroceryList />
        <QuickRecipe source={source} recipe={recipe} />
        <QuickIngredient />
      </main>   


      <footer>
        <p>Footer</p>
      </footer>

    </div>
    
  );
}




export default Home;
