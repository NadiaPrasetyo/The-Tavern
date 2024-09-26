import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, {useState} from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";


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
        //clear the input field
        document.querySelector('.addGroceryItem').value = '';
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
  function addInventory(category) {
    // Get the button and input field
    const inputContainer = document.getElementById(`inventory-container-${category}`);
    const button = inputContainer.querySelector('.addGrocery');
    const groceryItem = inputContainer.querySelector('.addGroceryItem');

    if (!groceryItemOpen) {
      button.style.animation = 'moveRight 0.5s';
      button.style.left = '250px';
      groceryItem.placeholder = 'Add grocery item...';
      groceryItem.style.animation = 'openRight 0.5s';
      groceryItem.style.display = 'block';
  
    } else{
      const value = groceryItem.value.trim();
      if (value === '') {
        console.log("Inventory item is empty");
        // No action if the input is empty
      } else {
        // Add the grocery item to the list in the database
        addInventoryItem(value, category);
        groceryItem.value = '';  // Clear the input field after adding the item
      }

      // Start the closing animation
      button.style.animation = 'moveLeft 0.5s';
      button.style.left = '-3px';
      groceryItem.style.animation = 'closeLeft 0.5s';

      // Hide the grocery item input after the closing animation finishes (0.5s)
      setTimeout(() => {
        groceryItem.style.display = 'none';
      }, 500);
    }

    // Toggle the open state after handling
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
  
  function GetEachCategoryList({ category, inventoryList }) {
    const categoryList = inventoryList.filter(item => item.Category === category);
  
    // State to track input values and editable fields
    const [inputValues, setInputValues] = useState(categoryList.map(item => ({ ...item })));
    const [isEditable, setIsEditable] = useState(categoryList.map(() => false));
  
    // Handle input change
    const handleInputChange = (e, index, field) => {
      const { value } = e.target;
      setInputValues(prevValues =>
        prevValues.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      );
    };
  
    // Toggle edit mode for both Name and Category
    const handleEditClick = (index) => {
      // If we are leaving edit mode (from true to false), update the server
      if (isEditable[index]) {
        const item = inputValues[index];
        const originalName = categoryList[index].Name;  // Original Name from the inventoryList
        const originalCategory = categoryList[index].Category; // Original Category

        console.log("Original Name:", originalName);

        console.log("Updating item:", item);

        fetch('/api/update-inventory-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: localStorage.getItem('username'),   // Username
            Name: originalName,                           // Original Name (to find the document)
            Category: originalCategory,                   // Original Category (optional for matching)
            NewName: item.Name,                           // New Name after editing
            NewCategory: item.Category                    // New Category after editing
          }),
        }).then(response => {
          if (response.status === 200) {
            console.log("Item updated successfully");
            getInventory().then((inventory) => {
              setInventoryList(inventory);  // Update the inventory list with new values
            });
          } else {
            console.log("Error updating item");
          }
        }).catch(error => console.error('Error:', error));
      }
  
      // Toggle the edit mode for the specific item
      setIsEditable(prevEditable =>
        prevEditable.map((editable, i) => (i === index ? !editable : editable))
      );
    };

    function removeItem(itemName) {

      console.log("Removing item: " + itemName);
      // Remove the item from the database
      fetch('/api/remove-inventory-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: localStorage.getItem('username'),
          Name: itemName,
          Category: category
        }),
      }).then((response) => {
        if (response.status === 200) {
          console.log("Item removed successfully");
          // Update the inventory list
          getInventory().then((inventory) => {
            console.log("Inventory list updated");
            setInventoryList(inventory);
            return;
          });
        } else {
          console.log("Error removing item");
        }
      });
    }

    // Return nothing if there are no items in the category list
    if (!categoryList || categoryList.length === 0) {
      return null;
    }
    
      return (
        <div>
          <section className='inventory'>
            <form onKeyDown={(event) => event.key !== 'Enter'}>
              <h4>{category}</h4>
              <div className='InventoryInputContainer' id={`inventory-container-${category}`}>
                <input type="text" className="addGroceryItem" name="groceryItem" placeholder="Add inventory item..." />
                <button className="addGrocery" type='button' onClick={() => addInventory(category)}><IoAddCircle /></button><br />
              </div>
              <ul>
                {inputValues.map((item, index) => (
                  <li key={`${category}-${index}`}>
    
                    {/* Display Remove item link if not in edit mode */}
                    {!isEditable[index] && (
                      <a className="removeFromInventory" onClick={() => removeItem(item.Name)}>
                        {item.Name}
                      </a>
                    )}
    
                    {/* Name input: visible when in edit mode */}
                    {isEditable[index] && (
                      <input
                        type="text"
                        className="editItem"
                        value={item.Name}
                        onChange={(e) => handleInputChange(e, index, 'Name')}
                      />
                    )}
    
                    {/* Edit icon to toggle both fields */}
                    <AiOutlineEdit
                      className="edit-icon"
                      onClick={() => handleEditClick(index)}
                    />
    
                    {/* Category input: visible when in edit mode */}
                    {isEditable[index] && (
                      <input
                        type="text"
                        className="editItem editCategory"
                        value={item.Category}
                        onChange={(e) => handleInputChange(e, index, 'Category')}
                      />
                    )}
                  </li>
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
        <GetEachCategoryList key={category} category={category} inventoryList={inventoryList} />
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
  document.onkeydown = function(event) {
    if (event.keyCode === 13) {  // 13 is the keyCode for the 'Enter' key
      event.preventDefault();  // Prevent the default form submission
        //submit the specific inventory item that is being added i.e the input field is not empty
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
