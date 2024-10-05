import '../App.css';
import Sidebar from '../components/sidebar.js';
import React, { useState } from 'react';
import { VscTriangleDown } from "react-icons/vsc";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Donate } from 'react-kofi-overlay'

import ProfileBar from '../components/profilebar.js';

function Help({ userdata }) {
    const [displayConfirm, setDisplayConfirm] = useState(false);
    const [displayOption, setDisplayOptions] = useState(false);
    const [displayVersion, setDisplayVersion] = useState(false);
    const [selectedBrowser, setSelectedBrowser] = useState('Chrome');
    const [selectedVersion, setSelectedVersion] = useState('Desktop');
    const [selectedQuestion, setSelectedQuestion] = useState(null);

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

    const [message, setMessage] = useState('');

    const sendBugReport = async (bugDetails) => {
        try {
            const response = await fetch('api/bug-report-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bugDetails),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.status === 200) {
                document.getElementById('bug-description').value = '';
                document.getElementById('bug-location').value = '';
                setTimeout(() => setDisplayConfirm(false), 3000);
            }
        }
        catch (error) {
            console.error('Error:', error);
            setMessage('Error sending bug report. Please try again later.');
        }
    };

    const handleSubmitBugReport = () => {
        // check if all fields are filled
        if (!document.getElementById('bug-description').value || !document.getElementById('bug-location').value) {
            setMessage('Please fill in all fields.');
            return;
        }

        setMessage('Sending bug report...');


        const bugDetails = {
            description: document.getElementById('bug-description').value,
            location: document.getElementById('bug-location').value,
            browser: selectedBrowser,
            version: selectedVersion,
            date: new Date().toLocaleString(),
            from_email: userdata.email,
            name: userdata.username,
        };
        sendBugReport(bugDetails);
    };

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

    return (
        <div className="App">
            <header className="App-header">
                <ProfileBar userdata={userdata} source={"Help"} />
            </header>

            <aside>
                <Sidebar source="Help" />
            </aside>

            <main className="content setting-content">
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

                {/* Report Bug */}
                <div className="pref report-bug">
                    <h2>Report Bug</h2>
                    <button className="delete-acc" onClick={() => setDisplayConfirm(true)}>Report Bug</button>
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
            </main>

            {/* ReportBug Modal */}
            {displayConfirm && (
                <div className="modal">
                    <div className="modal-content report-bug-modal">
                        <h2>Report Bug</h2>
                        <p>Please explain the bug:</p>
                        <textarea id="bug-description"></textarea>
                        <p>Which page did you encounter the bug?</p>
                        <textarea id="bug-location"></textarea>
                        <p>Which browser are you using?</p>
                        <div className="dropbtn bugbtn" onMouseEnter={() => setDisplayOptions(true)} onMouseLeave={() => setDisplayOptions(false)} onClick={() => setDisplayOptions(!displayOption)} >
                            <div className='chosen'>{selectedBrowser}</div>
                            <VscTriangleDown className="triangle-down" />
                        </div>
                        {displayOption ? (
                            <div className='dropdown-menu browser-menu' onMouseEnter={() => setDisplayOptions(true)} onMouseLeave={() => setDisplayOptions(false)}>
                                <div className='background'>
                                    <div className='color-overlay'>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Chrome')}>Chrome</div>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Firefox')}>Firefox</div>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Safari')}>Safari</div>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Edge')}>Edge</div>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Opera')}>Opera</div>
                                        <div className='browser-option' onClick={() => setSelectedBrowser('Other')}>Other</div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <p>Mobile or Desktop version?</p>
                        <div className="dropbtn bugbtn" onMouseEnter={() => setDisplayVersion(true)} onMouseLeave={() => setDisplayVersion(false)} onClick={() => setDisplayVersion(!displayVersion)} >
                            <div className='chosen'>{selectedVersion}</div>
                            <VscTriangleDown className="triangle-down" />
                        </div>
                        {displayVersion ? (
                            <div className='dropdown-menu version-menu' onMouseEnter={() => setDisplayVersion(true)} onMouseLeave={() => setDisplayVersion(false)}>
                                <div className='background'>
                                    <div className='color-overlay'>
                                        <div className='version-option' onClick={() => setSelectedVersion('Desktop')}>Desktop</div>
                                        <div className='version-option' onClick={() => setSelectedVersion('Mobile')}>Mobile</div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {message && <p className='message-bug-report'>{message}</p>}


                        <div className="modal-buttons preference">
                            <button onClick={() => {setDisplayConfirm(false); setMessage(null)}}>Cancel</button>
                            <button className="report" onClick={handleSubmitBugReport}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            <footer>
                <p>Footer</p>
            </footer>
        </div>
    );
}




export default Help;
