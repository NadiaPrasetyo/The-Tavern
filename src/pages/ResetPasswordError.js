import { useLocation } from 'react-router-dom';

function ResetPassword() {

    // Extract the token and username from the URL
    const query = new URLSearchParams(useLocation().search);
    const message = query.get('message');


    return (
        <div className='App'>
            <main className='login'>
                <div id='Reset-error-component'>
                    <form className='login-form'>
                        <ul>
                            <li>
                                <h2 className="form-title">Reset Password Error</h2>
                            </li>
                            <li>
                                {message && <p>{message}</p>}
                            </li>
                            <li>
                                {/* back to login button */}
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = '/login'}}>
                                    Back to Login
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ResetPassword;
