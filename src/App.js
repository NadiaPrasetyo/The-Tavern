import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Menu from "./pages/Weekly-menu";
import Grocery from "./pages/Grocery-list";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Preference from "./pages/Preference";
import Options from './pages/Options';
import Trial from './pages/Trial';
import Feedback from './pages/Feedback';
import Loading from './components/Loading';
import DropDown from './components/DropDown';
import Landing from './pages/Landing';
import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';

/**
 * APP COMPONENT of the application
 * @author The Tavern Devs
 */

/**
 * Function to fetch user profile data from the server
 * verifies the token and fetches the user profile data
 * used to get user data in a secure way
 * @returns the user profile data
 */
const fetchUserProfile = async () => {
  const token = sessionStorage.getItem("token");//try to get the token from the session storage

  if (!token) {//if no token found
    console.error("No token found, please log in.");
    return null;
  }

  const response = await fetch("/api/user-profile", {
    method: "GET",
    headers: {
      "Authorization": token // Send JWT in the headers
    }
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    console.error("Failed to fetch user profile.");
    return null;
  }
};

/**
 * Function to check token expiration
 * checks if the token has expired
 * @param {string} token the token to be checked
 * @param {function} handleEndSession the function to handle the end of the session
 */
const checkTokenExpiration = (token, handleEndSession) => {
  if (!token) return;
  
  const decoded = jwtDecode(token);//get the expiration time of the token
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {//if the token has expired
    console.error("Token expired. Redirecting to login.");
    handleEndSession(false);//end the session
  } else if (decoded.exp - 300 < currentTime) {//5 minutes before the token expires
    console.log("Token near expiration. Asking user to continue session.");
    handleEndSession(true);//ask the user to continue the session
  }
};

/**
 * PrivateRoute component to handle the private routes so that it checks if the user is logged in or not
 * @param {object} element the element to be rendered
 * @param {function} handleEndSession the function to handle the end of the session
 * @param {function} setUsername the function to set the username
 * @returns the element to be rendered
 */
function PrivateRoute({ element, handleEndSession, setUsername }) {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to login.");
      window.location.href = '/login';
      return;
    }
    checkTokenExpiration(token, handleEndSession);//check if the token has expired

    const fetchData = async () => {
      const data = await fetchUserProfile();
      if (data) {
        setUserdata(data);
        setUsername(data.username);
      } else {
        console.error("No user data found.");
        // window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchData();
  }, [handleEndSession]);//listen for changes in the handleEndSession function or when handleEndSession is called

  if (loading) {
    return (
      <div className='loading-page'>
        <Loading />
      </div>
    );
  }

  if (userdata) {
    return React.cloneElement(element, { userdata });//to add user data as a prop
  } else {
    return null;
  }
}

/**
 * App component to render the application
 * @returns the App component
 */
function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropDownEnddedOpen, setDropDownEnddedOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const timerRef = useRef(null);

  /**
   * Function to handle the end of the session
   * @param {boolean} ask whether to ask the user to continue the session or not
   * @returns the end of the session
   */
  const handleEndSession = (ask) => {
    if (!ask) {
      setDropdownOpen(false);
      setDropDownEnddedOpen(true);
      return;
    }
    setDropdownOpen(true);

    // Start the 5-minute timer when the dropdown opens
    timerRef.current = setTimeout(() => {
      setDropdownOpen(false);
      setDropDownEnddedOpen(true);
      // window.location.href = '/login';  // Auto-redirect to login after 5 minutes
    }, 300000); // 5 minutes in milliseconds
  };

  /**
   * Function to handle the continue session
   * set the token to continue the session once fetched
   */
  const handleContinueSession = async () => {
    clearTimeout(timerRef.current); // Clear the timeout since the user clicked "Continue"

    const response = await fetch('/api/continue-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      setDropdownOpen(false);
      setLoading(false);
    } else {
      console.error("Error logging in.");
      setDropdownOpen(false);
      setLoading(false);
      window.location.href = '/login';
    }
  };

  return (
    <BrowserRouter>
      <div className="dropdown-container">
        <DropDown
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          message={"Session is ending. Please click to continue."}
          source={"SessionEnd"}
          handleContinueSession={handleContinueSession}
        />
        <DropDown
          isOpen={dropDownEnddedOpen}
          setIsOpen={setDropDownEnddedOpen}
          message={"Session has ended. Please log in again."}
          source={"SessionEnd"}
        />
      </div>

      {(dropdownOpen || dropDownEnddedOpen) && (
        <div className="loading-page">
          <Loading />
        </div>
      )}

      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="landing" element={<Landing />} />
          <Route path="home" element={<PrivateRoute element={<Home />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="inventory" element={<PrivateRoute element={<Inventory />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="weekly-menu" element={<PrivateRoute element={<Menu />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="grocery-list" element={<PrivateRoute element={<Grocery />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="settings" element={<PrivateRoute element={<Settings />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="preference" element={<PrivateRoute element={<Preference />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="options" element={<PrivateRoute element={<Options />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="feedback" element={<PrivateRoute element={<Feedback />} handleEndSession={handleEndSession} setUsername={setUsername} />} />
          <Route path="trial" element={<Trial />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
