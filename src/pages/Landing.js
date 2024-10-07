import '../App.css';
import React, { useState, useEffect } from 'react';

function Landing() {
  const isDarkMode = localStorage.getItem('isDarkMode');
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('isDarkMode', isDarkMode);

  const [onSection, setOnSection] = useState(0); // Track section index
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  // Update window width state when the window is resized and update the windowSmall state if the window is less than 768px, 
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  const getImageTransform = (imageId, windowSmall) => {
      if (windowSmall){
          switch (onSection) {
            case 0:
              // Default position for section 1
              return 'translate(0px, 0px)';
            case 1:
              // Move images up when in section 2
              switch (imageId) {
                case 'croissant':
                  return 'translate(5vw, -10vw)';
                case 'egg':
                  return 'translate(0vw, -5vw)';
                case 'carrot':
                  return 'translate(5vw, -20vw)';
                case 'soup':
                  return 'translate(-30vw, 13vw)';
                case 'noodle':
                  return 'translate(-30vw, -15vw)';
                case 'cow':
                  return 'translate(-5vw, 10vw)';
                case 'burger':
                  return 'translate(8vw, 80vw)';
                case 'beer':
                  return 'translate(0, -10vw)';
                case 'tomato':
                  return 'translate(0, -2vw)';
                case 'ricebowl':
                  return 'translate(3vw, 0)';
                case 'cake':
                  return 'translate(0, -3vw)';
                case 'spinach':
                  return 'translate(10vw, -1vw)';
                case 'donut':
                  return 'translate(9vw, 3vw)';
                default:
                  return 'translate(0px, 0px)';
              }
            case 2:
              // Move images to the right when in section 3
              switch (imageId) {
                case 'croissant':
                  return 'translate(-10vw, 0)';
                case 'egg':
                  return 'translate(-1vw, -20vw)';
                case 'carrot':
                  return 'translate(20vw, -5vw)';
                case 'soup':
                  return 'translate(-5vw, 10vw)';
                case 'noodle':
                  return 'translate(-10vw, -30vw)';
                case 'cow':
                  return 'translate(0vw, 0vw)';
                case 'burger':
                  return 'translate(-50vw, 0vw)';
                case 'beer':
                  return 'translate(-2vw, -20vw)';
                case 'tomato':
                  return 'translate(10vw, 5vw)';
                case 'ricebowl':
                  return 'translate(30vw, 0vw)';
                case 'cake':
                  return 'translate(-13vw, -10vw)';
                case 'spinach':
                  return 'translate(30vw, 0vw)';
                case 'donut':
                  return 'translate(0vw, -2vw)';
                default:
                  return 'translate(0px, 0px)';
              }
            case 3:
              // Example for section 4 - you can customize it further
              switch (imageId) {
                
                case 'croissant':
                  return 'translate(-3vw, -5vw)';
                case 'egg':
                  return 'translate(0vw, -3vw)';
                case 'carrot':
                  return 'translate(0vw, -20vw)';
                case 'soup':
                  return 'translate(-3vw, 20vw)';
                case 'noodle':
                  return 'translate(-10vw, -15vw)';
                case 'cow':
                  return 'translate(30vw, 5vw)';
                case 'burger':
                  return 'translate(-50vw, 10vw)';
                case 'beer':
                  return 'translate(0vw, -10vw)';
                case 'tomato':
                  return 'translate(0vw, -20vw)';
                case 'ricebowl':
                  return 'translate(10vw, -20vw)';
                case 'cake':
                  return 'translate(0, -5vw)';
                case 'spinach':
                  return 'translate(10vw, -20vw)';
                case 'donut':
                  return 'translate(2vw, -3vw)';
                default:
                  return 'translate(0px, 0px)';
              }
            default:
              return 'translate(0px, 0px)';
          }

      }else{
      switch (onSection) {
        case 0:
          // Default position for section 1
          return 'translate(0px, 0px)';
        case 1:
          // Move images up when in section 2
          switch (imageId) {
            case 'croissant':
              return 'translate(25vw, -1vw)';
            case 'egg':
              return 'translate(30vw, -3vw)';
            case 'carrot':
              return 'translate(45vw, 0)';
            case 'soup':
              return 'translate(7vw, 13vw)';
            case 'noodle':
              return 'translate(10vw, -15vw)';
            case 'cow':
              return 'translate(3vw, 3vw)';
            case 'burger':
              return 'translate(0, 8vw)';
            case 'beer':
              return 'translate(0, -3vw)';
            case 'tomato':
              return 'translate(0, -2vw)';
            case 'ricebowl':
              return 'translate(3vw, 0)';
            case 'cake':
              return 'translate(0, -3vw)';
            case 'spinach':
              return 'translate(0vw, -1vw)';
            case 'donut':
              return 'translate(2vw, 0vw)';
            default:
              return 'translate(0px, 0px)';
          }
        case 2:
          // Move images to the right when in section 3
          switch (imageId) {
            case 'croissant':
              return 'translate(-2vw, 0)';
            case 'egg':
              return 'translate(-1vw, 0)';
            case 'carrot':
              return 'translate(-3vw, 0)';
            case 'soup':
              return 'translate(-5vw, 10vw)';
            case 'noodle':
              return 'translate(0vw, 0vw)';
            case 'cow':
              return 'translate(0vw, 0vw)';
            case 'burger':
              return 'translate(-30vw, -10vw)';
            case 'beer':
              return 'translate(-38vw, -5vw)';
            case 'tomato':
              return 'translate(-40vw, 5vw)';
            case 'ricebowl':
              return 'translate(-20vw, -33vw)';
            case 'cake':
              return 'translate(-13vw, -10vw)';
            case 'spinach':
              return 'translate(0, -24vw)';
            case 'donut':
              return 'translate(-46vw, -2vw)';
            default:
              return 'translate(0px, 0px)';
          }
        case 3:
          // Example for section 4 - you can customize it further
          switch (imageId) {
            
            case 'croissant':
              return 'translate(-3vw, -2vw)';
            case 'egg':
              return 'translate(-1vw, -3vw)';
            case 'carrot':
              return 'translate(-5vw, -5vw)';
            case 'soup':
              return 'translate(-5vw, 13vw)';
            case 'noodle':
              return 'translate(1vw, -1vw)';
            case 'cow':
              return 'translate(-3vw, -1vw)';
            case 'burger':
              return 'translate(-10vw, 13vw)';
            case 'beer':
              return 'translate(-30vw, -5vw)';
            case 'tomato':
              return 'translate(-15vw, -20vw)';
            case 'ricebowl':
              return 'translate(-5vw, 5vw)';
            case 'cake':
              return 'translate(0, -5vw)';
            case 'spinach':
              return 'translate(-3vw, -4vw)';
            case 'donut':
              return 'translate(2vw, -3vw)';
            default:
              return 'translate(0px, 0px)';
          }
        default:
          return 'translate(0px, 0px)';
        }
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
            // Move the image based on the active section and width of the window
            transform: getImageTransform('croissant', windowWidth < 768),
            transition: 'transform 0.5s ease', // Smooth transition
          }}
        />
        <img
          id="egg"
          className="artifactImage"
          src="food-pics/17.jpg"
          alt="egg"
          style={{
            transform: getImageTransform('egg', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="carrot"
          className="artifactImage"
          src="food-pics/18.jpg"
          alt="carrot"
          style={{
            transform: getImageTransform('carrot', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="soup"
          className="artifactImage"
          src="food-pics/19.jpg"
          alt="soup"
          style={{
            transform: getImageTransform('soup', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="noodle"
          className="artifactImage"
          src="food-pics/20.jpg"
          alt="noodle"
          style={{
            transform: getImageTransform('noodle', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="cow"
          className="artifactImage"
          src="food-pics/21.jpg"
          alt="cow"
          style={{
            transform: getImageTransform('cow', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="burger"
          className="artifactImage"
          src="food-pics/22.jpg"
          alt="burger"
          style={{
            transform: getImageTransform('burger', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="beer"
          className="artifactImage"
          src="food-pics/23.jpg"
          alt="beer"
          style={{
            transform: getImageTransform('beer', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="tomato"
          className="artifactImage"
          src="food-pics/24.jpg"
          alt="tomato"
          style={{
            transform: getImageTransform('tomato', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="ricebowl"
          className="artifactImage"
          src="food-pics/25.jpg"
          alt="ricebowl"
          style={{
            transform: getImageTransform('ricebowl', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="cake"
          className="artifactImage"
          src="food-pics/26.jpg"
          alt="cake"
          style={{
            transform: getImageTransform('cake', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="spinach"
          className="artifactImage"
          src="food-pics/27.jpg"
          alt="spinach"
          style={{
            transform: getImageTransform('spinach', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
        <img
          id="donut"
          className="artifactImage"
          src="food-pics/28.jpg"
          alt="donut"
          style={{
            transform : getImageTransform('donut', windowWidth < 768),
            transition: 'transform 0.5s ease',
          }}
        />
      </span>

      <div className="section section1">
        <img src="Tavern-banner.png" alt="Tavern Logo" />
        <div className="glassyContainer">
          <h1>WELCOME! </h1> 
          <p>Plan the Feast, Enjoy the Rest</p>
        </div>
      </div>
      <div className="section section2">
        <div className="glassyContainer">
          <p>Welcome to <span class="highlight">The Tavern</span>, the ultimate free meal planning platform that puts sustainability and simplicity first!</p>
          <h3>Inventory Management</h3>
          <p>Know exactly what you have at home! Our inventory tool keeps track of the ingredients in your kitchen, so you can plan meals that use what's already on hand, reducing waste and saving time.</p>

          <h3>Integrated Grocery List</h3>
          <p>Generate a shopping list based on your weekly meal plan, using what you already have.</p>

          <h3>Weekly Menu Planner</h3>
          <p>Organize your meals for the week with our simple drag-and-drop planner. Prioritize recipes that use your existing inventory to make the most out of what's in your pantry.</p>

          <h3>Recipe Inspiration Library</h3>
          <p>Need some fresh ideas? Browse our collection of various, easy-to-make recipes.</p>
        </div>
      </div>
      <div className="section section3">
        <div className="glassyContainer"><h3>Sustainable Choices</h3>
        <p>Our platform emphasizes meals that make the most of what's already in your kitchen. By <strong>reducing food waste </strong> and promoting seasonal, low-impact ingredients, <span class="highlight">The Tavern</span> helps you make choices that are good for both your table and the planet.</p>

        <h3>Smart Grocery Shopping</h3>
        <p>Because we focus on using what you already own, <span class="highlight">The Tavern</span> saves you from buying unnecessary ingredients. Shop smarter, not harder, and enjoy more efficient, stress-free grocery trips.</p>

        <h3>Effortless Meal Prep</h3>
        <p>With our integrated tools, meal planning has never been easier. Simply manage your inventory, plan your meals, generate your shopping list, and enjoy your cooking time—stress-free.</p>

        <h3>Completely Free</h3>
        <p><span class="highlight">The Tavern</span> is free to use—no subscriptions, no hidden costs. We believe in making meal planning accessible to everyone.</p>

        </div>
      </div>
      <div className="section section4">
        <div className="glassyContainer">
        <h2>Plan the Feast, Enjoy the Rest</h2>
        <p>At <span class="highlight">The Tavern</span>, meal planning is easy, sustainable, and enjoyable. Let us help you manage your inventory, plan your week, create efficient grocery lists, and explore new recipes—all in one place.</p>

        <p><strong>Ready to get started? Plant the feast, enjoy the rest, and make every meal a celebration with <span class="highlight">The Tavern</span>!</strong></p>
        </div>
      </div>

      <footer className="landingFooter">
      </footer>
    </div>
  );
}

export default Landing;
