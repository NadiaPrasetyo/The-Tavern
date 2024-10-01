import '../App.css';
import Sidebar from '../components/sidebar.js';
import React from 'react';
import ProfileBar from '../components/profilebar.js';

function Feedback({userdata}) {

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar userdata={userdata} source={"Feedback"}/>
      </header>

      <aside>
        <Sidebar source = "Feedback"/>
      </aside>

      <main className ="content setting-content">
        <iframe src="https://forms.gle/f3iArU8CkjBGCmD9A"  height="1000" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Feedback;
