import React, { useState } from 'react';
import argon2 from 'argon2-browser';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password using argon2
    const hashedPassword = await argon2.hash({
      pass: password,
      salt: 'somesalt', // A salt is required
      time: 2,
    });

    // Send the username and hashed password to the server
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password: hashedPassword.encoded, // Send the hashed password
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
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignIn;
