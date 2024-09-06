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
    } else {
      setMessage(data.message || 'Error logging in');
    }
  };

  return (
    <div id = "SignIn-component">
      <form onSubmit={handleSubmit}>
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
        </ul>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignIn;
