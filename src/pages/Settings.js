import '../App.css';
import Sidebar from '../components/sidebar.js';
import ProfileBar from '../components/profilebar.js';
import { AiOutlineEdit } from "react-icons/ai";
import React, { useState } from 'react';

function Settings({userdata}) {
  const [isEditable, setIsEditable] = useState({ name: false, email: false });
  const [message, setMessage] = useState('');
  const [formValues, setFormValues] = useState({
    username: userdata.username || '',
    name: userdata.name || '',
    email: userdata.email || '',
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
    // connect to the server to update the user's information
    const response = await fetch('/api/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userdata.username,
        name: formValues.name,
        email: formValues.email,
      }),
    });
    if (response.status === 200) {
      setMessage('User information updated successfully');
      userdata.name = formValues.name;
      userdata.email = formValues.email;
    } else {
      setMessage('Error updating user information');
    }

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

  return (

    
    <div className="App">
      <header className="App-header">
        <ProfileBar userdata={userdata}/>
      </header>

      <aside>
        <Sidebar source="Settings" />
      </aside>

      <main className="content setting-content">
        {/* Userame Section */}
        <div className="setting-item">
          <h2>USERNAME</h2>
          <div className="input-wrapper">
            <input className="setting-input"
              type="text"
              name="username"
              value={formValues.username}
              disabled={true}
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
              value="••••••••"
              disabled={true}
            />
            <AiOutlineEdit className="edit-icon" onClick={handlePasswordChange} />
          </div>
        </div>

        <button className='save-setting' onClick={handleSave}>SAVE</button>
      </main>

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
