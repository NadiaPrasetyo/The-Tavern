import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Grocery() {
  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Grocery"/>
      </aside>

      <main className ="content">
        <h1>Grocery List</h1>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Grocery;
