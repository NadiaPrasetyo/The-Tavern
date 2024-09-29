import '../App.css'
import { IoMdMenu } from "react-icons/io";

function ProfileBar({userdata}) {
  const name = userdata ? userdata.name : 'User';

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
          <a href="/Settings">Settings</a>
          <a href="/Login">Logout</a>
        </div>
        
      </div>
    );
  
}

export default ProfileBar;