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


var isDarkMode = false;//default to false
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

function PrivateRoute({ element }) {
  if (isLoggedIn) {
    return element;
  } else {
    // redirect to login page
    window.location.href = '/login';
    return null;
  }
}



function App() {
  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'white';
    });
  }
  else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
    document.querySelectorAll('a').forEach(link => {
      link.style.color = 'black';
    });
  }

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
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}




export default App;
