import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect } from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

/**
 * INVENTORY COMPONENT of the application
 * @param {Object} userdata - user data
 * @returns the Inventory component
 */
function Inventory({userdata}) {
  const [groceryItemOpen, setGroceryItemOpen] = useState({});//state to track the open/close status of the grocery item input field
  const [groceryItemValue, setGroceryItemValue] = useState('');//state to track the value of the grocery item input field
  const [inventoryList, setInventoryList] = useState([]);//state to store the inventory list
  const [inputValues, setInputValues] = useState({});//state to store the input values for edit (each with a Name and Category)
  const [isEditable, setIsEditable] = useState({}); // State to track which items are editable
  const [popupVisible, setPopupVisible] = useState({});//state to track the visibility of the popup
  const [isLoading, setIsLoading] = useState(false);//state to track the loading status

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;//check if the device is a touch device

  /**
   * Function to get the inventory list from the database
   * @returns the inventory list
   */
  const getInventory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username
        }),
      });

      const inventory = await response.json();

      if (response.status === 200) {
        setInventoryList(inventory.inventory);
      } else {
        console.log("Error getting inventory");
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);//set loading to false after fetching the inventory list
  }

  // Fetch the inventory list on page load
  useEffect(() => {
    getInventory();
  }, []);


  document.onkeydown = function (event) {//prevents the form from submitting when the enter key is pressed
    if (event.keyCode === 13) {
      event.preventDefault();
      const addGroceryButtons = document.querySelectorAll('.addGrocery');
      for (let i = 0; i < addGroceryButtons.length; i++) {
        if (addGroceryButtons[i].classList.contains('move-right')) {//check if the add grocery button is open
          addGroceryButtons[i].click();//click the add grocery button if it is open
          break;
        }
      }
    }
  };

  // Create a dictionary for categories
  const categoryList = {};
  const categories = [...new Set(inventoryList.map(item => item.Category))];
  categories.forEach((category) => {
    categoryList[category] = inventoryList.filter(item => item.Category === category);
  });

  // Initialize the input values and editable status
  useEffect(() => {
    if (inventoryList.length > 0) {
      const categories = [...new Set(inventoryList.map(item => item.Category))];
      const newIsEditable = {};
      const newInputValues = {};

      categories.forEach((category) => {
        newIsEditable[category] = new Array(categoryList[category].length).fill(false);
        newInputValues[category] = categoryList[category].map((item) => ({ ...item }));
      });

      setIsEditable(newIsEditable);
      setInputValues(newInputValues);
    }
  }, [inventoryList]);

  /**
   * Function to add an inventory item to the database
   * @param {String} item - the item to add
   * @param {String} category - the category to add the item to
   */
  function addInventoryItem(item, category) {
    console.log("Adding inventory item: " + item + " to category: " + category);
    fetch('/api/add-inventory-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: userdata.username,
        Name: item,
        Category: category
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Inventory item added successfully");//log success message
        document.querySelector('.addGroceryItem').value = ''; // Clear the input field
        
        // Name: '', Category: category exists in the inventoryList, just change the Name
        if (inventoryList.some(element => element.Name === '' && element.Category === category)) {
          setInventoryList(
            inventoryList.map((element) => {
              if (element.Name === '' && element.Category === category) {
                return { Name: item, Category: category };
              }
              return element;
            })
          );
        } else {//add the new item to the inventory list
          setInventoryList(
            [...inventoryList, 
            { Name: item, Category: category }]);
        }
      } else {
        console.log("Error adding inventory item");
      }
    });
  }

  /**
   * Function to add an inventory item to the grocery list
   * @param {String} category - the category to add the item to
   * @returns the inventory item
   * @returns the grocery item
   */
  function addInventory(category) {
    if (groceryItemOpen[category] === undefined) {//check if the grocery item open is undefined and initialize it if it is
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: false//set the grocery item open to false (default)
      });
    }

    const isOpen = groceryItemOpen[category];//check if the grocery item input field is open
    
    //if the grocery item input field is not open, open it
    if (!isOpen) {//if the grocery item input field is not open, open it
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: true
      });
    } else {//if the grocery item input field is open, add the item to the inventory list and close the input field
      const value = groceryItemValue.trim();
      if (value !== '') {//check if the value is not empty
        addInventoryItem(value, category);//add the item to the inventory list
        setGroceryItemValue('');//clear the grocery item value
      }
      setGroceryItemOpen({
        ...groceryItemOpen,//close the grocery item input field
        [category]: false
      });
    }
  }

  /**
   * Function to add a category to the database
   * @param {Event} event - the event that triggered the function
   * @param {Boolean} confirmedPopup - the status of the popup
   * @returns the category
   */
  function addCategory(event, confirmedPopup) {
    const buttonClick = event.target;//get the button that was clicked

    if (!confirmedPopup) {//if the popup is not confirmed
      //get the source button
      const popup = document.querySelector('.popupAddCategory');
      //check if popup is already open
      if (popup.style.display === 'block') {//if the popup is already open, close it
        popup.style.display = 'none';
        return;
      }

      popup.style.display = 'block';//if the popup is not open, open it

    } else {//if popup is confirmed
      const categoryElement = buttonClick.closest('.popupAddCategory').querySelector('.addCategoryItem');
      const category = categoryElement.value.trim(); //get the value of the category input field

      if (category === '') { //check if the category is empty
        //close the popup
        document.querySelector('.popupAddCategory').style.display = 'none';
        //clear the popup input field
        categoryElement.value = '';
        return;
      }

      //if the category is not empty, add the category to the database
      fetch('/api/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,
          Category: category,
          Name: ''
        }),
      }).then((response) => {
        if (response.status === 200) {
          console.log("Category added successfully");
          setGroceryItemOpen({//close the inventory item input field
            ...groceryItemOpen,
            [category]: false
          });

          setInventoryList(//add the new category to the inventory list
            [...inventoryList, 
            { Name: '', Category: category }]);
            
        } else {
          console.log("Error adding category");
        }
      });
      categoryElement.value = '';//clear the category input field
      document.querySelector('.popupAddCategory').style.display = 'none';//close the popup
    }
  }

  /**
   * Function to handle input change for edit item (both Name and Category)
   * @param {String} category - the category of the item
   * @param {Event} e - the event that triggered the function
   * @param {Number} index - the index of the item
   * @param {String} field - the field to change
   */
  const handleInputChange = (category, e, index, field) => {
    const { value } = e.target;//get the value of the input field
    setInputValues(prevValues => ({ //update the input values with the new value
      ...prevValues,
      [category]: prevValues[category].map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
  };

  /**
   * Function to handle edit click
   * @param {String} category - the category of the item
   * @param {Number} index - the index of the item
  */
  const handleEditClick = (category, index) => {

    if (isEditable[category][index]) {//if the item is in edit mode, update the item
      const item = inputValues[category][index];
      const originalName = categoryList[category][index].Name;

      // If the item is not changed, do not update
      if (originalName === item.Name && categoryList[category][index].Category === item.Category) {
        setIsEditable({
          ...isEditable,
          [category]: isEditable[category].map((item, i) => (i === index ? !item : item))
        });
        return;
      };

      const originalCategory = categoryList[category][index].Category;//get the original category of the item

      // If the item is changed, update the item
      fetch('/api/update-inventory-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,                  // Username
          Name: originalName,                           // Original Name (to find the document)
          Category: originalCategory,                   // Original Category (optional for matching)
          NewName: item.Name,                           // New Name after editing
          NewCategory: item.Category                    // New Category after editing
        }),
      }).then(response => {
        if (response.status === 200) {
          console.log("Item updated successfully");
          // Update the inventory list
          setInventoryList(
            inventoryList.map((element) => {
              if (element.Name === originalName) {
                return { Name: item.Name, Category: item.Category };//update the item with the new values
              }
              return element;//return the element as is if not updated
            }
          ));

        } else {
          console.log("Error updating item");
        }
      }).catch(error => console.error('Error:', error));
    }
    // Toggle the edit mode to enable and disable editing
    setIsEditable({
      ...isEditable,
      [category]: isEditable[category].map((item, i) => (i === index ? !item : item))
    });

  };

  /**
   * Function to remove an item from the inventory list
   * @param {String} category - the category of the item
   * @param {String} itemName - the name of the item
   */
  const removeItem = (category, itemName) => {
    // Remove the item from the database
    fetch('/api/remove-inventory-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: userdata.username,
        Name: itemName,
        Category: category
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Item removed successfully");
        // Update the inventory list
        setInventoryList(
          inventoryList.filter(item => item.Name !== itemName)//remove the item from the inventory list if it exists
        );
      } else {
        console.log("Error removing item");
      }
    });
  };

  /**
   * Function to toggle the popup visibility of add Category and add Grocery
   * @param {String} category - the category of the item
   * @param {Number} index - the index of the item
   * @param {String} type - the type of the popup
   */
  const togglePopup = (category, index, type) => {
    return () => {
      if (type === 'enter') {
        setPopupVisible({
          ...popupVisible,
          [category]: {
            ...popupVisible[category],
            [index]: true
          }
        });
        return;
      }else if (type === 'leave') {
        setPopupVisible({
          ...popupVisible,
          [category]: {
            ...popupVisible[category],
            [index]: false
          }
        });
        return;
      }
    };
  }

  /**
   * Function to add an item to the grocery list
   * @param {String} category - the category of the item
   * @param {String} itemName - the name of the item
   */
  const addToGrocery = (category, itemName) => {
    return () => {
      fetch('/api/add-grocery-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,
          Name: itemName,
          Category: 'Grocery'
        }),
      }).then((response) => {
        if (response.status === 200) {
          console.log("Item added to grocery list successfully");//if the item is added to the grocery list successfully
          //remove the item from the inventory list
          //call the removeItem function
          removeItem(category, itemName);

        } else {
          console.log("Error adding item to grocery list");
        }
      });
    };
  }

  // Render the Inventory component
  return (
    <div className="App">
      <header className="App-header">
        <ProfileBar userdata={userdata} source={"BasePage"}/>
      </header>

      <aside>
        <Sidebar source="Inventory" />
      </aside>

      <main className="content" id="ingredient-content">
        {isLoading ? (
          <section className='inventory'>
            <h4>Inventory</h4>
            <ul>
              <li>Loading...</li>
            </ul>
          </section>
        ) : inventoryList.length === 0 ? (
          <section className='inventory'>
            <h4>Inventory</h4>
            <ul>
              <li>No items in inventory</li>
            </ul>
          </section>
        ) : (
          <div>
            {categories.map((category) => (
              <section key={category} className='inventory'>
                <form onKeyDown={(event) => event.key !== 'Enter'}>
                  <h4>{category}</h4>
                  <div className='InventoryInputContainer' id={`inventory-container-${category}`}>
                    <input
                      type="text"
                      className={`addGroceryItem ${groceryItemOpen[category] ? 'open' : 'closed'}`}
                      value={groceryItemValue}
                      placeholder="Add inventory item..."
                      onChange={(e) => setGroceryItemValue(e.target.value)}
                      style={{ display: groceryItemOpen[category] ? 'block' : 'none' }}
                    />
                    <button className={`addGrocery ${groceryItemOpen[category] === undefined ? ('') : (groceryItemOpen[category] ? 'move-right' : 'move-left')}`} type='button' onClick={() => addInventory(category)}>
                      <IoAddCircle />
                    </button>
                  </div>
                  <ul>
                    {categoryList[category].map((item, index) => (
                      <li key={`${category}-${index}`}>
                        <div className="inventoryItem">

                          {/* Display Remove item link if not in edit mode */}
                          {!isEditable[category]?.[index] && (
                            <span className="inventoryActionsContainer" onMouseEnter={(e) => isTouchDevice ? e.stopPropagation() : togglePopup(category, index, "enter")()} onMouseLeave={togglePopup(category, index, "leave")}>
                              <a className="removeFromInventory" 
                              onClick={(e) => isTouchDevice ? e.stopPropagation() : removeItem(category, item.Name)} 
                              onTouchStart={(e) => {
                                if (popupVisible[category]?.[index]) {
                                  e.stopPropagation();
                                  togglePopup(category, index, "leave")();
                                  removeItem(category, item.Name);
                                } else {
                                  e.stopPropagation();
                                  togglePopup(category, index, "enter")();
                                }
                              }}>
                                {item.Name}
                              </a>
                              {popupVisible[category]?.[index] &&
                                <a className="addToGrocery" onClick={() => { addToGrocery(category, item.Name)(); togglePopup(category, index, "leave")();}}>add to Grocery</a>
                              }
                            </span>
                          )}

                          {/* Name input: visible when in edit mode */}
                          {isEditable[category]?.[index] && (
                            <input
                              type="text"
                              className="editItem"
                              value={inputValues[category]?.[index]?.Name}
                              onChange={(e) => handleInputChange(category, e, index, 'Name')}
                            />
                          )}

                          {/* Edit icon to toggle both fields */}
                          <AiOutlineEdit
                            className="edit-icon"
                            onClick={() => handleEditClick(category, index)}
                          />

                          {/* Category input: visible when in edit mode */}
                          {isEditable[category]?.[index] && (
                            <input
                              type="text"
                              className="editItem editCategory"
                              value={inputValues[category]?.[index]?.Category}
                              onChange={(e) => handleInputChange(category, e, index, 'Category')}
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </form>
              </section>
            ))}
          </div>
        )}
        <button className='addCategory' type='button' onClick={(event) => addCategory(event, false)}>Add Category</button>
        <div className="popupAddCategory">
          <input type="text" className="addCategoryItem" name="categoryItem" placeholder="Add category..." />
          <button className="addCategory" type='button' onClick={(event) => addCategory(event, true)}><IoAddCircle /></button><br />
        </div>
      </main>
    </div>
  );
}

export default Inventory;
