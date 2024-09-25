import '../App.css';
import Sidebar from '../components/sidebar.js';

import React, { useState, useEffect } from 'react';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'; // To save the file locally
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
    if (data.preferences.DarkMode) {
      setIsDarkMode(data.preferences.DarkMode);
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

    Object.keys(jsonArray).forEach((key, index) => {
      const sheetName = names ? names[index] : `Sheet${index + 1}`;
      const worksheet = workbook.addWorksheet(sheetName);
      const data = jsonArray[key];
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(header => ({ header, key: header }));
      data.forEach(item => {
      worksheet.addRow(item);
      });
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save the Excel file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'data.xlsx');
  };

  const downloadJSON = (data, name) => {
    console.log(data);
    const jsonString = JSON.stringify(data, null, 2); // Convert data to JSON string with pretty formatting
    console.log(jsonString);
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
      downloadCSV(dataArray.grocery, 'groceryList');
      // download Inventory as CSV
      downloadCSV(dataArray.inventory, 'inventory');
      // download Menu as CSV
      downloadCSV(dataArray.menu, 'menu');
      // download Favorites as CSV
      downloadCSV(dataArray.favorites, 'favorites');

    } else if (method === 'json') {
      // download Grocery List as JSON
      downloadJSON(dataArray.grocery, 'groceryList');
      // download Inventory as JSON
      downloadJSON(dataArray.inventory, 'inventory');
      // download Menu as JSON
      downloadJSON(dataArray.menu, 'menu');
      // download Favorites as JSON
      downloadJSON(dataArray.favorites, 'favorites');
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

  const updatePreference = async () => {
    const username = localStorage.getItem('username');

    const preference = {};
    if (isDarkMode) {
      preference.DarkMode = isDarkMode;
    }
    if (selectedDay !== 'Monday') {
      preference.FirstDay = selectedDay;
    }

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
    console.log(data);
  };

  useEffect(() => {
    const savePreference = () => {
      if (isDarkMode || selectedDay !== 'Monday') {
        updatePreference();
        localStorage.setItem('isDarkMode', isDarkMode);
        localStorage.setItem('firstDay', selectedDay);
      }
    };

    window.addEventListener('beforeunload', savePreference);
    return () => {
      window.removeEventListener('beforeunload', savePreference);
    }
  }, [isDarkMode, selectedDay]);


  // before unload, save the preference

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
          <button onClick={() => fetchData('excel')}>as Excel</button>
          <button onClick={() => fetchData('csv')}>as CSV</button>
          <button onClick={() => fetchData('json')}>as JSON</button>
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
