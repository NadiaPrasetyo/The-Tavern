import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

var isDarkMode = false;//default to false
var sidebarState = false;//default to false

function getSidebarState() {
  return sidebarState;
}

function setSideBarState(state) {
  sidebarState = state;
  console.log("APP STATE:" +sidebarState);
}

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { isDarkMode, sidebarState, getSidebarState, setSideBarState};

