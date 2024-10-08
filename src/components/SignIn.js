import React, { useState } from 'react';

/**
 * SIGN IN COMPONENT of the application
 * @returns the sign in page
 */
function SignIn() {
  const [username, setUsername] = useState(''); // State variable for username
  const [password, setPassword] = useState(''); // State variable for password
  const [message, setMessage] = useState(''); // State variable for message
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(''); // State variable for forgot password message
  const [displyPopUp, setDisplayPopUp] = useState(false); // State variable for displaying forgot password pop up

  /**
   * Function to handle the submit of the form
   * @param {object} e the event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form action

    // Send the username and raw password to the server
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) { // Successful login
      setMessage('Login successful! Redirecting to home page...'); // Set the message
      sessionStorage.setItem('token', data.token); // Set the token in session storage
    } else {
      setMessage(data.message || 'Error logging in');
      return;
    }

    // get preferences and add to local storage
    console.log("fetching preferences");
    const response2 = await fetch(`/api/get-preference?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data2 = await response2.json();
    console.log(data2);
    if (data2.preferences.DarkMode) { // if dark mode preference exists
      localStorage.setItem('isDarkMode', data2.preferences.DarkMode); // set the dark mode preference
    } else {
      localStorage.setItem('isDarkMode', false); // if not set the dark mode preference to false
    }
    if (data2.preferences.FirstDay) { // if first day preference exists
      localStorage.setItem('firstDay', data2.preferences.FirstDay); // set the first day preference
    } else {
      localStorage.setItem('firstDay', 'Monday'); // if not set the first day preference to Monday
    }
    // Redirect to the home page
    window.location.href = '/home'; // Redirect to the home page

  };

  /**
   * Function to handle the forgot password
   * set the forgot password message
   */
  const forgotPassword = async() => {
    if (username === '') { // if username is empty set the message
      setMessage('Enter a username');
      return;
    }
    setForgotPasswordMessage('Sending password reset email...'); // set the message
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const data = await response.json();
      if (response.status === 200) { // if successful
        setForgotPasswordMessage('Password reset email sent');
        setTimeout(() => { // close the pop up after 3 seconds
          setDisplayPopUp(false);
        }, 3000);
      } else {
        setForgotPasswordMessage(data.message || 'Error resetting password'); // if not successful set the message
      }
    } catch (error) {
      setForgotPasswordMessage('Error resetting password');
    }
  };

  return (
    <div id = "SignIn-component">
      <form className='login-form' onSubmit={handleSubmit}>
        <ul>
          <li>
            <h2 className = "form-title">Login</h2>

          </li>
          <li>
            <label>Username:</label><br/>
            <input
              type="text"
              value={username}
              placeholder='Enter username case sensitive'
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>Password:</label><br/>
            <input
              type="password"
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <button type="submit">Sign In</button><br/>
            <a onClick={() => setDisplayPopUp(true)}>Forgot password</a>
            {message && <p>{message}</p>}
          </li>
        </ul>
      </form>

      {/* pop up for confirm forgot password */}
      {displyPopUp && (
        <div className="modal">
          <div className="modal-content forget-password">
            <h2>Forgot Password</h2>
            <p>Enter your username to reset your password</p>
            <input type="text" placeholder="username (case sensitive)" onChange={(e) => setUsername(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={() => setDisplayPopUp(false)}>Cancel</button>
              <button onClick={forgotPassword}>Reset Password</button>
            </div>
            {forgotPasswordMessage && <p>{forgotPasswordMessage}</p>}
          </div>
        </div>
      )  
      }
    </div>
  );
}

export default SignIn;
