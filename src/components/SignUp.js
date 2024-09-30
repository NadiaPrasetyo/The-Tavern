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

    if (response.statusCode === 200) {
      setMessage('Register successful');
      sessionStorage.setItem('token', data.token);

      localStorage.setItem('firstDay', 'Monday');
      localStorage.setItem('isDarkMode', false);
      // Redirect to the home page
      window.location.href = '/home';
    } else {
      setMessage(data.message || 'Error logging in');
    }
  };

  return (
    <div id = "SignUp-component">
        <form className="login-form" onSubmit={handleSubmit}>
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
                <li>
                    {message && <p>{message}</p>}
                </li>
            </ul>
      </form>
    </div>
  );
}

export default SignUp;
