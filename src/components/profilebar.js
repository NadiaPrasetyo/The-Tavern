import '../App.css'
import { IoMdMenu } from "react-icons/io";

const name = localStorage.getItem('name');

function ProfileBar() {
    return (
      <div className="profilebar">
        <p>{name}</p>
        <IoMdMenu className='menuIcon'/>
      </div>
    );
  
}

export default ProfileBar;