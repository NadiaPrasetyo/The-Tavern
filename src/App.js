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
import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';

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
  } else {
    console.error("Failed to fetch user profile.");
    return null;
  }
};

// Function to check token expiration
const checkTokenExpiration = (token, handleEndSession) => {
  if (!token) return;
  
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    console.error("Token expired. Redirecting to login.");
    handleEndSession(false);
  } else if (decoded.exp - 300 < currentTime) {
    console.log("Token near expiration. Asking user to continue session.");
    handleEndSession(true);
  }
};

function PrivateRoute({ element, handleEndSession, setUsername }) {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = window.location;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    checkTokenExpiration(token, handleEndSession, location);

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
  }, [handleEndSession]);

  if (loading) {
    return (
      <div className='loading-page'>
        <Loading />
      </div>
    );
  }

  if (userdata) {
    return React.cloneElement(element, { userdata });
  } else {
    return null;
  }
}

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropDownEnddedOpen, setDropDownEnddedOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const timerRef = useRef(null);

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

  // Handle session continuation
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
          <Route index element={<Login />} />
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
