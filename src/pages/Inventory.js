import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Inventory() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Inventory"/>
      </aside>

      <main className ="content">
        <h1>Inventory</h1>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Inventory;
