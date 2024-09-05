import React from 'react';
import './App.css';


function Sidebar() {
    const [isClosed, setSideBar] = React.useState(false);

    function toggleSidebar() {
        setSideBar(!isClosed);
    }

    function openSidebar() {
        return (
            <div className="sidebar">
            
        
              <button className="pullTab" onClick={toggleSidebar}>
                ←
              </button>
            </div>
          );
    }
    
    function closeSidebar() {
        return (
            <div className="sidebar closed">
                <button className="pullTab" onClick={toggleSidebar}>
                    →
                </button>
            </div>
        );
    }

    if (!isClosed) {
        return openSidebar();
    }

    else {
        return closeSidebar();
    }

}

export default Sidebar;


