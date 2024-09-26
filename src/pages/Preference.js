import '../App.css';
import Sidebar from '../components/sidebar.js';

import React, { useState, useEffect, useContext } from 'react';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'; // To save the file locally
import ProfileBar from '../components/profilebar.js';

import { VscTriangleDown } from "react-icons/vsc";
import { ThemeContext } from '../components/ThemeContext.js';


function Preference() {
  const [isDarkModeSwitch, setisDarkModeSwitch] = useState(false);
  const [displayOption, setDisplayOptions] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [displayConfirm, setDisplayConfirm] = useState(false);
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
    const username = localStorage.getItem('username');
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

  // Convert JSON data to CSV format
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
  };

  const downloadCSV = (json, name) => {
    const csv = convertToCSV(json);
    const blob = new Blob([csv], { type: 'text/csv' });
    const fileName = name ? `${name}.csv` : 'data.csv';
    saveAs(blob, fileName);  // Use saveAs to trigger download
  };

  const downloadExcel = async (jsonArray, names) => {
    const workbook = new Workbook();
    let count = 0;

    Object.keys(jsonArray).forEach((key, index) => {
      const data = jsonArray[key];
      if (data.length > 0) {
        const sheetName = names ? names[index] : `Sheet${count + 1}`;
        const worksheet = workbook.addWorksheet(sheetName);
        const headers = Object.keys(data[0]);
        worksheet.columns = headers.map(header => ({ header, key: header }));
        data.forEach(item => {
        worksheet.addRow(item);
        });
        count += 1;
      }
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save the Excel file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'data.xlsx');
  };

  const downloadJSON = (data, name) => {
    const jsonString = JSON.stringify(data, null, 2); // Convert data to JSON string with pretty formatting
    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = name ? `${name}.json` : 'data.json';
    saveAs(blob, fileName);
  };

  const fetchData = async (method) => {
    const username = localStorage.getItem('username');
    const response = await fetch(`/api/get-data?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    console.log(data);
    const dataArray = data.data;

    if (method === 'excel') {
      // download data as Excel
      downloadExcel(dataArray, ['groceryList', 'inventory', 'menu', 'favorites']);

    } else if (method === 'csv') {
      // download Grocery List as CSV
      if (dataArray.grocery.length > 0) downloadCSV(dataArray.grocery, 'groceryList');
      // download Inventory as CSV
      if (dataArray.inventory.length > 0) downloadCSV(dataArray.inventory, 'inventory');
      // download Menu as CSV
      if (dataArray.menu.length > 0) downloadCSV(dataArray.menu, 'menu');
      // download Favorites as CSV
      if (dataArray.favorites.length > 0) downloadCSV(dataArray.favorites, 'favorites');

    } else if (method === 'json') {
      // download Grocery List as JSON
      if (dataArray.grocery.length > 0) downloadJSON(dataArray.grocery, 'groceryList');
      // download Inventory as JSON
      if (dataArray.inventory.length > 0) downloadJSON(dataArray.inventory, 'inventory');
      // download Menu as JSON
      if (dataArray.menu.length > 0) downloadJSON(dataArray.menu, 'menu');
      // download Favorites as JSON
      if (dataArray.favorites.length > 0) downloadJSON(dataArray.favorites, 'favorites');
    }
  }

  const deleteAccount = async () => {
    const response = await fetch('/api/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
      }),
    });
    const data = await response.json();
    console.log(data.message);
    
    // redirect to login page
    window.location.href = '/login';
    
  }

  useEffect(() => {
    fetchPreference();
  }, []);
  
  // Toggle dark mode and sync with backend
  const toggleDarkMode = () => {
    setisDarkModeSwitch((prevMode) => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark', newMode);
      localStorage.setItem('isDarkMode', newMode);
  
      // Sync with backend
      updatePreference({ DarkMode: newMode });
  
      return newMode;
    });
  };

  const updatePreference = async () => {
    const username = localStorage.getItem('username');

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

    window.addEventListener('beforeunload', savePreference);
    return () => {
      window.removeEventListener('beforeunload', savePreference);
    }
  }, [isDarkModeSwitch, selectedDay]);

  // before unload, save the preference

  // redirect to /login
  const logout = () => {
    window.location.href = '/login';
  }

  // Effect to apply dark mode when toggled
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkModeSwitch);
  }, [isDarkModeSwitch]);

  return (
    
    <div className="App">
      <header className = "App-header">
        <ProfileBar/>
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


        {/* Download data as excel or comma separated list */}
        <div className="pref download-data">
          <h2>Download Data</h2>
          <button onClick={() => fetchData('excel')}>as Excel</button>
          <button onClick={() => fetchData('csv')}>as CSV</button>
          <button onClick={() => fetchData('json')}>as JSON</button>
        </div>

        {/* Logout */}
        <div className="pref logout">
          <h2>Logout</h2>
          <button onClick={() => logout()}>Logout</button>
        </div>


        {/* Delete account */}
        <div className="pref delete-account">
          <h2>Delete Account</h2>
          <button className='delete-acc' onClick={() => setDisplayConfirm(true)}>Delete Account</button>
        </div>
      </main>

      {/* Password Modal */}
      {displayConfirm && (
        <div className="modal">
          <div className="modal-content delete-popup">
            <h2>Delete Account</h2>
            <p>This is an irreversible change</p>

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
