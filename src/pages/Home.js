import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";


function getGroceryList() {
  // Get grocery list from the server
  return [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
  ];
}

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

  if (groceryList.length === 0) {
    return (
      <section className='groceryList'>
        <form>
          <h4>Grocery List</h4>
          <button className = "addGrocery"><IoAddCircle /></button><br/>
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
      <form>
        <h4>Grocery List</h4>
        <button className = "addGrocery"><IoAddCircle /></button><br/>
        {groceryList.map((item, index) => (
          <label key={index} className = "groceryItem">
            <input type="checkbox" id={item.Name} name={item.Name} value={item.Name}/>
            <span className = "checkmark"></span>
            <span className='itemName'>{item.Name}</span>
            <a href="/Grocery-list/add"> add to Inventory</a>
          </label>
        ))}
      </form>
    </section>
  );
  }

}

function Home() {

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
