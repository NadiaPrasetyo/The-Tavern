import '../App.css';
import Sidebar from '../components/sidebar.js';
import ProfileBar from '../components/profilebar.js';
import { AiOutlineEdit } from "react-icons/ai";
import React, { useState } from 'react';

const isDarkMode = false;//default to false

function Settings() {
  const [isEditable, setIsEditable] = useState({ username: false, email: false, password: false });
  const [formValues, setFormValues] = useState({
    username: localStorage.getItem('username') || '',
    email: 'user@example.com',  // Replace with actual email data
    password: ''  // Password fields should not show the actual password
  });

  const handleEditClick = (field) => {
    // Mark the field as editable
    setIsEditable({ ...isEditable, [field]: true });
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save logic here (e.g., make API call, save to localStorage, etc.)
    // Reset all fields to uneditable
    setIsEditable({ username: false, email: false, password: false });
  };

  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'white';
    });
  } else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'black';
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <ProfileBar />
      </header>

      <aside>
        <Sidebar source="Settings" />
      </aside>

      <main className="content">
        {/* Username Section */}
        <div className="setting-item">
          <h2>USERNAME</h2>
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              disabled={!isEditable.username}
            />
            <AiOutlineEdit className="edit-icon" onClick={() => handleEditClick('username')} />
          </div>
        </div>

        {/* Email Section */}
        <div className="setting-item">
          <h2>EMAIL</h2>
          <div className="input-wrapper">
            <input
              type="text"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              disabled={!isEditable.email}
            />
            <AiOutlineEdit className="edit-icon" onClick={() => handleEditClick('email')} />
          </div>
        </div>

        {/* Password Section */}
        <div className="setting-item">
          <h2>CHANGE PASSWORD</h2>
          <div className="input-wrapper">
            <input
              type="password"
              name="password"
              placeholder="New password"
              onChange={handleInputChange}
              disabled={!isEditable.password}
            />
            <AiOutlineEdit className="edit-icon" onClick={() => handleEditClick('password')} />
          </div>
        </div>

        <button onClick={handleSave}>SAVE</button>
      </main>

      <footer>
        <p>Footer</p>
      </footer>
    </div>
  );
}

export default Settings;
