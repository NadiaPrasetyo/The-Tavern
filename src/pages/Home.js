import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import { IoAddCircle } from "react-icons/io5";

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
         <section className='todayMenu'>
            <table>
              <tr>
                <th>Today</th>
              </tr>
              <tr>
                <td>Scrambled eggs and toast</td>
              </tr>
              <tr>
                <td>Grilled cheese sandwich</td>
              </tr>
              <tr>
                <td>Spaghetti and meatballs</td>
              </tr>
            </table>
        </section>

        <section className='groceryList'>
            <form>
              <h4>Grocery List</h4>
              <button class = "addGrocery"><IoAddCircle /></button><br/>
              <label class = "groceryItem">
                <input type="checkbox" id="item1" name="item1" value="item1"/>
                <span class = "checkmark"></span>
                <span className='itemName'>Item 1</span>
                <a href="/Grocery-list/add"> add to Inventory</a>
              </label><br/>
              <label class = "groceryItem">
                <input type="checkbox" id="item2" name="item2" value="item2"/>
                <span class = "checkmark"></span>
                <span className='itemName'>Item 2</span>
                <a href="/Grocery-list/add"> add to Inventory</a>
              </label><br/>
              <label class = "groceryItem">
                <input type="checkbox" id="item3" name="item3" value="item3"/>
                <span class = "checkmark"></span>
                <span className='itemName'>Item 3</span>
                <a href="/Grocery-list/add"> add to Inventory</a>
              </label><br/>
            </form>
        </section>
      </main>     


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Home;
