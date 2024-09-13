import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { prettyDOM } from '@testing-library/react';



function getTodayMenu() {
  const getTodayMenu = async (e) => {
    // Get today's menu from the server

    const response = await fetch('/api/get-menu-today',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username')
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

let counter = 0;

function TodayMenu() {
  const [today, setToday] = React.useState([]);
  counter ++;
  
  if (today.length === 0) {
    getTodayMenu().then((menu) => {
      if (counter > 10){
        setToday([{Name: "No Menu Today"}]);
        return;
      }
      setToday(menu);
      return;
    });
  }

  if (today.length === 0) {
  return (
    <section className='todayMenu'>
      <table>
        <tr>
          <th>Today</th>
        </tr>
        <tbody>
          <tr>
            <td>Loading...</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
  } else {
    
    return(
    <section className='todayMenu'>
      <table>
        <tr>
          <th>Today</th>
        </tr>
        <tbody>
           {today.map((item, index) => (
            <tr key={index}>
              <td>{item.Name}</td>
            </tr>
          ))} 
        </tbody>
      </table>
    </section>
    );
  }

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
        username: localStorage.getItem('username')
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

let counter2 = 0;
function GroceryList() {
  const [groceryList, setGroceryList] = React.useState([]);
  counter2 ++;

  if (groceryList.length === 0) {
    get5lastGroceryList().then((grocery) => {
       if (counter2 > 10){
         setGroceryList([{name: "No grocery list"}]);
         return;
       }
      setGroceryList(grocery);
      return;
    });
  }

  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false);
  function addGroceryItem(value) {
      const addGroceryItem = async (e) => {
      const response = await fetch('/api/add-grocery-item',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: localStorage.getItem('username'),
          Name: value,
          Category: 'Grocery'//default category
          
        }),
      });

      if (response.status === 200) {
        console.log("Grocery item added");
        document.querySelector('.addGroceryItem').value = '';
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item added to the list';
      } else if(response.status === 409){
        console.log("Grocery item already exists");
        document.querySelector('.addGroceryItem').value = '';
        document.querySelector('.addGroceryItem').placeholder = 'Grocery item already exists in the list';
      }else {
        console.log("Error adding grocery item");
      }
    }

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

    } else{
      const value = groceryItem.value;
      if (value === '') {
        console.log("Grocery item is empty");
      // Do nothing if the grocery item is empty
      } else {
        // Add the grocery item to the list in the database
        addGroceryItem(value);
      }
      
      setTimeout(() => {
      button.style.animation = 'moveLeft 0.5s';
      button.style.left = '-3px';
      groceryItem.style.animation = 'closeLeft 0.5s';

      // Hide the grocery item input after 0.5 seconds
      setTimeout(() => {
        groceryItem.style.display = 'none';
      }
      , 500);
      }, 1500);
    }

    setGroceryItemOpen(!groceryItemOpen);
    if(groceryItemOpen){
      // Update the grocery list
      get5lastGroceryList().then((grocery) => {
        setGroceryList(grocery);
        return;
      });
    }
  }

  function addToInventory(event) {
    // Add the specified grocery item to the inventory and remove it from the grocery list

    //get the specific item that the a is clicked on
    const item = event.target.parentNode.querySelector('.itemName').textContent;
    console.log(item);

    const addToInventory = async (e) => {
      const response = await fetch('/api/add-to-inventory',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: localStorage.getItem('username'),
          Name: item,
          Category: 'Inventory'//default category
        }),
      });

      if (response.status === 200) {
        console.log("Grocery item added to inventory");
        // Remove the grocery item from the list
        const response2 = await fetch('/api/remove-grocery-item',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: localStorage.getItem('username'),
            Name: item,
          }),
        });
        // Update the grocery list

        if (response2.status === 200) {
          get5lastGroceryList().then((grocery) => {
          setGroceryList(grocery);
          return;
        });
        } else {
          console.log("Error removing grocery item from list");
        }
      
      } else {
        console.log("Error adding grocery item to inventory");
      }
    }
    addToInventory();

  }

  if (groceryList.length === 0) {
    return (
      <section className='groceryList'>
        <form onkeydown="return event.key != 'Enter';">
          <h4>Grocery List</h4>
          <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add grocery item..."/>
          <button className = "addGrocery" type='button' onClick={addGrocery}><IoAddCircle /></button><br/>
          <label className = "groceryItem">
            <input type="checkbox" id="item1" name="item1" value="item1"/>
            <span className = "checkmark"></span>
            <span className='itemName'>Loading...</span>
            <a href="/Grocery-list/add"> add to Inventory</a>
          </label>
        </form>
      </section>
    );
  } else {
    return (
      <section className='groceryList'>
        <form onkeydown="return event.key != 'Enter';">
          <h4>Grocery List</h4>
          <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add grocery item..."/>
          <button className = "addGrocery" type='button' onClick={addGrocery}><IoAddCircle /></button><br/>
          {groceryList.map((item, index) => (
            <label key={index} className = "groceryItem">
              <input type="checkbox" id={item.Name} name={item.Name} value={item.Name}/>
              <span className = "checkmark"></span>
              <span className='itemName'>{item.Name}</span>
              <a onClick={addToInventory}> add to Inventory</a>
            </label>
          ))}
        </form>
      </section>
    );
  }
}

function Home() {
  document.onkeydown = function(event) {
    if (event.keyCode === 13) {  // 13 is the keyCode for the 'Enter' key
      event.preventDefault();  // Prevent the default form submission
      document.querySelector('.addGrocery').click();  // Simulate a button click
    }
  };

  return (
    
    <div className="App">
      <header className = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Home"/>
      </aside>

      <main className ="content">
        <TodayMenu />
        <GroceryList />
        
      </main>     


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Home;
