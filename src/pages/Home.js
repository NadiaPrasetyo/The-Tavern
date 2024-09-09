import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";

function getTodayMenu() {
  // Get today's menu from the server
  
  return [
    { name: 'Scrambled eggs and toast' },
    { name: 'Grilled cheese sandwich' },
    { name: 'Spaghetti and meatballs' },
  ];
}

function getGroceryList() {
  // Get grocery list from the server
  return [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
  ];
}

function TodayMenu() {
  const menu = getTodayMenu();
  return (
    <section className='todayMenu'>
      <table>
        <tr>
          <th>Today</th>
        </tr>
        {menu.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
          </tr>
        ))}
      </table>
    </section>
  );  
}

function GroceryList() {
  const groceryList = getGroceryList();
  return (
    <section className='groceryList'>
      <form>
        <h4>Grocery List</h4>
        <button class = "addGrocery"><IoAddCircle /></button><br/>
        {groceryList.map((item, index) => (
          <label key={index} class = "groceryItem">
            <input type="checkbox" id={item.name} name={item.name} value={item.name}/>
            <span class = "checkmark"></span>
            <span className='itemName'>{item.name}</span>
            <a href="/Grocery-list/add"> add to Inventory</a>
          </label>
        ))}
      </form>
    </section>
  );
}

function Home() {

  return (
    
    <div className="App">
      <header class = "App-header">
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
