import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    // Extract the token and username from the URL
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        if (password.length < 18 || password.length > 30) {
            setMessage('Password must be between 18 and 30 characters');
            return;
        }

        const response = await fetch(`/api/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setMessage('Password reset successfully');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else if (response.status === 400 || response.status === 401 || response.status === 402) {
            window.location.href = `/reset-password-error?message=${data.message}`;
        } else {
            setMessage(data.message || 'Error resetting password');
        }
    };

    return (
        <div className='App'>
            <main className='login'>
                <div id='Reset-component'>
                    <form className='login-form' onSubmit={handleResetPassword}>
                        <ul>
                            <li>
                                <h2 className="form-title">Reset Password</h2>
                            </li>
                            <li>
                                <label>New Password:</label><br />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </li>
                            <li>
                                <label>Confirm Password:</label><br />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </li>
                            <li>
                                <button type="submit" onClick={handleResetPassword}>Reset Password</button>
                            </li>
                            <li>
                                {message && <p>{message}</p>}
                            </li>
                        </ul>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ResetPassword;
