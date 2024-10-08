import React, { useState } from 'react';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [displyPopUp, setDisplayPopUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (response.status === 200) {
      setMessage('Login successful! Redirecting to home page...');
      sessionStorage.setItem('token', data.token);
      console.log("logging in correctly, continuing to preferences");
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
    if (data2.preferences.DarkMode) {
      localStorage.setItem('isDarkMode', data2.preferences.DarkMode);
    } else {
      localStorage.setItem('isDarkMode', false);
    }
    if (data2.preferences.FirstDay) {
      localStorage.setItem('firstDay', data2.preferences.FirstDay);
    } else {
      localStorage.setItem('firstDay', 'Monday');
    }
    // Redirect to the home page
    console.log("redirecting to home");
    window.location.href = '/home';

  };

  const forgotPassword = async() => {
    if (username === '') {
      setMessage('Enter a username');
      return;
    }
    setForgotPasswordMessage('Sending password reset email...');
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
      if (response.status === 200) {
        setForgotPasswordMessage('Password reset email sent');
        setTimeout(() => {
          setDisplayPopUp(false);
        }, 3000);
      } else {
        setForgotPasswordMessage(data.message || 'Error resetting password');
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
