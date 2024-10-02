import React, { useState } from 'react';
import '../App.css'; // Make sure to create a CSS file for styling
import e from 'cors';

const DropDown = ({ options, message, isOpen, setIsOpen, source, handleContinueSession }) => {
    const [password, setPassword] = useState(''); // State to track the password input

    const handleOptionClick = () => {
        setIsOpen(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Update password state
    };

    const handleLogout = () => {
        // Call the logic for logout
        setIsOpen(false);
        window.location.href = '/login'; // Redirect to login page
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
                                {/* Password input */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <ul>
                                    <li>
                                        <button onClick={(e) => handleContinueSession(e, password)}>
                                            Continue Session
                                        </button>
                                    </li>
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
