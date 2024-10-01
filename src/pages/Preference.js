import '../App.css';
import Sidebar from '../components/sidebar.js';

import React, { useState, useEffect, useContext } from 'react';
import ProfileBar from '../components/profilebar.js';

import { VscTriangleDown } from "react-icons/vsc";
import { ThemeContext } from '../components/ThemeContext.js';


function Preference({userdata}) {
  const [isDarkModeSwitch, setisDarkModeSwitch] = useState(false);
  const [displayOption, setDisplayOptions] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  // const [fontSize, setFontSize] = useState(16);

  // // Function to toggle dark mode
  // const toggleDarkMode = () => {
  //   setisDarkModeSwitch((prevMode) => !prevMode);
  // };

  const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    setisDarkModeSwitch(isDarkMode);

    return (
      <div className="pref dark-mode">
      <h2>Dark Mode</h2>
      <input className="checkbox" type="checkbox" id="toggle"/>
      <div className={isDarkMode ? 'dark' : 'light'}>
        <label className='toggle' onClick={toggleDarkMode}>
          <span className="ball"></span>
        </label>
      </div>
      </div>
    );
  };

  const fetchPreference = async () => {
    const username = userdata.username;
    const response = await fetch(`/api/get-preference?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    // if preference exists, set the preference
    if (data.preferences.DarkMode) {
      setisDarkModeSwitch(data.preferences.DarkMode);
    }
    if (data.preferences.FirstDay) {
      setSelectedDay(data.preferences.FirstDay);
    }
  }

  useEffect(() => {
    fetchPreference();
  }, []);

  const updatePreference = async () => {
    const username = userdata.username;

    const preference = {};
    if (isDarkModeSwitch !== null) preference.DarkMode = isDarkModeSwitch;
    if (selectedDay !== 'Monday') preference.FirstDay = selectedDay;

    const response = await fetch('/api/update-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        preferences: preference,
      }),
    });

    const data = await response.json();
    console.log("Preferences Updated!" +data);
  };
  // Apply the user's dark mode preference on initial load
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    const storedDay = localStorage.getItem('firstDay') || 'Monday';

    if (storedDarkMode !== null) {
      const isDark = storedDarkMode === 'true'; // Convert string to boolean
      setisDarkModeSwitch(isDark);
      document.body.classList.toggle('dark', isDark); // Apply dark mode class if true
    }

    setSelectedDay(storedDay); // Apply the stored first day preference

  }, []);

  // save the preference to localstorage
  useEffect(() => {
    const savePreference = () => {
      if (isDarkModeSwitch || selectedDay !== 'Monday') {
        updatePreference();
        localStorage.setItem('isDarkMode', isDarkModeSwitch);
        localStorage.setItem('firstDay', selectedDay);
      }
    };
    
    // before unload, save the preference
    window.addEventListener('beforeunload', savePreference);
    return () => {
      window.removeEventListener('beforeunload', savePreference);
    }
  }, [isDarkModeSwitch, selectedDay]);


  // Effect to apply dark mode when toggled
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkModeSwitch);
  }, [isDarkModeSwitch]);

  return (
    
    <div className="App">
      <header className = "App-header">
        <ProfileBar userdata={userdata} source={"Preference"}/>
      </header>

      <aside>
        <Sidebar source = "Preference"/>
      </aside>

      <main className ="content setting-content">
        <h1>Preference</h1>
        {/* Dark Mode */}
        <DarkModeToggle/>


        {/* Font size  USE SLIDER */}
        {/* <div className="pref font-size">
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
        </div> */}

        {/* Menu format for table */}
        <div className="pref menu-format">
          <h2>Menu Format</h2>
          {/* which day is the first day */}
          <div className="menu-format-day">
            <label>First Day of the Week</label>
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

        {/* Grocer */}

        <div className="pref grocer">
          <h2>Grocer</h2>
          <p>Coming Soon!</p>
        </div>

      </main>

      <footer>
        <p>Footer</p>
      </footer>

    </div>
  );
}

export default Preference;