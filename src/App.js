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

  if (response.statusCode === 200) {
    const data = await response.json();
    return data;
    // You can now use `data.username`, `data.email`, etc.
  } else {
    console.error("Failed to fetch user profile.");
    return null;
  }
};

// Function to check token expiration
const checkTokenExpiration = (token) => {
  if (!token) return;
  
  const decoded = jwtDecode(token); // Decode the token
  console.log("DECODED JWT", decoded);
  const currentTime = Date.now() / 1000; // Get current time in seconds

  if (decoded.exp < currentTime) {
    console.log("Session expired, please log in again.");
    alert("Session expired, please log in again.");
    sessionStorage.removeItem("token"); // Clear the token
    window.location.href = "/login"; // Redirect to login page
  }
};


function PrivateRoute({ element }) {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTokenExpiration(sessionStorage.getItem("token"));
    const fetchData = async () => {
      const data = await fetchUserProfile();
      if (data) {
        setUserdata(data);
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="home" element={<PrivateRoute element={<Home />} />} />
          <Route path="inventory" element={<PrivateRoute element={<Inventory />} />} />
          <Route path="weekly-menu" element={<PrivateRoute element={<Menu />} />} />
          <Route path="grocery-list" element={<PrivateRoute element={<Grocery />} />} />
          <Route path="settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="preference" element={<PrivateRoute element={<Preference />} />} />
          <Route path="options" element={<PrivateRoute element={<Options />} />} />
          <Route path="feedback" element={<PrivateRoute element={<Feedback />} />} />
          <Route path="trial" element={<Trial />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}




export default App;

