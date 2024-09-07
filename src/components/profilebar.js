import '../App.css'
import { IoMdMenu } from "react-icons/io";

const username = localStorage.getItem('username');

function ProfileBar() {
    return (
      <div className="profilebar">
        <p>{username}</p>
        <IoMdMenu className='menuIcon'/>
      </div>
    );
  
}

export default ProfileBar;