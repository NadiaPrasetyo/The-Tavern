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
        Username: localStorage.getItem('username')
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
    console.log("Getting inventory list" + counter);
    if (counter >= 10) {
      setInventoryList([{Name: "Please add your inventory!", Category: "Inventory"}]);
    } else {
    getInventory().then((inventory) => {
      setInventoryList(inventory);
    });
    }
  }

  let categories;
  if (inventoryList.length > 0) {
    //each inventory item has a category, separate the unique ones
    categories = [...new Set(inventoryList.map(item => item.Category))];
  } else {
    categories = [{Inventory}];//default category is Inventory
  }

  function addInventoryItem(item, category) {
    console.log("Adding inventory item: " + item + " to category: " + category);
    // Add the inventory item to the database

    fetch('/api/add-inventory-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: localStorage.getItem('username'),
        Name: item,
        Category: category
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Inventory item added successfully");
        // Update the inventory list
        getInventory().then((inventory) => {
          console.log("Inventory list updated");
          setInventoryList(inventory);
          return;
        });

      } else {
        console.log("Error adding inventory item");
      }
    });
  }

  
  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false);

  function addInventory(event, category) {
    //get the source button
    const buttonClick = event.target;
    const button = buttonClick.closest('.addGrocery');
    const groceryItem = buttonClick.closest('.InventoryInputContainer').querySelector('.addGroceryItem');
    
  
    if (!groceryItemOpen) {
      button.style.animation = 'moveRight 0.5s';
      button.style.left = '250px';
      groceryItem.placeholder = 'Add inventory item...';
      groceryItem.style.animation = 'openRight 0.5s';
      groceryItem.style.display = 'block';
  
    } else{
      const value = groceryItem.value.trim();
      if (value === '') {
        console.log("Inventory item is empty");
        // Do nothing if the grocery item is empty
      } else {
        // Add the grocery item to the list in the database
        addInventoryItem(value, category);
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
  }

  function addCategory(event, confirmedPopup) {
    const buttonClick = event.target;

    if (!confirmedPopup) {
      //get the source button
      const popup = document.querySelector('.popupAddCategory');
      popup.style.display = 'block';
    } else {

    const categoryElement = buttonClick.closest('.popupAddCategory').querySelector('.addCategoryItem');
    const category = categoryElement.value.trim();//get the category name
    
    if (category === null || category === '') {
      return;
    }
    // Add the category to the database
    fetch('/api/add-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: localStorage.getItem('username'),
        Category: category,
        Name: ''
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Category added successfully");
        // Update the inventory list
        getInventory().then((inventory) => {
          console.log("Inventory list updated");
          setInventoryList(inventory);
          return;
        });

      } else {
        console.log("Error adding category");
      }
    });
    categoryElement.value = '';//clear the input field
    document.querySelector('.popupAddCategory').style.display = 'none';//hide the popup
    }
  }
  
  function GetEachCategoryList(category, inventoryList) {
    const categoryList = inventoryList.filter(item => item.Category === category);
    
    return (
      <div>
        <section className='inventory'>
          <form onKeyDown={(event) => event.key !== 'Enter'}>
            <h4>{category}</h4>
            <div className='InventoryInputContainer'>
              <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add inventory item..." />
              <button className="addGrocery" type='button' onClick={(event) => addInventory(event, category)}><IoAddCircle /></button><br />
            </div>
            <ul>
              {categoryList.map((item) => (
                <li key={item.Name}>{item.Name}</li>
              ))}
            </ul>
          </form>
        </section>
      </div>
    );
  }
  
  if (inventoryList.length === 0) {
    return (
    <section className='inventory'>
      <h4>Inventory</h4>
      <ul>
        <li>Loading...</li>
      </ul>
    </section>
    );
  } else{

  return (
        //for each category, display the category name and the items in that category

    <div>
      {categories.map((category) => (
        GetEachCategoryList(category, inventoryList)
      ))}
      <button className='addCategory' type='button' onClick={(event)=> addCategory(event, false)}>Add Category</button>  
      <div className = "popupAddCategory">
        <input type="text" className="addCategoryItem" name="categoryItem" placeholder="Add category..." />
        <button className="addCategory" type='button' onClick={(event) => addCategory(event, true)}><IoAddCircle /></button><br />
      </div>
    </div>
  );
  }

}

function Inventory() {

  return (
    
    <div className="App">
      <header className = "App-header">
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
