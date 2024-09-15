import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Options() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Options"/>
      </aside>

      <main className ="content setting-content">
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
