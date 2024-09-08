import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Home() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <div className ="container">
      <aside>
        <Sidebar source = "Home"/>
      </aside>

      <main className ="content">
        <h1>Home</h1>
        <p>Welcome to the home page</p>
      </main>
      </div>      


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Home;
