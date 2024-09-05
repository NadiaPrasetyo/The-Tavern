import './App.css';
import Sidebar from './sidebar.js';
import { IoMdMenu } from "react-icons/io";
import React from 'react';


const isDarkMode = false;//default to false

function ProfileBar(props) {
    return (
      <div className="profilebar">
        <p>{props.username}</p>
        <IoMdMenu className='menuIcon'/>
      </div>
    );
  
}


function App() {
  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
  }
  else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
  }

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar username = "Red"/>
      </header>

      <aside>
        <Sidebar />
      </aside>

      <main className ="content">
        <h1>Content</h1>
        <p>This is the main content area</p>
      </main>

      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default App;
