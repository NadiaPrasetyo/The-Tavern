import '../App.css';
import React, { useState } from 'react';

import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';

const isDarkMode = false;//default to false


function Login() {
  // remove everything from localStorage
  localStorage.clear();

  const [onRightSide, setOnRightSide] = useState(true);

  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'white';
    });
  }
  else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'black';
    });
  }

  return (
    
    <div className="App">

      <main className ="login">
        <div id ="SignIn-container"
        onMouseEnter={() => setOnRightSide(true)}
        >

          <SignIn />
        </div>
        <div id ="SignUp-container"
        onMouseEnter={() => setOnRightSide(false)}
        >
            <SignUp />
        </div>
        <div id="moving-cover"
        className={onRightSide ? "active" : ""}
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
