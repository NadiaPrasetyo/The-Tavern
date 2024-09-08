import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Preference() {
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
