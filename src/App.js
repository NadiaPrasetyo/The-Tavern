import './App.css';
import Sidebar from './sidebar.js';

const isDarkMode = false;//default to false

function App() {
  if (isDarkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
  }
  else {
    document.body.style.backgroundColor = '#fffbf6';
    document.body.style.color = 'black';
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className = "userProfile">
            Username
        </div>
      </header>

      <aside>
        <Sidebar />
      </aside>

      <main>
        <h1>Content</h1>
        <p>This is the main content area</p>
      </main>

    </div>
  );
}


export default App;
