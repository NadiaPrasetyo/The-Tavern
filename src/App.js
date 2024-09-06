import './App.css';
//import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Menu from "./pages/Weekly-menu";
import Grocery from "./pages/Grocery-list";
import NoPage from "./pages/NoPage";

//import SignIn from './components/SignIn.js';

var isDarkMode = false;//default to false


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
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="weekly-menu" element={<Menu />} />
          <Route path="grocery-list" element={<Grocery />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}




export default App;
