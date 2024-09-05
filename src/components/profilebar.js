import '../App.css'
import { IoMdMenu } from "react-icons/io";

function ProfileBar(props) {
    return (
      <div className="profilebar">
        <p>{props.username}</p>
        <IoMdMenu className='menuIcon'/>
      </div>
    );
  
}

export default ProfileBar;