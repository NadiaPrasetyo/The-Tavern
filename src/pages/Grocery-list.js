import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";


function getGrocery(){
  
  // Get Grocery list from the server
  const getGrocery = async (e) => {
    const response = await fetch('/api/get-grocery',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: localStorage.getItem('username')
      }),
    });

    const grocery = await response.json();

    if (response.status === 200) {
      return grocery.grocery;  // Return the grocery
    } else {
      console.log("Error getting grocery");
      return [];
    }
  }

  return getGrocery();

}

let counter = 0;
function GetAllGrocery() {
  const [groceryList, setGroceryList] = React.useState([]);
  counter++;

  if(groceryList.length === 0){
    console.log("Getting grocery list" + counter);
    if (counter >= 10) {
      setGroceryList([{Name: "Please add your grocery!", Category: "Grocery"}]);
    } else {
    getGrocery().then((grocery) => {
      setGroceryList(grocery);
    });
    }
  }

  let categories;
  if (groceryList.length > 0) {
    //each grocery item has a category, separate the unique ones
    categories = [...new Set(groceryList.map(item => item.Category))];
  } else {
    categories = [{Grocery}];//default category is grocery
  }

  function addGroceryItem(item, category) {
    console.log("Adding grocery item: " + item + " to category: " + category);
    // Add the grocery item to the database

    fetch('/api/add-grocery-item-list', {
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
        console.log("Grocery item added successfully");
        //clear the input field
        document.querySelector('.addGroceryItem').value = '';
        // Update the grocery list
        getGrocery().then((grocery) => {
          console.log("Grocery list updated");
          setGroceryList(grocery);
          return;
        });

      } else {
        console.log("Error adding grocery item");
      }
    });
  }

  
  const [groceryItemOpen, setGroceryItemOpen] = React.useState(false);

  function addGrocery(event, category) {
    //get the source button
    const buttonClick = event.target;
    const button = buttonClick.closest('.addGrocery');
    const groceryItem = buttonClick.closest('.InventoryInputContainer').querySelector('.addGroceryItem');
    
  
    if (!groceryItemOpen) {
      button.style.animation = 'moveRight 0.5s';
      button.style.left = '250px';
      groceryItem.placeholder = 'Add grocery item...';
      groceryItem.style.animation = 'openRight 0.5s';
      groceryItem.style.display = 'block';
  
    } else{
      const value = groceryItem.value.trim();
      if (value === '') {
        console.log("Grocery item is empty");
        // Do nothing if the grocery item is empty
      } else {
        // Add the grocery item to the list in the database
        addGroceryItem(value, category);
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
    fetch('/api/add-grocery-category', {
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
        // Update the grocery list
        getGrocery().then((grocery) => {
          console.log("Grocery list updated");
          setGroceryList(grocery);
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
  
  function GetEachCategoryList(category, groceryList) {
    const categoryList = groceryList.filter(item => item.Category === category);
    function addToInventory(event) {
      // Add the specified grocery item to the inventory and remove it from the grocery list
  
      //get the specific item that the a is clicked on
      const item = event.target.parentNode.querySelector('.itemName').textContent;
  
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
  
        if (response.status === 200 || response.status === 409) {
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
            console.log("Grocery item removed from list");
            getGrocery().then((grocery) => {
              console.log("Grocery list updated");
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
    
    return (
      <div>
        <section className='grocery'>
          <form onKeyDown={(event) => event.key !== 'Enter'}>
            <h4>{category}</h4>
            <div className='InventoryInputContainer'>
              <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add grocery item..." />
              <button className="addGrocery" type='button' onClick={(event) => addGrocery(event, category)}><IoAddCircle /></button><br />
            </div>
            <ul>
              {categoryList.map((item, index) => (
                <label key={item} className = "groceryItem">
                  <input type="checkbox" id={item.Name} name={item.Name} value={item.Name}/>
                  <span className = "checkmark"></span>
                  <span className='itemName'>{item.Name}</span>
                  <a onClick={addToInventory}> add to Inventory</a>
                </label>
              ))}
          </ul>
          </form>
        </section>
      </div>
    );
  }
  
  if (groceryList.length === 0) {
    return (
    <section className='grocery'>
      <h4>Grocery</h4>
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
        GetEachCategoryList(category, groceryList)
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

function Grocery() {
  document.onkeydown = function(event) {
    if (event.keyCode === 13) {  // 13 is the keyCode for the 'Enter' key
      event.preventDefault();  // Prevent the default form submission
        //submit the specific grocery item that is being added i.e the input field is not empty
        //get all the add grocery buttons
        const addGroceryButtons = document.querySelectorAll('.addGrocery');
        for (let i = 0; i < addGroceryButtons.length; i++) {
          //find the button that is currently open and has the input field filled
          if (addGroceryButtons[i].style.left === '250px') {
            addGroceryButtons[i].click();
            break;
          }
        }
    }
  };

  return (
    
    <div className="App">
      <header className = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Grocery"/>
      </aside>

      <main className ="content" id = "ingredient-content">
        <GetAllGrocery/>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Grocery;
