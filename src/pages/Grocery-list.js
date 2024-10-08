import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect } from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

/**
 * Grocery list component
 * @param {Object} userdata - user data
 * @returns the Grocery component
 */
function Grocery({userdata}) {
  const [groceryItemOpen, setGroceryItemOpen] = useState({});//state to track which grocery item is open
  const [groceryItemValue, setGroceryItemValue] = useState('');//state to track the value of the grocery item
  const [groceryList, setGroceryList] = useState([]);//state to track the grocery list
  const [inputValues, setInputValues] = useState({});//state to track the input values
  const [isEditable, setIsEditable] = useState({}); // State to track which items are editable
  const [isLoading, setIsLoading] = useState(false);//state to track if the page is loading

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  /**
   * Function to get the grocery list
   * @param {Event} e - the event
   */
  const getGrocery = async (e) => {
    setIsLoading(true);//set loading to true while fetching data
    try {
      const response = await fetch('/api/get-grocery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username
        }),
      });

      const grocery = await response.json();

      if (response.status === 200) {
        setGroceryList(grocery.grocery);//set the grocery list: update the state
      } else {
        console.log("Error getting grocery");
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);//set loading to false after fetching data
  }

  // Function to get the grocery list on page load
  useEffect(() => {
    getGrocery();
  }, []);

  //prevent the submission of the form when the enter key is pressed
  document.onkeydown = function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const addGroceryButtons = document.querySelectorAll('.addGrocery');
      for (let i = 0; i < addGroceryButtons.length; i++) {
        if (addGroceryButtons[i].classList.contains('move-right')) {//if the button is open
          addGroceryButtons[i].click();//click the button
          break;
        }
      }
    }
  };

  // Create a dictionary for categories
  const categoryList = {};
  const categories = [...new Set(groceryList.map(item => item.Category))];
  categories.forEach((category) => {
    categoryList[category] = groceryList.filter(item => item.Category === category);
  });

  // Update the input values and isEditable state when the grocery list changes
  useEffect(() => {
    if (groceryList.length > 0) {
      const categories = [...new Set(groceryList.map(item => item.Category))];
      const newIsEditable = {};
      const newInputValues = {};

      categories.forEach((category) => {
        newIsEditable[category] = new Array(categoryList[category].length).fill(false);
        newInputValues[category] = categoryList[category].map((item) => ({ ...item }));
      });

      setIsEditable(newIsEditable);
      setInputValues(newInputValues);
    }
  }, [groceryList]);//on grocery list change

  /**
   * Function to add a grocery item
   * @param {String} item - the grocery item
   * @param {String} category - the category of the grocery item
   */
  function addGroceryItem(item, category) {
    // Add the grocery item to the database
    // If the item already exists in the grocery list, update the name
    fetch('/api/add-grocery-item', {
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
        console.log("Grocery item added successfully");
        //clear the input field
        document.querySelector('.addGroceryItem').value = '';

        // if Name: '' , Category: category already exists in groceryList, just change the Name
        if (groceryList.some(element => element.Name === '' && element.Category === category)) {
          setGroceryList(
            groceryList.map((element) => {
              if (element.Name === '' && element.Category === category) {
                return { Name: item, Category: category };
              }
              return element;
            }
          ));
        } else {
          //update the grocery list
          setGroceryList([...groceryList, { Name: item, Category: category }]);
        }

      } else {
        console.log("Error adding grocery item");
      }
    });
  }

  /**
   * Function to add a grocery item
   * @param {String} category - the category of the grocery item
   */
  function addGrocery(category) {
    if (groceryItemOpen[category] === undefined) {//if the category is not in the groceryItemOpen state, it initializes it
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: false
      });
    }
    const isOpen = groceryItemOpen[category];

    if (!isOpen) {//open the input field if it is closed
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: true
      });
    } else {
      const value = groceryItemValue.trim();
      if (value !== '') {
        addGroceryItem(value, category);//add the grocery item
        setGroceryItemValue('');
      }
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: false
      });
    }
  }

  /**
   * Function to add a grocery category
   * @param {Event} event - the event
   * @param {Boolean} confirmedPopup - the boolean to check if the popup is confirmed
   */
  function addCategory(event, confirmedPopup) {
    const buttonClick = event.target;//get the button that was clicked

    if (!confirmedPopup) {
      //get the source button
      const popup = document.querySelector('.popupAddCategory');
      //check if popup is already open and close it if it is
      if (popup.style.display === 'block') {
        popup.style.display = 'none';
        return;
      }

      popup.style.display = 'block';//display the popup

    } else {
      const categoryElement = buttonClick.closest('.popupAddCategory').querySelector('.addCategoryItem');//get the input field
      const category = categoryElement.value.trim();

      if (category === '') {//if the category is empty, close the popup and return
        //close the popup
        document.querySelector('.popupAddCategory').style.display = 'none';
        //clear the popup input field
        categoryElement.value = '';
        return;
      }

      // Add the category to the database
      fetch('/api/add-grocery-category', {
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
        if (response.status === 200) {//if the category is added successfully, update the grocery list
          console.log("Category added successfully");
          setGroceryItemOpen({
            ...groceryItemOpen,
            [category]: false
          });

          setGroceryList([...groceryList, //update the grocery list
            { Name: '', Category: category }]);
        } else {
          console.log("Error adding category");
        }
      });
      categoryElement.value = '';//clear the input field
      document.querySelector('.popupAddCategory').style.display = 'none';//close the popup
    }
  }

  /**
   * Function to handle input change for edit item
   * @param {String} category - the category of the grocery item
   * @param {Event} e - the event
   * @param {Number} index - the index of the grocery item
   * @param {String} field - the field of the grocery item
   */
  const handleInputChange = (category, e, index, field) => {
    const { value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [category]: prevValues[category].map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
  };

  /**
   * Function to handle edit click for grocery item
   * @param {String} category - the category of the grocery item
   * @param {Number} index - the index of the grocery item
   */
  const handleEditClick = (category, index) => {

    if (isEditable[category][index]) {
      const item = inputValues[category][index];
      const originalName = categoryList[category][index].Name;
      const originalCategory = categoryList[category][index].Category;

      if (originalName === item.Name && originalCategory === item.Category) {
        setIsEditable({
          ...isEditable,
          [category]: isEditable[category].map((item, i) => (i === index ? !item : item))
        });
        return;//if the item is not changed, return
      }
      // Update the grocery item in the database with the new name and category
      fetch('/api/update-grocery-item', {
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
          setGroceryList(//update the grocery list
            groceryList.map((element) => {
              if (element.Name === originalName) {
                return { Name: item.Name, Category: item.Category };
              }
              return element;
            }
          ));
        } else {
          console.log("Error updating item");
        }
      }).catch(error => console.error('Error:', error));
    }
    setIsEditable({
      ...isEditable,
      [category]: isEditable[category].map((item, i) => (i === index ? !item : item))//toggle the edit mode
    });

  };

  /**
   * Function to remove a grocery item
   * @param {String} category - the category of the grocery item
   * @param {String} itemName - the name of the grocery item
   */
  const removeItem = (category, itemName) => {
    console.log("Removing item: " + itemName);
    fetch('/api/remove-grocery-item', {
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
        setGroceryList(groceryList.filter(item => item.Name !== itemName));//update the grocery list by removing the item
      } else {
        console.log("Error removing item");
      }
    });
  };

  /**
   * Function to add grocery item to inventory and remove from grocery list
   * @param {String} item - the grocery item
   * @param {String} category - the category of the grocery item
   */
  function addToInventory(item, category) {
    // Add the specified grocery item to the inventory and remove it from the grocery list
    if (item === '') {
      removeItem(category, '');//remove empty items
      return;
    }

    // Add the grocery item to the inventory
    const addToInventory = async (e) => {
      const response = await fetch('/api/add-to-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,
          Name: item,
          Category: 'Inventory',
        }),
      });

      if (response.status === 200 || response.status === 409) {//if the item is added successfully or already exists, remove it from the grocery list
        console.log("Grocery item added to inventory");

        // Remove the grocery item from the list
        const response2 = await fetch('/api/remove-grocery-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: userdata.username,
            Name: item,
          }),
        });
        // Update the grocery list

        if (response2.status === 200) {
          console.log("Grocery item removed from list");
          //update the grocery list
          setGroceryList(groceryList.filter(groceryItem => groceryItem.Name !== item));
        } else {
          console.log("response status: ", response2.status);
          console.log("Error removing grocery item from list");
        }

      } else {
        console.log("Error adding grocery item to inventory");
      }
    }
    addToInventory();

  }

  // Render the grocery list
  return (
    <div className="App">
      <header className="App-header">
        <ProfileBar userdata={userdata} source={"BasePage"}/>
      </header>

      <aside>
        <Sidebar source="Grocery" />
      </aside>

      <main className="content" id="ingredient-content">
        {isLoading? (
          <section className='grocery'>
            <h4>Grocery List</h4>
            <ul>
              <li>Loading...</li>
            </ul>
          </section>
        ) : groceryList.length === 0 ? (
          <section className='grocery'>
            <h4>Grocery List</h4>
            <ul>
              <li>No items in grocery list</li>
            </ul>
          </section>
        ) : (
          <div>
            {categories.map((category) => (
              <section key={category} className='grocery'>
                <form onKeyDown={(event) => event.key !== 'Enter'}>
                  <h4>{category}</h4>
                  <div className='InventoryInputContainer'>
                    <input
                      type="text"
                      className={`addGroceryItem ${groceryItemOpen[category] ? 'open' : 'closed'}`}
                      value={groceryItemValue}
                      placeholder="Add grocery item..."
                      onChange={(e) => setGroceryItemValue(e.target.value)}
                      style={{ display: groceryItemOpen[category] ? 'block' : 'none' }}
                    />
                    <button className={`addGrocery ${groceryItemOpen[category] === undefined ? ('') : (groceryItemOpen[category] ? 'move-right' : 'move-left')}`} type='button' onClick={() => addGrocery(category)}>
                      <IoAddCircle />
                    </button>
                  </div>
                  <ul>
                    {categoryList[category].map((item, index) => (
                      <div key={`${category}-${index}`}>

                        {/* Display Remove item link if not in edit mode */}
                        {!isEditable[category]?.[index] && (
                          <label key={index} className="groceryItem">
                            <input type="checkbox" id={item.Name} name={item.Name} value={item.Name} />
                            <span className="checkmark"></span>
                            <span className='itemName'>{item.Name}</span>
                            <a onClick={(e) => isTouchDevice? e.stopPropagation() : addToInventory(item.Name, category)}
                              onTouchStart={(e) => { e.stopPropagation(); addToInventory(item.Name, category); }}
                              > add to Inventory</a>
                            <a className="removeItem" onClick={() => removeItem(item.Category, item.Name)}> remove from Grocery</a>
                          </label>
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

export default Grocery;
