import '../App.css';
import React, { useState, useEffect } from 'react';

function Landing() {
  const isDarkMode = localStorage.getItem('isDarkMode');
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('isDarkMode', isDarkMode);

  const [onSection, setOnSection] = useState(0); // Track section index

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionContent = entry.target.querySelector('.glassyContainer');
        if (sectionContent) { // Check if glassyContainer exists
          if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target);
            setOnSection(index); // Set the index of the active section

            // Add the 'fade-in' class and remove 'fade-out'
            sectionContent.classList.add('fade-in');
            sectionContent.classList.remove('fade-out');
          } else {
            // Remove the 'fade-in' class and add 'fade-out'
            sectionContent.classList.remove('fade-in');
            sectionContent.classList.add('fade-out');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Movement styles based on the active section
  const getImageTransform = (imageId) => {
    switch (onSection) {
      case 0:
        // Default position for section 1
        return 'translate(0px, 0px)';
      case 1:
        // Move images up when in section 2
        switch (imageId) {
          case 'croissant':
            return 'translate(0px, -50px)';
          case 'egg':
            return 'translate(0px, -30px)';
          case 'carrot':
            return 'translate(0px, -70px)';
          // Add more cases for other images if needed
          default:
            return 'translate(0px, 0px)';
        }
      case 2:
        // Move images to the right when in section 3
        switch (imageId) {
          case 'croissant':
            return 'translate(50px, 0px)';
          case 'egg':
            return 'translate(30px, 0px)';
          case 'carrot':
            return 'translate(70px, 0px)';
          // Add more cases for other images if needed
          default:
            return 'translate(0px, 0px)';
        }
      case 3:
        // Example for section 4 - you can customize it further
        return 'translate(0px, 50px)';
      default:
        return 'translate(0px, 0px)';
    }
  };

  return (
    <div className="landingPage">
      <header className="landingHeader">
        <img src="Tavern-logo-small.png" alt="Tavern Logo" />
        <a className="loginOrRegisterButton" href="/Login"> Login/Register </a>
      </header>

      <span className="artifactContainer">
        <img
          id="croissant"
          className="artifactImage"
          src="food-pics/16.jpg"
          alt="croissant"
          style={{
            transform: getImageTransform('croissant'),
            transition: 'transform 0.5s ease', // Smooth transition
          }}
        />
        <img
          id="egg"
          className="artifactImage"
          src="food-pics/17.jpg"
          alt="egg"
          style={{
            transform: getImageTransform('egg'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="carrot"
          className="artifactImage"
          src="food-pics/18.jpg"
          alt="carrot"
          style={{
            transform: getImageTransform('carrot'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="soup"
          className="artifactImage"
          src="food-pics/19.jpg"
          alt="soup"
          style={{
            transform: getImageTransform('soup'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="noodle"
          className="artifactImage"
          src="food-pics/20.jpg"
          alt="noodle"
          style={{
            transform: getImageTransform('noodle'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="cow"
          className="artifactImage"
          src="food-pics/21.jpg"
          alt="cow"
          style={{
            transform: getImageTransform('cow'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="burger"
          className="artifactImage"
          src="food-pics/22.jpg"
          alt="burger"
          style={{
            transform: getImageTransform('burger'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="beer"
          className="artifactImage"
          src="food-pics/23.jpg"
          alt="beer"
          style={{
            transform: getImageTransform('beer'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="tomato"
          className="artifactImage"
          src="food-pics/24.jpg"
          alt="tomato"
          style={{
            transform: getImageTransform('tomato'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="ricebowl"
          className="artifactImage"
          src="food-pics/25.jpg"
          alt="ricebowl"
          style={{
            transform: getImageTransform('ricebowl'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="cake"
          className="artifactImage"
          src="food-pics/26.jpg"
          alt="cake"
          style={{
            transform: getImageTransform('cake'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="spinach"
          className="artifactImage"
          src="food-pics/27.jpg"
          alt="spinach"
          style={{
            transform: getImageTransform('spinach'),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="donut"
          className="artifactImage"
          src="food-pics/28.jpg"
          alt="donut"
          style={{
            transform : getImageTransform('donut'),
            transition: 'transform 0.5s ease',
          }}
        />
      </span>

      <div className="section section1">
        <img src="Tavern-banner.png" alt="Tavern Logo" />
        <div className="glassyContainer">
          <h1>WELCOME!</h1>
          <h2>"Plan the Feast, Enjoy the Rest”</h2>
        </div>
      </div>
      <div className="section section2">
        <div className="glassyContainer">
        </div>
      </div>
      <div className="section section3">
        <div className="glassyContainer">
        </div>
      </div>
      <div className="section section4">
        <div className="glassyContainer">
        </div>
      </div>

      <footer className="landingFooter">
      </footer>
    </div>
  );
}

export default Landing;
