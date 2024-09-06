import React from 'react';
import '../App.css';
import { FaHome } from "react-icons/fa";
import { RiFridgeFill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdLocalGroceryStore } from "react-icons/md";

function Sidebar() {
    const [isClosed, setSideBar] = React.useState(false);
    const url = window.location.href;
    const active = url.substring(url.lastIndexOf('/') + 1);
    var template;

    function toggleSidebar() {
        if (isClosed) {
            document.querySelector('.sidebar').style.animation = 'open 0.5s';
        }
        
        if (!isClosed) {
            document.querySelector('.sidebar').style.animation = 'close 0.5s';
        }
        setSideBar(!isClosed);
        
    }


    function openSidebar() {
        template = (
            <div className="sidebar">
                <header>
					<span class="logodisplay"></span>
				    </header>
				    <nav id="nav">
					<ul>
						<li><a href="/Home" >Home</a></li>
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
        
            return template;
    }
    
    function closeSidebar() {
        template = (
            <div className="sidebar closed">
                <header>
					<span class="logodisplay"></span>
				    </header>
				    <nav id="nav">
					<ul>
						<li><a href="/Home"><FaHome /></a></li>
						<li><a href="/Inventory"><RiFridgeFill /></a></li>
						<li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
						<li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
					</ul>
				</nav>

                <button className="pullTab" onClick={toggleSidebar}>
                    →
                </button>
            </div>
        );

        return template;
    }

    if (!isClosed) {
        return openSidebar(active);
    }

    else {
        return closeSidebar(active);
    }

}

export default Sidebar;


