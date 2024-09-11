/* 404 NO PAGE FOUND */import '../App.css';
import Sidebar from '../components/sidebar.js';
import RecipeTab from '../components/RecipeTab.js';

import React from 'react';

function Trial() {

  return (
    
    <div className="App">
      <header class = "App-header">
      </header>

      <aside>
        <Sidebar />
      </aside>

      <main className ="content">
        <RecipeTab />
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Trial;
