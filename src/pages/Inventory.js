import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";


function getInventory(){
  
  // Get Inventory list from the server
  const getInventory = async (e) => {
    const response = await fetch('/api/get-inventory',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username')
      }),
    });

    const inventory = await response.json();

    if (response.status === 200) {
      return inventory.inventory;  // Return the inventory
    } else {
      console.log("Error getting inventory");
      return [];
    }
  }

  return getInventory();

}

let counter = 0;
function GetAllInventory() {
  const [inventoryList, setInventoryList] = React.useState([]);
  counter++;

  if(inventoryList.length === 0){
    if (counter >= 10) {
      setInventoryList([{Name: "Please create an Inventory List first"}]);
    }
    getInventory().then((inventory) => {
      setInventoryList(inventory);
    });
  }

  
  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false);

  function addInventory() {
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
        //addGroceryItem(value);
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
      // get5lastGroceryList().then((grocery) => {
      //   setGroceryList(grocery);
      //   return;
      // });
    }
  }
  

  return (
        //for each category, display the category name and the items in that category

    <div>
    <section className='inventory'>
    <form onkeydown="return event.key != 'Enter';">
      <h4>Category Name</h4>
      <div>
          <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add inventory item..."/>
          <button className = "addGrocery" type='button' onClick={addInventory}><IoAddCircle /></button><br/>
      </div>
      <li>Egg</li>
      <li>Apple</li>
      <li>Orange</li>
      <li>Carrot</li>
      <li>Chicken</li>
      <li>Beef</li>
    </form>
    </section>
    
    </div>
  );

}

function Inventory() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Inventory"/>
      </aside>

      <main className ="content" id = "ingredient-content">
        <GetAllInventory/>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Inventory;
