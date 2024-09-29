import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Feedback({userdata}) {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar userdata={userdata}/>
      </header>

      <aside>
        <Sidebar source = "Feedback"/>
      </aside>

      <main className ="content setting-content">
        <h1>Feedback</h1>

      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Feedback;
