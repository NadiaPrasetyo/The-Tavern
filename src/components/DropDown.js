import React, { useState } from 'react';
import '../App.css'; // Make sure to create a CSS file for styling

const DropDown = ({ options, message, isOpen, setIsOpen, source, handleContinueSession }) => {

    const handleOptionClick = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        // Call the logic for logout
        setIsOpen(false);
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <>
            {isOpen && <div className="dropdown-overlay"></div>}
            {isOpen &&
                <div className={`dropdown ${isOpen ? 'slide-down' : ''}`}>
                    <div className={`dropdown-options ${isOpen ? 'slide-down' : ''}`}>
                        <h3>{message}</h3>
                        {source === 'SessionEnd' ? (
                            <>
                                <ul>
                                    {handleContinueSession &&
                                        <li>
                                            <button onClick={(e) => handleContinueSession(e)}>
                                                Continue Session
                                            </button>
                                        </li>}
                                    <li>
                                        <button onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <ul>
                                {options?.map((option, index) => (
                                    <li key={index}>
                                        <button onClick={() => handleOptionClick()}>
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            }
        </>
    );
};

export default DropDown;
