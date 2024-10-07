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
            question: 'Q: How do I change the recipe viewed in the Home page?',
            answer: 'A: You can change the recipe viewed in the Home page by clicking on the recipe name on the today menu (if you don\'t have any, it\'ll be random).'
        },
        {
            question: 'Q: Can I change the menu displayed in the today menu section?',
            answer: 'A: Yes, by changing the recipes for the day in the Weekly Menu page, the today menu will update accordingly. Or you can click on the day in the calendar to view the menu for that day.'
        },

        // Weekly Menu Questions
        {
            question: 'Q: How do I add a recipe?',
            answer: 'A: You can add a recipe by going to the Weekly Menu page, open the recipe tab by clicking the green tab on the right, and then drag and drop the recipe into the Menu Table.'
        },
        {
            question: 'Q: How do I remove a recipe?',
            answer: 'A: You can remove a recipe by going to the Weekly Menu page, click the remove banner on the recipe you want to remove, or drag and drop the recipe back into the recipe tab.'
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

            <main className="tutorial-main">
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

            </main>

            <footer>
                <p>Footer</p>
            </footer>
        </div>
    );
}




export default Tutorial;
