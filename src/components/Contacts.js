import '../App.css';

function Contacts() {
    return (
        <div className="pref contact-us">
            <h2>Contact Us</h2>

            <div className="social-media">
                <div className='sosmed'>
                    <p>Email:</p>
                    <a href="mailto:thetavern.dev@gmail.com">thetavern.dev@gmail.com</a>
                </div>
                <div className='sosmed'>
                    <p>YouTube:</p>
                    <a href="https://www.youtube.com/@TheTavernMenu">The Tavern Menu</a>
                </div>
            </div>  
        </div>
    );
}

export default Contacts;