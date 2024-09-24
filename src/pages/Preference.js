import '../App.css';
import Sidebar from '../components/sidebar.js';

import React from 'react';
import ProfileBar from '../components/profilebar.js';

import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";


function Preference() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar/>
      </header>

      <aside>
        <Sidebar source = "Preference"/>
      </aside>

      <main className ="content setting-content">
        <h1>Preference</h1>
        {/* Dark Mode */}
        <div class="pref dark-mode">
          <h2>Dark Mode</h2>
          <input className="checkbox" type="checkbox" id="toggle"/>
          <div className={isDarkMode ? 'dark' : 'light'}>
            <label className='toggle' for="toggle" onClick={toggleDarkMode}>
              <MdOutlineLightMode className='icon light-mode'/>
              <MdOutlineDarkMode className='icon dark-mode'/>
              <span className="ball"></span>
            </label>
          </div>
        </div>


        {/* Font size  USE SLIDER*/}
        <div class="pref font-size">
          <h2>Font Size</h2>
          <input type="range" min="1" max="100" value="50" class="slider" id="myRange"/>
        </div>


        {/* Menu format for table */}
        <div class="pref menu-format">
          <h2>Menu Format</h2>
          {/* which day is the first day */}
          <div class="menu-format-day">
            <label for="first-day">First Day of the Week</label>
            {/* hoverable drop down */}
            <div className='dropdown-container dropdown-bordered'>
              <div class="dropdown-toggle hover-dropdown">
                Monday
              </div>
              <div className='dropdown-menu'>
                <ul>
                  <li><div className='day-option'>Monday</div></li>
                  <li><div className='day-option'>Tuesday</div></li>
                  <li><div className='day-option'>Wednesday</div></li>
                  <li><div className='day-option'>Thursday</div></li>
                  <li><div className='day-option'>Friday</div></li>
                  <li><div className='day-option'>Saturday</div></li>
                  <li><div className='day-option'>Sunday</div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        {/* Download data as excel or comma separated list */}
        <div class="pref download-data">
          <h2>Download Data</h2>
          <button>Download as Excel</button>
          <button>Download as CSV</button>
        </div>

        {/* Logout */}
        <div class="pref logout">
          <h2>Logout</h2>
          <button>Logout</button>
        </div>


        {/* Delete account */}
        <div class="pref delete-account">
          <h2>Delete Account</h2>
          <button className='delete-acc'>Delete Account</button>
        </div>
      </main>


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}




export default Preference;
