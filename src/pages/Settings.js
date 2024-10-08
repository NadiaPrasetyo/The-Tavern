import '../App.css';
import Sidebar from '../components/sidebar.js';
import ProfileBar from '../components/profilebar.js';
import { AiOutlineEdit } from "react-icons/ai";
import React, { useState } from 'react';

/**
 * SETTINGS COMPONENT of the application
 * @param {object} userdata the user data
 * @returns the settings page
 */
function Settings({userdata}) {
  const [isEditable, setIsEditable] = useState({ name: false, email: false }); // State variable for editable fields
  const [message, setMessage] = useState(''); // State variable for message
  const [formValues, setFormValues] = useState({ // State variable for form values
    username: userdata.username || '', // Set the username to the user's username
    name: userdata.name || '', // Set the name to the user's name
    email: userdata.email || '', // Set the email to the user's email
    password: ''  // Password fields should not show the actual password
  });

  /**
   * Function to handle the edit click (make the field editable)
   * @param {string} field 
   */
  const handleEditClick = (field) => { // Function to handle the edit click
    // Mark the field as editable by setting the state variable to true
    setIsEditable({ ...isEditable, [field]: true });
  };

  /**
   * Function to handle the input change
   * @param {Event} e 
   */
  const handleInputChange = (e) => { // Function to handle the input change
    setFormValues({ ...formValues, [e.target.name]: e.target.value }); // Set the form values of the changed field
  };

  /**
   * Function to handle the save click
   * @param {Event} e
   * sends a POST request to the server with the username, name, and email to update the user's information
   */
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
    if (response.status === 200) { // if the response is successful
      setMessage('User information updated successfully');
      userdata.name = formValues.name; // update the user's name
      userdata.email = formValues.email; // update the user's email
    } else {
      setMessage('Error updating user information');
    }

    // Reset all fields to uneditable
    setIsEditable({ name: false, email: false }); 
  };

  // Password handling  
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State variable for showing the password modal
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // State variable for passwords

  /**
   * Function to handle the password change
   * shows the password modal
   */
  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  /**
   * Function to close the password modal
   */
  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  /**
   * Function to handle the password input change
   * @param {Event} e
   * sets the password state variable
   */
  const handlePasswordInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  /**
   * Function to handle the password save
   * @param {Event} e
   * sends a POST request to the server with the username, current password, and new password to change the user's password
   */
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
        username: userdata.username,
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
      setMessage(data.message || 'Error changing password'); // if not successful set the message
    }

  };

  return (

    
    <div className="App">
      <header className="App-header">
        <ProfileBar userdata={userdata} source={"Settings"}/>
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
