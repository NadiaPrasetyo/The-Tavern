import '../App.css';
import Sidebar from '../components/sidebar.js';

import React, { useState, useEffect } from 'react';
import ProfileBar from '../components/profilebar.js';

import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { VscTriangleDown } from "react-icons/vsc";


function Preference() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [displayOption, setDisplayOptions] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  const fetchPreference = async () => {
    const username = localStorage.getItem('username');
    const response = await fetch(`/api/get-preference?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    // if preference exists, set the preference
    if (data.DarkMode) {
      setIsDarkMode(data.DarkMode);
    }
    if (data.FirstDay) {
      setSelectedDay(data.FirstDay);
    }
  }

  const fetchData = async (method) => {
    // not implemented yet
    return;

    const username = localStorage.getItem('username');
    const response = await fetch(`/api/get-preference?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (method === 'excel') {
      // download Grocery List as Excel

      // download Inventory as Excel

      // download Menu as Excel

      // download Favorites as Excel
    } else if (method === 'csv') {
      // download Grocery List as CSV

      // download Inventory as CSV

      // download Menu as CSV

      // download Favorites as CSV

    }
  }

  const deleteAccount = async () => {
    const username = localStorage.getItem('username');
    const response = await fetch(`/api/delete-account?username=${encodeURIComponent(username)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.success) {
      // redirect to login page
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    fetchPreference();
  }, []);

  // redirect to /login
  const logout = () => {
    window.location.href = '/login';
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


        {/* Font size  USE SLIDER */}
        <div className="pref font-size">
          <h2>Font Size</h2>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={fontSize} 
            className="slider" 
            id="myRange" 
            onChange={(e) => setFontSize(e.target.value)}
          />
          <span className='font-size-text'>{fontSize}</span>
        </div>

        {/* Menu format for table */}
        <div className="pref menu-format">
          <h2>Menu Format</h2>
          {/* which day is the first day */}
          <div className="menu-format-day">
            <label for="first-day">First Day of the Week</label>
            {/* hoverable drop down */}
              <div className="dropbtn" onMouseEnter={() => setDisplayOptions(true)} onMouseLeave={() => setDisplayOptions(false)} onClick={() => setDisplayOptions(!displayOption)} >
                <div className='chosen'>{selectedDay}</div>
                <VscTriangleDown className="triangle-down"/>
              </div>
              { displayOption ? (
                <div className='dropdown-menu' onMouseEnter={() => setDisplayOptions(true)} onMouseLeave={() => setDisplayOptions(false)}>
                  <div className='background'>
                    <div className='color-overlay'>
                      <div className='day-option' onClick={() => setSelectedDay('Monday')}>Monday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Tuesday')}>Tuesday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Wednesday')}>Wednesday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Thursday')}>Thursday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Friday')}>Friday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Saturday')}>Saturday</div>
                      <div className='day-option' onClick={() => setSelectedDay('Sunday')}>Sunday</div>
                    </div>
                  </div>
                </div>
              ) : null }
          </div>
        </div>


        {/* Download data as excel or comma separated list */}
        <div class="pref download-data">
          <h2>Download Data</h2>
          <button onClick={() => fetchData('excel')}>Download as Excel</button>
          <button onClick={() => fetchData('csv')}>Download as CSV</button>
        </div>

        {/* Logout */}
        <div class="pref logout">
          <h2>Logout</h2>
          <button onClick={() => logout()}>Logout</button>
        </div>


        {/* Delete account */}
        <div class="pref delete-account">
          <h2>Delete Account</h2>
          <button className='delete-acc' onClick={() => setDisplayConfirm(true)}>Delete Account</button>
        </div>
      </main>

      {/* Password Modal */}
      {displayConfirm && (
        <div className="modal">
          <div className="modal-content delete-popup">
            <h2>Delete Account</h2>
            <p>This is irreversible change</p>

            <div className="modal-buttons preference">
              <button onClick={() => setDisplayConfirm(false)}>Cancel</button>
              <button className='delete-acc' onClick={() => deleteAccount()}>Delete</button>
            </div>
          </div>
        </div>
      )}


      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}

export default Preference;
