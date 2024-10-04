import '../App.css';
import React, { useState } from 'react';


function Landing() {
  // remove everything from localStorage
  const isDarkMode = localStorage.getItem('isDarkMode');
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('isDarkMode', isDarkMode);

  return (
    
    <div className="landingPage">
        <header className = "landingHeader">
            <img src = "Tavern-logo-small.png" alt = "Tavern Logo"/>
            <a className="loginOrRegisterButton" href = "/Login"> Login/Register </a>
        </header>
        <div className="section1">
            SECTION 1
        </div>
        <div className="section2">
            SECTION 2
        </div>
        <div className="section3">
            SECTION 3
        </div>
        <div className="section4">
            SECTION 4
        </div>

        <footer className = "landingFooter">
        
        </footer>

    </div>
  );
}




export default Landing;
