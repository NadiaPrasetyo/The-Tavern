import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';
import ProfileBar from '../components/profilebar.js';

const isDarkMode = false;//default to false


function Options() {
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
        <Sidebar source = "Options"/>
      </aside>

      <main className ="content">
        <h1>Options</h1>

        {/* Grocer */}

        <h2>Grocer</h2>
        <h3>COMING SOON!</h3>

        {/* Feedback */}


        {/* Help */}


        {/* FAQ */}

      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Options;
