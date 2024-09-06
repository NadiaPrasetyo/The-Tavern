import '../App.css';
import React from 'react';

import SignIn from '../components/SignIn.js';

const isDarkMode = false;//default to false


function Login() {
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
      <header class = "App-header">
      </header>

      <main className ="content">
        <div idName ="SignIn-container">
          <SignIn />
        </div>
      </main>

    </div>
  );
}




export default Login;
