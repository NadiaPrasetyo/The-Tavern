import '../App.css';
import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";

function FAQ() {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const FAQ_questions = [
        {
            question: 'Q: How do I change my password?',
            answer: 'A: You can change your password by going to the Settings page.'
        },
        {
            question: 'Q: What do I do if I forgot my password?',
            answer: 'A: You can reset your password by clicking on the "Forgot Password" link on the login page. Then, enter your username and follow the instructions.'
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
        <div className="pref FAQ">
            <h2>FAQ</h2>
            <div className="faq-divider accordian">
                {FAQ_questions.map((item, index) => (
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
    );
}




export default FAQ;
