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
            <img id="croissant" src="food-pics\16.jpg" alt="croissant" />
            <img id="egg" src="food-pics\17.jpg" alt="egg" />
            <img id="carrot" src="food-pics\18.jpg" alt="carrot" />
            <img id="soup" src="food-pics\19.jpg" alt="soup" />
            <img id="noodle" src="food-pics\20.jpg" alt="noodle" />
            <img id="cow" src="food-pics\21.jpg" alt="cow" />
            <img id="burger" src="food-pics\22.jpg" alt="burger" />
            <img id="beer" src="food-pics\23.jpg" alt="beer" />
            <img id="tomato" src="food-pics\24.jpg" alt="tomato" />
            <img id="ricebowl" src="food-pics\25.jpg" alt="ricebowl" />
            <img id="cake" src="food-pics\26.jpg" alt="cake" />
            <img id="spinach" src="food-pics\27.jpg" alt="spinach" />
            <img id="donut" src="food-pics\28.jpg" alt="donut" />
        </div>
        <div className="section2">
        </div>
        <div className="section3">
        </div>
        <div className="section4">
        </div>

        <footer className = "landingFooter">
        
        </footer>

    </div>
  );
}




export default Landing;
