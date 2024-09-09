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
     console.log("menu: " + menu);

    if (response.status === 200) {
      console.log("menu: " + menu.menu);
      return menu.menu;  // Update the state with the fetched menu
    } else {
      console.log("Error getting today's menu");
      return [];
    }
    
  } 

  return getTodayMenu();
}

function TodayMenu() {
  const [today, setToday] = React.useState([]);
  
  if (today.length === 0) {
    getTodayMenu().then((menu) => {
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

/*const TodayMenu = () => {

  // Fetch the menu using useEffect when the component mounts
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/get-menu-today', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: localStorage.getItem('username'),
          }),
        });

        const menu = await response.json();

        if (response.status === 200) {
          setTodayMenu(menu.menu);  // Update the state with the fetched menu
        } else {
          console.log("Error getting today's menu");
        }
      } catch (error) {
        console.log("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);  // Empty dependency array ensures the effect runs only once on component mount

  return (
    <section className='todayMenu'>
      <table>
        <thead>
          <tr>
            <th>Today</th>
          </tr>
        </thead>
        <tbody>
          {todayMenu.length > 0 ? (
            todayMenu.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}; */

function GroceryList() {
  const groceryList = getGroceryList();
  return (
    <section className='groceryList'>
      <form>
        <h4>Grocery List</h4>
        <button className = "addGrocery"><IoAddCircle /></button><br/>
        {groceryList.map((item, index) => (
          <label key={index} className = "groceryItem">
            <input type="checkbox" id={item.name} name={item.name} value={item.name}/>
            <span className = "checkmark"></span>
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
