/* 404 NO PAGE FOUND */import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';

function NoPage() {

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
