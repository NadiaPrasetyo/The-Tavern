import React from 'react';
import '../App.css';
import { FaHome } from "react-icons/fa";
import { RiFridgeFill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdLocalGroceryStore } from "react-icons/md";
import { GiCrown } from "react-icons/gi";
import { GiQuillInk } from "react-icons/gi";
import { GiTwoHandedSword } from "react-icons/gi";
import { GiScrollQuill } from "react-icons/gi";

/**
 * SIDEBAR COMPONENT of the application
 * @param {object} props the source of the page where the sidebar is located
 */
function Sidebar(props) {
    const [isClosed, setSideBar] = React.useState(false);
    //get the window width
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    
    //listen for changes in the window width
    React.useEffect(() => {
        if (window.innerWidth < 768) { //if the window width is less than 768px set the sidebar to true (closed)
            setSideBar(true);
        }
        
        //handle the window resize
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setSideBar(true);//if the window width is less than 768px set the sidebar to true (closed)
            }
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);//only run when the component mounts

    //initialize the HTML template that will be returned
    var template;

    //check if the sidebar is closed
    React.useEffect(() => {
        const isClosedFromStorage = sessionStorage.getItem('isClosed') === 'true';
        if (isClosedFromStorage) {
            toggleSidebar();
        }
    }, []);

    /**
     * Function to toggle the sidebar
     * changes the sidebar from open to closed and vice versa and the animation of the sidebar
     * alters the styling of sidebar and content
     */
    function toggleSidebar() {
        if (isClosed) {
            document.querySelector('.sidebar').style.animation = 'open 0.5s';
            document.querySelector('.content').style.animation = 'shrink 0.5s';
            document.querySelector('.content').style.left = '250px';
            document.querySelector('.content').style.maxWidth = 'calc(100vw - 300px)';
            document.getElementById('sidebar-logo-small').style.animation = 'becomeBig 0.5s';
            if (props.setIsOpen !== undefined) {//if the origin sidebar is closed set the origin sidebar to open
                props.setIsOpen(true);
            }
        }
        
        if (!isClosed) {
            document.querySelector('.sidebar').style.animation = 'close 0.5s';
            document.querySelector('.content').style.animation = 'spread 0.5s';
            document.querySelector('.content').style.left = '50px';
            document.querySelector('.content').style.maxWidth = 'calc(100vw - 100px)';
            document.getElementById('sidebar-logo').style.animation = 'becomeSmall 0.5s';
            if (props.setIsOpen !== undefined) {//if the origin sidebar is closed set the origin sidebar to open
                props.setIsOpen(false);
            }
        }
        setSideBar(!isClosed);
        sessionStorage.setItem('isClosed', !isClosed);
        
    }

    /**
     * Function to get the active button in the sidebar
     * @param {object} openprop the source of the page where the sidebar is located
     * @return HTML template of the active button
     */
    function GetActive(openprop){
        //there's a better way to do this, but I am not going to do it
        if (props.source === null){
            props.source = "Home";
        }
        
        if (openprop.closed === 'false'){
        switch(props.source){
            case "Home":
                return(
                    <>
                    <li><a href="/Home" className = "active"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </>

                );
            case "Inventory":
                return(
                    <>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory" className = "active"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </>
                );
            case "Menu":
                return(
                    <>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu" className = "active"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </>
                );
            case "Grocery":
                return(
                    <>
                    <li><a href="/Home"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list" className = "active"><MdLocalGroceryStore /></a></li>
                    </>
                );
            case "Settings":
                return(
                    <>
                    <li><a href="/Settings" className = "active"><GiCrown /></a></li>
                    <li><a href="/Preference"><GiQuillInk /></a></li>
                    <li><a href="/Options"><GiTwoHandedSword /></a></li>
                    <li><a href="/Feedback"><GiScrollQuill /></a></li>
                    </>
                );
            case "Preference":
                return(
                    <>
                    <li><a href="/Settings"><GiCrown /></a></li>
                    <li><a href="/Preference" className = "active"><GiQuillInk /></a></li>
                    <li><a href="/Options"><GiTwoHandedSword /></a></li>
                    <li><a href="/Feedback"><GiScrollQuill /></a></li>
                    </>
                );
            case "Options":
                return(
                    <>
                    <li><a href="/Settings"><GiCrown /></a></li>
                    <li><a href="/Preference"><GiQuillInk /></a></li>
                    <li><a href="/Options" className = "active"><GiTwoHandedSword /></a></li>
                    <li><a href="/Feedback"><GiScrollQuill /></a></li>
                    </>
                );
            case "Feedback":
                return(
                    <>
                    <li><a href="/Settings"><GiCrown /></a></li>
                    <li><a href="/Preference"><GiQuillInk /></a></li>
                    <li><a href="/Options"><GiTwoHandedSword /></a></li>
                    <li><a href="/Feedback" className = "active"><GiScrollQuill /></a></li>
                    </>
                );
            default:
                return(
                    <>
                    <li><a href="/Home" className = "active"><FaHome /></a></li>
                    <li><a href="/Inventory"><RiFridgeFill /></a></li>
                    <li><a href="/Weekly-menu"><BiSolidFoodMenu /></a></li>
                    <li><a href="/Grocery-list"><MdLocalGroceryStore /></a></li>
                    </>
                );
            
        }
    } else if (openprop.closed === 'true'){
        switch(props.source){
            case "Home":
                return(
                    <>
                    <li><a href="/Home" className = "active">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </>
                );
            case "Inventory":
                return(
                    <>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory" className = "active">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </>
                );
            case "Menu":
                return(
                    <>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu" className = "active">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </>
                );  
            case "Grocery":
                return(
                    <>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list" className = "active">Grocery List</a></li>
                    </>
                );
            case "Settings":
                return(
                    <>
                    <li><a href="/Settings" className = "active">Settings</a></li>
                    <li><a href="/Preference">Preference</a></li>
                    <li><a href="/Options">Options</a></li>
                    <li><a href="/Feedback">Feedback</a></li>
                    </>
                );
            case "Preference":
                return(
                    <>
                    <li><a href="/Settings">Settings</a></li>
                    <li><a href="/Preference" className = "active">Preference</a></li>
                    <li><a href="/Options">Options</a></li>
                    <li><a href="/Feedback">Feedback</a></li>
                    </>
                );
            case "Options":
                return(
                    <>
                    <li><a href="/Settings">Settings</a></li>
                    <li><a href="/Preference">Preference</a></li>
                    <li><a href="/Options" className = "active">Options</a></li>
                    <li><a href="/Feedback">Feedback</a></li>
                    </>
                );
            case "Feedback":
                return(
                    <>
                    <li><a href="/Settings">Settings</a></li>
                    <li><a href="/Preference">Preference</a></li>
                    <li><a href="/Options">Options</a></li>
                    <li><a href="/Feedback" className = "active">Feedback</a></li>
                    </>
                );
            default:
                return(
                    <>
                    <li><a href="/Home" className = "active">Home</a></li>
                    <li><a href="/Inventory">Inventory</a></li>
                    <li><a href="/Weekly-menu">Weekly Menu</a></li>
                    <li><a href="/Grocery-list">Grocery List</a></li>
                    </>
                );
            
        }
    }
    }

    /**
     * Function to return the open sidebar
     * @returns HTML template of the open sidebar
     */
    function openSidebar() {
        template = (
            <div className="sidebar">
                <header>
					<span className="logodisplay"><a href="/Home"><img id ="sidebar-logo" src="/Tavern-logo.png" alt="Tavern Logo" /></a></span>
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
    
    /**
     * Function to return the closed sidebar
     * @returns HTML template of the closed sidebar
     */
    function closeSidebar() {
        template = (
            <div className="sidebar closed">
                <header>
					<span className="logodisplay"><a href= "/Home"><img id ="sidebar-logo-small" src="/Tavern-logo-small.png" alt="Tavern Logo" /></a></span>
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

    //return the closed sidebar if the window width is less than 768px
    if (windowWidth < 768) {
        return closeSidebar();
    } else    
    if (!isClosed) {
        return openSidebar();
    }
    else {
        return closeSidebar();
    }

}

export default Sidebar;


