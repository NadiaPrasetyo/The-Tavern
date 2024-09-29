import React, { useState } from 'react';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage('Login successful');
      sessionStorage.setItem('token', data.token);
    } else {
      setMessage(data.message || 'Error logging in');
      return;
    }

    // get preferences and add to local storage
    const response2 = await fetch(`/api/get-preference?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data2 = await response2.json();
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
    window.location.href = '/home';

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
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>Password:</label><br/>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <button type="submit">Sign In</button>
          </li>
          <li>
            {message && <p>{message}</p>}
          </li>
        </ul>
      </form>
    </div>
  );
}

export default SignIn;
