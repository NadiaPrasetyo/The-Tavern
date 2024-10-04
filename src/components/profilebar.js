import '../App.css'
import { IoMdMenu } from "react-icons/io";
/**
 * PROFILEBAR COMPONENT of the application
 * @param {object} userdata the user data to be displayed
 * @param {string} source the source of the page
 */
function ProfileBar({userdata, source}) {
  const name = userdata ? userdata.name : 'User';

  /**
   * function to toggle the menu open and close
   * changes the display of the menuBar depending on the current display
   */
  function toggleMenu(){
    if (document.querySelector('.menuBar').style.display === 'block')
      document.querySelector('.menuBar').style.display = 'none';
    else{
      document.querySelector('.menuBar').style.display = 'block';
    }
  }
  
  
    return (
      <div className="profilebar">
        <p>{name}</p>
        <button className='menuIcon' onClick={toggleMenu}><IoMdMenu /></button>
        <div className="menuBar">
          {/* if souce is base page, the popup will show settings button, if its not, it will show home */}
          {source === 'BasePage' ? (
          <a href="/Settings">Settings</a>
          ) : (
          <a href="/Home">Home</a>
          )}
          <a href="/Login">Logout</a>
        </div>
        
      </div>
    );
  
}

export default ProfileBar;