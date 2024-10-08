import React, { useState } from 'react';

/**
 * SIGN UP COMPONENT of the application
 * @returns the sign up page
 */
function SignUp() {
  const [username, setUsername] = useState(''); // State variable for username
  const [name, setName] = useState(''); // State variable for name
  const [email, setEmail] = useState(''); // State variable for email
  const [password, setPassword] = useState(''); // State variable for password
  const [confirmPassword, setConfirmPassword] = useState(''); // State variable for confirm password
  const [message, setMessage] = useState(''); // State variable for message

  /**
   * Function to handle the submit of the form
   * @param {object} e the event object
   * sends a POST request to the server with the username, name, email, password, and confirm password
   * if the response is successful, sets the message to "Register successful" and sets the token in session storage
   * if the response is unsuccessful, sets the message to the response message or "Error logging in"
   * redirects to the home page
   */
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
      setMessage('Register successful'); // Set the message
      sessionStorage.setItem('token', data.token); // Set the token in session storage

      localStorage.setItem('firstDay', 'Monday'); // Set the first day preference to Monday
      localStorage.setItem('isDarkMode', false); // Set the dark mode preference to false
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
