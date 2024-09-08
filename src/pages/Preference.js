import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';
import ProfileBar from '../components/profilebar.js';

const isDarkMode = false;//default to false


function Preference() {
  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'white';
    });
  }
  else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'black';
    });
  }

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Preference"/>
      </aside>

      <main className ="content">
        <h1>Preference</h1>
        {/* Dark Mode */}


        {/* Font size  USE SLIDER*/}


        {/* Menu format for table */}


        {/* Download data as excel or comma separated list */}


        {/* Logout */}


        {/* Delete account */}
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Preference;
