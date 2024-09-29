/* 404 NO PAGE FOUND */import '../App.css';
import Sidebar from '../components/sidebar.js';
import ProfileBar from '../components/profilebar.js';
import Loading from '../components/Loading.js';

import React from 'react';

function Trial() {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar />
      </aside>

      <main className ="content">
        <h1>Trial</h1>
        <Loading />
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Trial;
