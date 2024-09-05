import { IoMdMenu } from "react-icons/io";
import './App.css';

function userProfile() {
    return (
      <div className="userprofile">
        <p>{'name'}</p>
        <IoMdMenu color='black'/>
      </div>
    );
  }

export default userProfile;