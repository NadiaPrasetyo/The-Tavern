/* 404 NO PAGE FOUND */import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';

const isDarkMode = false;//default to false



function NoPage() {
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
      </header>

      <aside>
        <Sidebar />
      </aside>

      <main className ="content">
        <h1>404 Page Not Found</h1>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default NoPage;
