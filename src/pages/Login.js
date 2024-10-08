import '../App.css';
import React, { useState } from 'react';
import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';

/**
 * LOGIN COMPONENT of the application
 * @returns the login page
 */
function Login() {
  // remove everything from localStorage
  const isDarkMode = localStorage.getItem('isDarkMode');
  // clear the localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  // set the dark mode preference
  localStorage.setItem('isDarkMode', isDarkMode);

  // state to check if the moving cover is on the right side
  const [onRightSide, setOnRightSide] = useState(true);

  return (
    
    <div className="App">

      <main className ="login">
        <div id ="SignIn-container"
        >

          <SignIn />
        </div>
        <div id ="SignUp-container"
        >
            <SignUp />
        </div>
        <div id="moving-cover"
        className={onRightSide ? "active" : ""}
        onMouseEnter={() => setOnRightSide(!onRightSide)}
        onTouchStart={() => setOnRightSide(!onRightSide)}
        >
            <div id="SignIn-cover"
            className={onRightSide ? "active" : ""}
            >
                <img className="tavern-logo" src="/Tavern-logo.png" alt="Tavern Logo" />
                <h1>Sign In</h1>
                <p>Already have an account? Login here</p>
            </div>
            <div id="SignUp-cover"
            className={onRightSide ? "active" : ""}
            >   
                <img className="tavern-logo" src="/Tavern-logo.png" alt="Tavern Logo" />
                <h1>Sign Up</h1>
                <p>Don't have an account? Register here</p>
            </div>
        </div>
      </main>

    </div>
  );
}




export default Login;
