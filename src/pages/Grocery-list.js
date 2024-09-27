import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState, useEffect } from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

function getGrocery() {
  
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

function Grocery() {
  const [groceryItemOpen, setGroceryItemOpen] = useState({});
  const [groceryItemValue, setGroceryItemValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [isEditable, setIsEditable] = useState({}); // State to track which items are editable

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

  useEffect(() => {
    const fetchGrocery = async () => {
      const inventory = await getGrocery();
      setGroceryList(inventory);
    };

    if (groceryList.length === 0) {
      console.log("Getting inventory list");
      fetchGrocery();
    }
  }, [groceryList]);

  // Create a dictionary for categories
  const categoryList = {};
  const categories = [...new Set(groceryList.map(item => item.Category))];
  categories.forEach((category) => {
    categoryList[category] = groceryList.filter(item => item.Category === category);
  });

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
  }, [groceryList]);

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
        getGrocery().then((grocery) => {
          console.log("Grocery list updated");
          setGroceryList(grocery);
        });
      } else {
        console.log("Error adding grocery item");      }
    });
  }

  function addGrocery(category) {
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
        addGroceryItem(value, category);
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

      if (category === ''){
          //close the popup
        document.querySelector('.popupAddCategory').style.display = 'none';
        //clear the popup input field
        categoryElement.value = '';
        return;
      }

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
          setGroceryItemOpen({
            ...groceryItemOpen,
            [category]: false
          });

          getGrocery().then((grocery) => {
            console.log("Grocery list updated");
            setGroceryList(grocery);
          });
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
          Username: localStorage.getItem('username'),   // Username
          Name: originalName,                           // Original Name (to find the document)
          Category: originalCategory,                   // Original Category (optional for matching)
          NewName: item.Name,                           // New Name after editing
          NewCategory: item.Category                    // New Category after editing
        }),
      }).then(response => {
        if (response.status === 200) {
          console.log("Item updated successfully");
          getGrocery().then((inventory) => {
            setGroceryList(inventory);
          });
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
    fetch('/api/remove-grocery-item', {
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
        getGrocery().then((grocery) => {
          setGroceryList(grocery);
        });
      } else {
        console.log("Error removing item");
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <ProfileBar />
      </header>

      <aside>
        <Sidebar source="Grocery" />
      </aside>

      <main className="content" id="ingredient-content">
        {groceryList.length === 0 ? (
          <section className='grocery'>
            <h4>Inventory</h4>
            <ul>
              <li>Loading...</li>
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
                    <button className={`addGrocery ${groceryItemOpen[category] ===undefined ? (''):(groceryItemOpen[category]? 'move-right' : 'move-left')}`} type='button' onClick={() => addGrocery(category)}>
                      <IoAddCircle />
                    </button>
                  </div>
                  <ul>
                    {categoryList[category].map((item, index) => (
                      <li key={`${category}-${index}`}>

                        {/* Display Remove item link if not in edit mode */}
                        {!isEditable[category]?.[index] && (
                          <a className="removeFromInventory" onClick={() => removeItem(category, item.Name)}>
                            {item.Name}
                          </a>
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
                      </li>
                    ))}
                  </ul>
                </form>
              </section>
            ))}
            <button className='addCategory' type='button' onClick={(event) => addCategory(event, false)}>Add Category</button>
            <div className="popupAddCategory">
              <input type="text" className="addCategoryItem" name="categoryItem" placeholder="Add category..." />
              <button className="addCategory" type='button' onClick={(event) => addCategory(event, true)}><IoAddCircle /></button><br />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Grocery;
