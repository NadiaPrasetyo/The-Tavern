import React from 'react';
import '../App.css';
import { FaHome } from "react-icons/fa";
import { RiFridgeFill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdLocalGroceryStore } from "react-icons/md";

function Sidebar(props) {
    const [isClosed, setSideBar] = React.useState(false);
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

    function GetActive(openprop){

        console.log(openprop.closed);
        console.log("source = " + props.source);

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
					<span class="logodisplay"></span>
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
					<span class="logodisplay"></span>
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


