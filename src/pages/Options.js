import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState } from 'react';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'; // To save the file locally
import ProfileBar from '../components/profilebar.js';

function Options({userdata}) {
  const [displayConfirm, setDisplayConfirm] = useState(false);
  // redirect to /login
  const logout = () => {
    window.location.href = '/login';
  }

  const deleteAccount = async () => {
    const response = await fetch('/api/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userdata.username,
      }),
    });
    const data = await response.json();
    console.log(data.message);
    
    // redirect to login page
    window.location.href = '/login';
    
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
    const username = userdata.username;
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

  return (
    
    <div className="App">
      <header class = "App-header">
        <ProfileBar userdata={userdata} source={"Options"}/>
      </header>

      <aside>
        <Sidebar source = "Options"/>
      </aside>

      <main className ="content setting-content">
        <h1>Options</h1>

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

        {/* Contact us */}


        {/* Help */}


        {/* FAQ */}

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




export default Options;
