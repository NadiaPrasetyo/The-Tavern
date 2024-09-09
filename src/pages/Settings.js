import '../App.css';
import Sidebar from '../components/sidebar.js';
import ProfileBar from '../components/profilebar.js';
import { AiOutlineEdit } from "react-icons/ai";
import React, { useState } from 'react';

const isDarkMode = false;//default to false

function Settings() {
  const [isEditable, setIsEditable] = useState({ username: false, name: false, email: false, password: false });
  const [message, setMessage] = useState('');
  const [formValues, setFormValues] = useState({
    username: localStorage.getItem('username') || '',
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
    password: ''  // Password fields should not show the actual password
  });

  const handleEditClick = (field) => {
    // Mark the field as editable
    setIsEditable({ ...isEditable, [field]: true });
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    // if name and email are not edited, do not send a request to the server
    if (!isEditable.name && !isEditable.email) {
      return;
    }

    e.preventDefault();
    // Change the values in local storage if they were edited
    if (isEditable.name) {
      localStorage.setItem('name', formValues.name);
      // reload the page to update the name in the profile bar
      window.location.reload();
    }
    if (isEditable.email) {
      localStorage.setItem('email', formValues.email);
    }
    // connect to the server to update the user's information
    const response = await fetch('/api/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        name: formValues.name,
        email: formValues.email,
      }),
    });

    // Reset all fields to uneditable
    setIsEditable({ username: false, name: false, email: false, password: false });
  };

  // Password handling
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePasswordInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async(e) => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    e.preventDefault();

    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // remove message
      setMessage('Password changed successfully');
      // close modal
      closePasswordModal();

    } else {
      setMessage(data.message || 'Error changing password');
    }

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

      <main className="setting-content">
        {/* Userame Section */}
        <div className="setting-item">
          <h2>USERNAME</h2>
          <div className="input-wrapper">
            <input className="setting-input"
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              disabled={!isEditable.username}
            />
          </div>
        </div>

        {/* Name Section */}
        <div className="setting-item">
          <h2>NAME</h2>
          <div className="input-wrapper">
            <input className="setting-input"
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              disabled={!isEditable.name}
            />
            <AiOutlineEdit className="edit-icon" onClick={() => handleEditClick('name')} />
          </div>
        </div>

        {/* Email Section */}
        <div className="setting-item">
          <h2>EMAIL</h2>
          <div className="input-wrapper">
            <input className="setting-input"
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
            <input className="setting-input"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleInputChange}
              disabled={!isEditable.password}
            />
            <AiOutlineEdit className="edit-icon" onClick={handlePasswordChange} />
          </div>
        </div>

        <button className='save-setting' onClick={handleSave}>SAVE</button>
      </main>

      <footer>
        <p>Footer</p>
      </footer>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Password</h2>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={passwords.currentPassword}
              onChange={handlePasswordInputChange}
            /><br />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={passwords.newPassword}
              onChange={handlePasswordInputChange}
            /><br />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={passwords.confirmNewPassword}
              onChange={handlePasswordInputChange}
            /><br />
            {message && <p className='message-form'>{message}</p>}

            <div className="modal-buttons">
              <button onClick={closePasswordModal}>Cancel</button>
              <button onClick={handlePasswordSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Settings;
