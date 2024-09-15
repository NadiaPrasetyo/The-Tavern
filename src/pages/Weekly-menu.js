import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';
import RecipeTab from '../components/RecipeTab.js';

function Menu() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Menu"/>
      </aside>

      <main className ="content">
        <h1>Week</h1>
        <RecipeTab />
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Menu;
