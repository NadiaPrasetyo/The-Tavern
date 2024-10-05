import { on } from 'nodemailer/lib/xoauth2';
import '../App.css';
import React, { useState } from 'react';


function Landing() {
  // remove everything from localStorage
  const isDarkMode = localStorage.getItem('isDarkMode');
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('isDarkMode', isDarkMode);

  const [onSection, setOnSection] = useState("section1");

  return (
    
    <div className="landingPage">
        <header className = "landingHeader">
            <img src = "Tavern-logo-small.png" alt = "Tavern Logo"/>
            <a className="loginOrRegisterButton" href = "/Login"> Login/Register </a>
        </header>

        <span className="artifactContainer">
            <img className= {onSection} id="croissant" src="food-pics/16.jpg" alt="croissant" />
            <img className= {onSection} id="egg" src="food-pics/17.jpg" alt="egg" />
            <img className= {onSection} id="carrot" src="food-pics/18.jpg" alt="carrot" />
            <img className= {onSection} id="soup" src="food-pics/19.jpg" alt="soup" />
            <img className= {onSection} id="noodle" src="food-pics/20.jpg" alt="noodle" />
            <img className= {onSection} id="cow" src="food-pics/21.jpg" alt="cow" />
            <img className= {onSection} id="burger" src="food-pics/22.jpg" alt="burger" />
            <img className= {onSection} id="beer" src="food-pics/23.jpg" alt="beer" />
            <img className= {onSection} id="tomato" src="food-pics/24.jpg" alt="tomato" />
            <img className= {onSection} id="ricebowl" src="food-pics/25.jpg" alt="ricebowl" />
            <img className= {onSection} id="cake" src="food-pics/26.jpg" alt="cake" />
            <img className= {onSection} id="spinach" src="food-pics/27.jpg" alt="spinach" />
            <img className= {onSection} id="donut" src="food-pics/28.jpg" alt="donut" />
        </span>

        <div className="section1">   
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
