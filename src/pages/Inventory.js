import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect } from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

function Inventory({userdata}) {
  const [groceryItemOpen, setGroceryItemOpen] = useState({});
  const [groceryItemValue, setGroceryItemValue] = useState('');
  const [inventoryList, setInventoryList] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [isEditable, setIsEditable] = useState({}); // State to track which items are editable
  const [popupVisible, setPopupVisible] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get the inventory from the server
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
    setIsLoading(false);
  }

  useEffect(() => {
    getInventory();
  }, []);


  document.onkeydown = function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const addGroceryButtons = document.querySelectorAll('.addGrocery');
      for (let i = 0; i < addGroceryButtons.length; i++) {
        if (addGroceryButtons[i].style.left === '250px') {
          addGroceryButtons[i].click();
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
        console.log("Inventory item added successfully");
        document.querySelector('.addGroceryItem').value = '';
        setInventoryList(
          [...inventoryList, 
          { Name: item, Category: category }]);
      } else {
        console.log("Error adding inventory item");
      }
    });
  }

  function addInventory(category) {
    if (groceryItemOpen[category] === undefined) {
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: false
      });
    }
    const isOpen = groceryItemOpen[category];

    if (!isOpen) {
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: true
      });
    } else {
      const value = groceryItemValue.trim();
      if (value !== '') {
        addInventoryItem(value, category);
        setGroceryItemValue('');
      }
      setGroceryItemOpen({
        ...groceryItemOpen,
        [category]: false
      });
    }
  }

  function addCategory(event, confirmedPopup) {
    const buttonClick = event.target;

    if (!confirmedPopup) {
      //get the source button
      const popup = document.querySelector('.popupAddCategory');
      //check if popup is already open
      if (popup.style.display === 'block') {
        popup.style.display = 'none';
        return;
      }

      popup.style.display = 'block';

    } else {
      const categoryElement = buttonClick.closest('.popupAddCategory').querySelector('.addCategoryItem');
      const category = categoryElement.value.trim();

      if (category === '') {
        //close the popup
        document.querySelector('.popupAddCategory').style.display = 'none';
        //clear the popup input field
        categoryElement.value = '';
        return;
      }

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
          setGroceryItemOpen({
            ...groceryItemOpen,
            [category]: false
          });

          setInventoryList(
            [...inventoryList, 
            { Name: '', Category: category }]);
            
        } else {
          console.log("Error adding category");
        }
      });
      categoryElement.value = '';
      document.querySelector('.popupAddCategory').style.display = 'none';
    }
  }

  const handleInputChange = (category, e, index, field) => {
    const { value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [category]: prevValues[category].map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
  };

  const handleEditClick = (category, index) => {

    if (isEditable[category][index]) {
      const item = inputValues[category][index];
      const originalName = categoryList[category][index].Name;
      const originalCategory = categoryList[category][index].Category;

      console.log("Original Name:", originalName);

      console.log("Updating item:", item);

      fetch('/api/update-inventory-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userdata.username,   // Username
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
      [category]: isEditable[category].map((item, i) => (i === index ? !item : item))
    });

  };

  const removeItem = (category, itemName) => {
    console.log("Removing item: " + itemName);
    console.log("Removing item: " + itemName);
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
          inventoryList.filter(item => item.Name !== itemName)
        );
      } else {
        console.log("Error removing item");
      }
    });
  };

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

  const addToGrocery = (category, itemName) => {
    return () => {
      console.log("Adding item to grocery list: " + itemName);
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
          console.log("Item added to grocery list successfully");
          //remove the item from the inventory list
          //call the removeItem function
          removeItem(category, itemName);

        } else {
          console.log("Error adding item to grocery list");
        }
      });
    };
  }

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
                            <span className="inventoryActionsContainer" onMouseEnter={togglePopup(category, index, "enter")} onMouseLeave={togglePopup(category, index, "leave")}>
                              <a className="removeFromInventory" onClick={() => removeItem(category, item.Name)}>
                                {item.Name}
                              </a>
                              {popupVisible[category]?.[index] &&
                                <a className="addToGrocery" onClick={addToGrocery(category, item.Name)}>add to Grocery</a>
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
