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
                <header>
					<span class="logodisplay"></span>
				    </header>
				    <nav id="nav">
					<ul>
						<li><a href="/Home" class="active">Home</a></li>
						<li><a href="/Inventory">Inventory</a></li>
						<li><a href="/Weekly-menu">Weekly Menu</a></li>
						<li><a href="/Grocery-list">Grocery List</a></li>
					</ul>
				</nav>
        
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


