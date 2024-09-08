import React from 'react';
import '../App.css';
import { FaHome } from "react-icons/fa";
import { RiFridgeFill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdLocalGroceryStore } from "react-icons/md";
import { GiCrown } from "react-icons/gi";
import { GiQuillInk } from "react-icons/gi";
import { GiTwoHandedSword } from "react-icons/gi";
import { getSidebarState, setSideBarState } from '../index.js';

function Sidebar(props) {
    var state = getSidebarState();
    console.log("state 1 = " + state);

    const [isClosed, setSideBar] = React.useState(state);
    var template;

    function toggleSidebar() {
        if (isClosed) {
            document.querySelector('.sidebar').style.animation = 'open 0.5s';
            document.querySelector('.content').style.animation = 'shrink 0.5s';
            document.querySelector('.content').style.left = '250px';
            document.getElementById('sidebar-logo-small').style.animation = 'becomeBig 0.5s';
        }
        
        if (!isClosed) {
            document.querySelector('.sidebar').style.animation = 'close 0.5s';
            document.querySelector('.content').style.animation = 'spread 0.5s';
            document.querySelector('.content').style.left = '50px';
            document.getElementById('sidebar-logo').style.animation = 'becomeSmall 0.5s';
        }
        setSideBarState(!isClosed);
        console.log("isClosed = " + isClosed);
        console.log("state 2= " + state);
        setSideBar(!isClosed);
        
    }

    function GetActive(openprop){

        if (props.source === null){
            props.source = "Home";
        }

        if (openprop.closed === 'false'){
        switch(props.source){
            case "Home":
                return(
                    <div>
                    <li><a href="/Home" class = "active"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </div>

                );
            case "Inventory":
                return(
                    <div>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory" class = "active"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </div>
                );
            case "Menu":
                return(
                    <div>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu" class = "active"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </div>
                );
            case "Grocery":
                return(
                    <div>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list" class = "active"><MdLocalGroceryStore /></a></li>
                    </div>
                );
            case "Settings":
                return(
                    <div>
                    <li><a href="/Settings" class = "active"><GiCrown /></a></li>
                    <li><a href="/Preference"><GiQuillInk /></a></li>
                    <li><a href="/Options"><GiTwoHandedSword /></a></li>
                    </div>
                );
            case "Preference":
                return(
                    <div>
                    <li><a href="/Settings"><GiCrown /></a></li>
                    <li><a href="/Preference" class = "active"><GiQuillInk /></a></li>
                    <li><a href="/Options"><GiTwoHandedSword /></a></li>
                    </div>
                );
            case "Options":
                return(
                    <div>
                    <li><a href="/Settings"><GiCrown /></a></li>
                    <li><a href="/Preference"><GiQuillInk /></a></li>
                    <li><a href="/Options" class = "active"><GiTwoHandedSword /></a></li>
                    </div>
                );
            default:
                return(
                    <div>
                    <li><a href="/Home" class = "active"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </div>
                );
            
        }
    } else if (openprop.closed === 'true'){
        switch(props.source){
            case "Home":
                return(
                    <div>
                    <li><a href="/Home" class = "active">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </div>
                );
            case "Inventory":
                return(
                    <div>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory" class = "active">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </div>
                );
            case "Menu":
                return(
                    <div>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu" class = "active">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </div>
                );  
            case "Grocery":
                return(
                    <div>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list" class = "active">Grocery List</a></li>
                    </div>
                );
            case "Settings":
                return(
                    <div>
                    <li><a href="/Settings" class = "active">Settings</a></li>
                    <li><a href="/Preference">Preference</a></li>
                    <li><a href="/Options">Options</a></li>
                    </div>
                );
            case "Preference":
                return(
                    <div>
                    <li><a href="/Settings">Settings</a></li>
                    <li><a href="/Preference" class = "active">Preference</a></li>
                    <li><a href="/Options">Options</a></li>
                    </div>
                );
            case "Options":
                return(
                    <div>
                    <li><a href="/Settings">Settings</a></li>
                    <li><a href="/Preference">Preference</a></li>
                    <li><a href="/Options" class = "active">Options</a></li>
                    </div>
                );
            default:
                return(
                    <div>
                    <li><a href="/Home" class = "active">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </div>
                );
            
        }
    }
    }


    function openSidebar() {
        template = (
            <div className="sidebar">
                <header>
					<span class="logodisplay"><a href="/Home"><img id ="sidebar-logo" src="/Tavern-logo.png" alt="Tavern Logo" /></a></span>
				    </header>
				    <nav id="nav">
					<ul>
						<GetActive closed = 'true'/>
					</ul>
				</nav>
        
              <button className="pullTab" onClick={toggleSidebar}>
              </button>
            </div>
          );
        
            return template;
    }
    
    function closeSidebar() {
        template = (
            <div className="sidebar closed">
                <header>
					<span class="logodisplay"><a href= "/Home"><img id ="sidebar-logo-small" src="/Tavern-logo-small.png" alt="Tavern Logo" /></a></span>
				    </header>
				    <nav id="nav">
					<ul>
						<GetActive closed = 'false' />
					</ul>
				</nav>

                <button className="pullTab" onClick={toggleSidebar}>
                </button>
            </div>
        );

        return template;
    }

    if (!isClosed) {
        return openSidebar();
    }

    else {
        return closeSidebar();
    }

}

export default Sidebar;


