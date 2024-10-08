import '../App.css';
import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Donate } from 'react-kofi-overlay'

function Tutorial() {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    const isSmallScreen = window.matchMedia('(max-width: 480px)').matches;

    const FAQ = [
        {
            question: 'Q: How do I change my password?',
            answer: 'A: You can change your password by going to the Settings page.'
        },
        {
            question: 'Q: How do I change my username?',
            answer: 'A: You cannot change your username as it is your unique identifier.'
        },
        {
            question: 'Q: How do I change my email?',
            answer: 'A: You can change your email by going to the Settings page.'
        },
        {
            question: 'Q: How do I change to dark mode?',
            answer: 'A: You can change to dark mode by going to the Preferences page.'
        },
        {
            question: 'Q: How do I change the first day of the week?',
            answer: 'A: You can change the first day of the week by going to the Preferences page.'
        },
        {
            question: 'Q: How do I report a bug?',
            answer: 'A: You can report a bug by clicking on the "Report Bug" button below.'
        },
        {
            question: 'Q: How do I support the developers?',
            answer: 'A: You can support the developers by donating on Ko-fi. The link is below.'
        },
        {
            question: 'Q: How do I contact the developers?',
            answer: 'A: You can contact the developers by emailing us at thetavern.dev@gmail.com'
        },
        {
            question: 'Q: How do I delete my account?',
            answer: 'A: You can delete your account by going to the Options page.'
        },
        {
            question: 'Q: How do I log out?',
            answer: 'A: You can log out by clicking the hamburger menu on the top right or you can go to the Options page.'
        },
        {
            question: 'Q: How do I change my displayed name?',
            answer: 'A: You can change your displayed name by going to the Settings page.'
        },
    ];

    const Tutorial = [
        // Home Questions
        {
            question: 'How do I change the recipe viewed in the Home page?',
            answer: 'You can change the recipe viewed in the Home page by clicking on the recipe name on the today menu (if you don\'t have any, it\'ll be random).'
        },
        {
            question: 'Can I change the menu displayed in the today menu section?',
            answer: 'Yes, by changing the recipes for the day in the Weekly Menu page, the today menu will update accordingly. Or you can click on the day in the calendar to view the menu for that day.'
        },
        {
            question: 'How can I add items to the fruits vegetable display in the Home page?',
            answer: 'You can add items to the fruits vegetable display by going to the Inventory page and adding items to the "Fruits" and "Vegetables" category (if you don\'t have these categories, you can add them by clicking the add Category button at the bottom of the page).'
        },
        {
            question: 'What is the grocery list in the home page for?',
            answer: 'The grocery list in the home page is a quick view of the last 5 items added to the grocery list, it gives you a quick access to the grocery and if you want to add those items to the inventory. You can view the full grocery list and functionality by going to the Grocery List page.'
        },
        {
            question: 'How do I add items to the grocery list in the home page?',
            answer: 'You can add items to the grocery list in the home page by clicking on the plus (+) button on the grocery list, type in the item you want to add, and click the plus (+) button again.'
        },
        {
            question: 'How do I remove items from the grocery list in the home page?',
            answer: 'Unfortunately, you cannot remove items from the grocery list in the home page, you can only cross them out or remove and add to inventory in the home page. If you want to fully remove items from the grocery list without adding to the inventory, you can go to the Grocery List page.'
        },
        {
            question: 'Why is the recipe viewer not showing the recipe?',
            answer: 'Unfortunately, some recipes may not be available for viewing due to the blocking of iframes from the website. You can click the link provided to view the recipe on the website in a new page.'
        },
        // Inventory Questions
        {
            question: 'How do I add items to the inventory?',
            answer: 'You can add items to the inventory by going to the Inventory page, clicking the plus (+) button, typing in the item you want to add, and clicking the plus (+) button again.'
        },
        {
            question: 'How do I remove items from the inventory?',
            answer: 'You can remove items from the inventory by moving your mouse to the item you want to remove, when the item is has a line through it, that indicates that it will be removed once clicked.'
        },
        {
            question: 'How do I add categories to the inventory?',
            answer: 'You can add categories to the inventory by clicking the add Category button at the bottom of the page, typing in the category you want to add, and clicking the plus (+) button.'
        },
        {
            question: 'How do I cancel adding a category to the inventory?',
            answer: 'You can cancel adding a category to the inventory by clicking the add Category button at the bottom of the page again.'
        },
        {
            question: 'How do I remove categories from the inventory?',
            answer: 'You can remove categories from the inventory by removing all items from the category, then the category will be removed automatically.'
        },
        {
            question: 'How do I add items to the grocery list from the inventory?',
            answer: 'You can add items to the grocery list from the inventory by moving your mouse to the item you want to add, when the item shows the add to grocery option, that indicates that it will be added to the grocery list once clicked (on the add to grocery option).'
        },
        {
            question: 'How do I cancel adding an item to the inventory?',
            answer: 'You can cancel adding an item to the inventory by clicking the plus (+) button again with nothing in the input.'
        },
        {
            question: 'How do I edit an item in the inventory?',
            answer: 'You can edit an item in the inventory by clicking the pencil icon on the item you want to edit. This will show the item and category as blue, you can then edit the item and category and click the pencil icon again to save the changes.'
        },
        {
            question: 'How do I cancel editing an item in the inventory?',
            answer: 'You can cancel editing an item in the inventory by clicking the pencil icon again with no changes.'
        },
        // Weekly Menu Questions
        {
            question: 'How do I add a recipe?',
            answer: 'You can add a recipe by going to the Weekly Menu page, open the recipe tab by clicking the green tab on the right, and then drag and drop the recipe into the Menu Table.'
        },
        {
            question: 'How do I remove a recipe?',
            answer: 'You can remove a recipe by going to the Weekly Menu page, click the remove banner on the recipe you want to remove, or drag and drop the recipe back into the recipe tab.'
        },
        {
            question: 'How do I see the recipe details?',
            answer: 'You can see the recipe details by clicking the info icon on the recipe you want to view.'
        },
        {
            question: 'How do I favorite a recipe?',
            answer: 'You can favorite a recipe by clicking the star icon on the recipe you want to favorite in the recipe tab.'
        },
        {
            question: 'How do I remove a favorite recipe?',
            answer: 'You can remove a favorite recipe by clicking the star icon on the recipe you want to remove from favorites.'
        },
        {
            question: 'How can I change the first day of the week?',
            answer: 'You can change the first day of the week by going to the Preferences page.'
        },
        {
            question: 'How do I view all my favorite recipes?',
            answer: 'You can view all your favorite recipes by going to the Favorites tab in the recipe tab by clicking the star bookmark on the right side of the recipe tab.'
        },
        {
            question: 'How do I search for a recipe?',
            answer: 'You can search for a recipe by typing in the search bar at the top of the recipe tab.'
        },
        {
            question: 'Can I search by ingredients or tags?',
            answer: 'Yes, you can search by ingredients or tags by typing in the search bar with the ingredient or tag you want to search for.'
        },
        {
            question: 'How do I filter recipes?',
            answer: 'You can filter recipes by clicking the filter icon on the recipe tab, this will show a filter menu where you can filter by tags and ingredients. You can click the item, and click plus (+) to add to the include filter, and minus (-) to add to the exclude filter.'
        },
        {
            question: 'How do I clear the filters?',
            answer: 'You can clear the filters by clicking each include or exclude filter items, when you click the item, it will be removed from the filter.'
        },
        {
            question: 'How do I save the menu?',
            answer: 'The menu is autosaved every 30 seconds, it is also saved when you leave or refresh the page.'
        },
        {
            question: 'What is the recommended menu?',
            answer: 'The recommended menu is a menu generated by the system based on your inventory. It is a suggestion for you to use your current ingredients to reduce food waste.'
        },
        {
            question: 'How do I view the recommended menu?',
            answer: 'You can view the recommended menu by clicking the recommended tab in the recipe tab it\'s indicated by the book icon.'
        },
        {
            question: 'How do I add the recommended menu to the weekly menu?',
            answer: 'You can add the recommended menu to the weekly menu by dragging and dropping the recipe into the Menu Table.'
        },
        

    ];

    const handleToggle = (index) => {
        const selected = document.getElementById(`faq-answer-${index}`);
        if (selectedQuestion === index) {
            setSelectedQuestion(null); // Close the answer
            selected.style.height = '0'; // Set height to 0
        } else {
            const opened = document.querySelector('.faq-answer.show');
            if (opened) {
                opened.style.height = '0'; // Close the previously opened answer
            }

            setSelectedQuestion(index); // Open the answer
            selected.style.height = `${selected.scrollHeight}px`; // Set height dynamically based on content
        }
    };

    const handleTutorialToggle = (index) => {
        const selected = document.getElementById(`tut-answer-${index}`);
        if (selectedTutorial === index) {
            setSelectedTutorial(null); // Close the answer
            selected.style.height = '0'; // Set height to 0
        } else {
            const opened = document.querySelector('.tut-answer.show');
            if (opened) {
                opened.style.height = '0'; // Close the previously opened answer
            }

            setSelectedTutorial(index); // Open the answer
            selected.style.height = `${selected.scrollHeight}px`; // Set height dynamically based on content
        }
    }

    return (
        <div className="tutorial-page">

            <header className="landingHeader">
                <a href="/"><img src="Tavern-logo-small.png" alt="Tavern Logo"/></a>
                <div className="headerButtons">
                    <a className="tutorial-btn active" href="/tutorial"> Help & Tutorial </a>
                    <a className="loginOrRegisterButton" href="/Login"> Login/Register </a>
                </div>
            </header>

            <div className="tutorial-main">
                <div className='help-column'>
                    <h1>Help</h1>

                    <div className="pref contact-us">
                        <h2>Contact Us</h2>
                        {/* thetavern.dev@gmail.com */}
                        <p>Email:</p>
                        <a href="mailto:thetavern.dev@gmail.com">thetavern.dev@gmail.com</a>
                    </div>

                    <div className="pref FAQ">
                        <h2>FAQ</h2>
                        <div className="faq-divider accordian">
                            {FAQ.map((item, index) => (
                                <div className='faq-item' key={index}>
                                    <div className='faq-title' onClick={() => handleToggle(index)}>
                                        <p className='faq-question'>{item.question}</p>
                                        <span className='expand-toggle'><MdKeyboardArrowDown /></span>
                                    </div>
                                    <div id={`faq-answer-${index}`}
                                        className={`faq-answer ${selectedQuestion === index ? 'show' : ''}`}> {item.answer}</div>
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* Kofi donations */}
                    <div className="pref kofi-donations">
                        <h2>Support Us</h2>
                        <Donate
                            username="thetaverndevs"
                            classNames={{
                                donateBtn: 'donateBtn',
                                profileLink: 'myProfileLink',
                            }}
                            styles={{
                                panel: {
                                    marginRight: isSmallScreen ? '0' : '4rem',
                                    height: isSmallScreen ? '620px' : 'calc(min(600px, 95%))',
                                    bottom: '0',
                                },
                                closeBtn: {
                                    translate: isSmallScreen ? "33% -40%" : "33% -33%",
                                },
                            }}>
                            {/* add image of kofi logo */}
                            <img className='kofi-logo' src="kofi-logo.webp" alt="Ko-fi logo" />
                            <p>Support us on Ko-fi</p>
                        </Donate>
                    </div>

                </div>

                <div className='tutorial-column'>
                    <h1>Tutorial</h1>
                    <div className="pref FAQ">
                        <div className="faq-divider accordian">
                            {Tutorial.map((item, index) => (
                                <div className='faq-item' key={index}>
                                    <div className='faq-title' onClick={() => handleTutorialToggle(index)}>
                                        <p className='faq-question'>{item.question}</p>
                                        <span className='expand-toggle'><MdKeyboardArrowDown /></span>
                                    </div>
                                    <div id={`tut-answer-${index}`}
                                        className={`tut-answer ${selectedTutorial === index ? 'show' : ''}`}> {item.answer}</div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

            </div>

            <footer>
                <p>Footer</p>
            </footer>
        </div>
    );
}




export default Tutorial;
