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


function getTodayMenu() {
  const getTodayMenu = async (e) => {
    // Get today's menu from the server

    const response = await fetch('/api/get-menu-today',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username
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

  return getTodayMenu();
}

// TodayMenu component where each menu item is clickable
function TodayMenu({ today, onRecipeClick, highlightedRecipe }) {
  if (today.length === 0) {
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

  return (
    <section className='todayMenu'>
      <table>
        <thead>
          <tr>
            <th>Today</th>
          </tr>
        </thead>
        <tbody>
          {today.map((item, index) => (
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
function GroceryList() {
  const [groceryList, setGroceryList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false); // Must be at top level

  // Fetch grocery list when the component mounts
  React.useEffect(() => {
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
        console.log("Grocery item added");
        document.querySelector('.addGroceryItem').value = '';
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item added to the list';
      } else if (response.status === 409) {
        console.log("Grocery item already exists");
        document.querySelector('.addGroceryItem').value = '';
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item already exists in the list';
      } else {
        console.log("Error adding grocery item");
      }
    };

    return addGroceryItem();
  }

  function addGrocery() {
    const groceryItem = document.querySelector('.addGroceryItem');
    const button = document.querySelector('.addGrocery');

    if (!groceryItemOpen) {
      button.style.animation = 'moveRight 0.5s';
      button.style.left = '250px';
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
      //filter the recipe so its not preppykitchen
      recipe.recipe = recipe.recipe.filter(recipe => !recipe.Link.includes("preppykitchen.com"));
      return recipe.recipe;  // Update the state with the fetched recipe
    } else {
      console.log("Error getting recipe");
      return [];
    }
  }
  return getRandom();
}

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


// QuickRecipe component to display the iframe
function QuickRecipe({ source }) {
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
    
      return(
        <section className='quickRecipe'>
          <div className='iframeContainer'>
          <iframe  className='recipeiFrame' src={source} title="QuickRecipe" ></iframe>
          </div>
        </section>
      );
}

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

let counter4 = 0;
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

function WeekCalendar() {
  const firstDay = localStorage.getItem('firstDay');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysArranged = days.slice(days.indexOf(firstDay)).concat(days.slice(0, days.indexOf(firstDay)));
  const daysShortArranged = daysArranged.map(day => day.slice(0, 1));

  // Get the dates of the week based on the firstDay
  const today = new Date();
  const day = today.getDay(); // 0 (Sunday) - 6 (Saturday)
  const firstDayIndex = days.indexOf(firstDay);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((day + 6) % 7) + firstDayIndex);

  // Adjust if the first day is after today (so we look at the previous week's first day)
  if (firstDayIndex > day - 1) {
    weekStart.setDate(today.getDate() - (day + 6 - firstDayIndex));
  } else {
    weekStart.setDate(today.getDate() - (day - 1 - firstDayIndex));
  }

  // Add ONLY the date numbers to the array
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  function trimDate(index, date) {
    // Calculate the correct day index based on the first day of the week
    const todayIndex = (day + 6 - firstDayIndex) % 7;
    // If today, change the color to a different color
    if (index === todayIndex) {
      return <span style={{background: ' #79855b73', borderRadius: '20px', paddingLeft: '3px', paddingRight: '3px'}}>{date.toDateString().slice(8, 10)}</span>;
    }
    return date.toDateString().slice(8, 10);
  }

  return (
    <section className='weekCalendar'>
      <table>
        <tr>
          {daysShortArranged.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
        <tbody>
          <tr>
            {dates.map((date, index) => (
              <td key={index}>{trimDate(index, date)}</td>
            ))}
          </tr>
        </tbody>
      </table>

    </section>
  );
}
        


function Home({userdata}) {
  user.username = userdata.username;
  document.onkeydown = function(event) {
    if (event.keyCode === 13) {  // 13 is the keyCode for the 'Enter' key
      event.preventDefault();  // Prevent the default form submission
      document.querySelector('.addGrocery').click();  // Simulate a button click
    }
  };

  const [source, setSource] = useState("");  // State for iframe source
  const [today, setToday] = useState([]);    // State for today's menu
  const [highlightedRecipe, setHighlightedRecipe] = useState(""); // Track highlighted recipe

  // Fetch the menu data (this would typically come from an API)
  // Fetch today's menu and set the first menu item as the default highlighted recipe
  useEffect(() => {
    let counter = 0;
    const MAX_RETRIES = 1;
    
    const fetchMenu = () => {
      getTodayMenu().then((menu) => {
        if (menu.length > 0) {
          // If a menu is found, highlight the first item and set the source
          setToday(menu);
          setHighlightedRecipe(menu[0].Name); // Highlight the first item
          findRecipe(menu[0].Name).then((recipe) => {
            if (recipe.length > 0) {
              setSource(recipe[0].Link);  // Set iframe source to the first recipe
            }
          });
        } else if (counter < MAX_RETRIES) {
          // Retry fetching menu if counter is less than max retries
          counter++;
          fetchMenu();
        } else {
          // If no menu is found after retries, fetch a random recipe
          getRandomRecipe().then((recipe) => {
            setToday([{ Name: "No Menu Today" }]);
            setSource(recipe[0].Link);  // Set iframe source to the random recipe
          });
        }
      }).catch((error) => {
        console.log('Error fetching menu:', error);
      });
    };

    // Initial fetch
    fetchMenu();
  }, []);

  // This function will update the iframe source when a menu item is clicked
  const handleMenuClick = (recipeName) => {
    findRecipe(recipeName).then((recipe) => {
      if (recipe.length > 0) {
        setSource(recipe[0].Link);   // Update the iframe source
        setHighlightedRecipe(recipeName);  // Highlight clicked recipe
      }
    });
  };

  return (
    
    <div className="App">
      <header className = "App-header">
        <ProfileBar userdata={userdata} source={"BasePage"}/>
      </header>

      <aside>
        <Sidebar source = "Home"/>
      </aside>

      <main className ="content">
        <TodayMenu today={today} onRecipeClick={handleMenuClick} highlightedRecipe={highlightedRecipe}/>
        <WeekCalendar />
        <GroceryList />
        <QuickRecipe source ={source}/>
        <QuickIngredient />        
      </main>     


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Home;
