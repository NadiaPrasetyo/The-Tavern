import React, { useState } from 'react';

function SignUp() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the username and raw password to the server
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        name,
        email,
        password,
        confirmPassword,
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
    <div id = "SignUp-component">
        <form onSubmit={handleSubmit}>
            <ul>
                <li>
                    <h2 className = "form-title">Register</h2>
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
                    <label>Name:</label><br/>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </li>
                <li>
                    <label>Email:</label><br/>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <label>Confirm Password:</label><br/>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </li>
                <li>
                    <button type="submit">Sign Up</button>
                </li>
            </ul>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;
