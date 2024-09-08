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
              <h3>Grocery List</h3>
              <button class = "addGrocery"><IoAddCircle /></button>
              <input type="checkbox" id="item1" name="item1" value="item1"/>
              <label for="item1">Item 1</label>
              <input type="checkbox" id="item2" name="item2" value="item2"/>
              <label for="item2">Item 2</label>
              <input type="checkbox" id="item3" name="item3" value="item3"/>
              <label for="item3">Item 3</label>


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
