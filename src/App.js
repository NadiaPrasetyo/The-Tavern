import './App.css';
//import ReactDOM from "react-dom/client";
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
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const fetchUserProfile = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
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
    // You can now use `data.username`, `data.email`, etc.
  } else {
    console.error("Failed to fetch user profile.");
    return null;
  }
};

// Function to check token expiration
const checkTokenExpiration = (token, setDropdownOpen, setLastPath, location) => {
  if (!token) return;
  
  const decoded = jwtDecode(token); // Decode the token
  const currentTime = Date.now() / 1000; // Get current time in seconds
  setLastPath(location.pathname);
  console.log("Current location: ", location.pathname);


  if (decoded.exp - 60 < currentTime ) {
    console.log("Session expired, please log in again.");
    // sessionStorage.removeItem("token"); // Clear the token

    // if decoded.exp < currentTime, the token is expired immediately after login
    setDropdownOpen(true); // Open the dropdown instead of alert
  }
};


function PrivateRoute({ element, setDropdownOpen, setLastPath, setUsername }) {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = window.location;

  useEffect(() => {
    checkTokenExpiration(sessionStorage.getItem("token"), setDropdownOpen, setLastPath, location);
    const fetchData = async () => {
      const data = await fetchUserProfile();
      if (data) {
        setUserdata(data);
        setUsername(data.username);
      } else {
        console.error("No user data found.");
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchData();
  }, [setDropdownOpen]);

  if (loading) {
    return (
    <div className='loading-page'>
      <Loading />
    </div>
    );
  }
  if (userdata){
    return React.cloneElement(element, { userdata });
  } else {
    return null;
  }
}


function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading spinner for background
  const [attempt, setAttempt] = useState(0);
  const [lastPath, setLastPath] = useState('/');
  const [username, setUsername] = useState('');

  const handleEndSession = (ask, path, user) => {
    if (!ask) {
      setDropdownOpen(false);
      return;
    }
    setDropdownOpen(true);
    setLastPath(path);
    setUsername(user);
  };

  // Handle session continuation
  const handleContinueSession = async (event, password) => {
    if (!password) {
      setAttempt(attempt + 1);
      console.log("Attempt: ", attempt);
      if (attempt >= 3) {
        window.location.href = '/login'; // Redirect to login page after 3 attempts
      }
      event.preventDefault();
      return;
    }
    console.log(username, password);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      // continue to path where the session ended
      window.location.href = lastPath;

      setDropdownOpen(false);
      setLoading(false); // Stop loading once the session continues
    } else {
      console.error("Error logging in.");
      setDropdownOpen(false);
      setLoading(false); // Stop loading once the session continues
      window.location.href = '/login';
    }
  };

  return (
    <BrowserRouter>
      <div className="dropdown-container">
        <DropDown
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          message={"Session Ended. Please enter your password to continue."}
          source={"SessionEnd"}
          handleContinueSession={handleContinueSession}
        />
      </div>
      
      {/* Show loading spinner when waiting for user input */}
      {dropdownOpen && (
        <div className="loading-page">
          <Loading />
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="home" element={<PrivateRoute element={<Home />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="inventory" element={<PrivateRoute element={<Inventory />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="weekly-menu" element={<PrivateRoute element={<Menu />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="grocery-list" element={<PrivateRoute element={<Grocery />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="settings" element={<PrivateRoute element={<Settings />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="preference" element={<PrivateRoute element={<Preference />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="options" element={<PrivateRoute element={<Options />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="feedback" element={<PrivateRoute element={<Feedback />} setDropdownOpen={setDropdownOpen} setLastPath={setLastPath} setUsername={setUsername} />} />
          <Route path="trial" element={<Trial />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
