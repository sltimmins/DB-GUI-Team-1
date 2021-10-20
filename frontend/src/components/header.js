// import closeUp from '/images/closeUp.JPG'
import React, { useState } from 'react';
import '../styles/header.css';
const logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png";
const hamburger = ["/assets/images/1024px-Hamburger_icon_white.svg.png", "/assets/images/Hamburger_icon.svg.png"]
const Header = ({getOpenOrClose, routes, mainTitle, mainImage, baseColor}) => {
    const calcFontColor = () => {
        if(baseColor.length==4){
            baseColor+= baseColor.substring(1, 4);
        }
        let decimal = parseInt(baseColor.substring(1, baseColor.length), 16);
        let darkBoundary = parseInt("777777", 16)
        console.log(decimal, darkBoundary, baseColor)
        if(darkBoundary < decimal){
            return "black"
        } else {
            return "white"
        }
    }
    const [fontColor, setFontColor] = useState(calcFontColor())
    let getRoutes = () => {
        if(!Array.isArray(routes)){
            console.log("Is not array")
            return [];
        }
        let elems = [];
        for(const route of routes){
            elems.push(
                <li>
                    <a href={route.href} className={(route.active ? " active" : "")} style={{color: fontColor}}>
                        {route.name}
                    </a>
                </li>
            );
        }
        return elems;
    }

    const [open, openClose] = useState(true);
    const [routeElems, getRouteElems] = useState(getRoutes());

    let slideDownDiv = () => {
        const element = document.getElementById("wrapper");
        if(open){
            const slideDown = element => element.style.height = `${element.scrollHeight}px`;
            slideDown(document.getElementById("wrapper"));
        } else {
            const slideDown = element => element.style.height = `0px`;
            slideDown(document.getElementById("wrapper"));
        }

    }

    return (
        <>
            <section className = {"wideHeader"} style={{backgroundColor: baseColor}}>
                <div>
                    <ul className={"headerLinks"}>
                        {routeElems}
                    </ul>
                    {/* <h1 onClick = {() => { openClose(!open) ;getOpenOrClose(open)}}>
                        toggle
                    </h1> */}
                    <button
                        className = {"mobileMenuButton"}
                        onClick = {() => { openClose(!open) ; slideDownDiv();}}
                        style = {{backgroundColor : 'transparent', border : '0'}}
                    >
                        <img src={fontColor == "white" ? hamburger[0] : hamburger[1]} className={"toggleImage"}/>
                    </button>
                </div>
                <div className = {"titleContainer"}>
                    <div className =  {["titleChild", "titleRight"].join(" ")} >
                        <div className = {"helper"}>
                            <div className = {"headerLogoDiv"} style={{width: mainImage.width}}>
                                <img src={mainImage.src} className = {"headerImage"} alt="logo" style={{width: mainImage.width, height: mainImage.height}} />
                            </div>
                        </div>

                    </div>
                    <div className = {"titleChild"} style = {{cursor : 'pointer'}}
                        onClick = {() => {
                            document.location.href = '/'
                        }}
                    >
                        <h1 className = {"mainTitle"} style={{color: fontColor}}>
                            {mainTitle}
                        </h1>
                    </div>
                </div>
            </section>
            <div id="wrapper">
                <div className="slideMeDown" style={{backgroundColor: baseColor}}>
                    <ul className={"headerLinks"}>
                        {routeElems}
                    </ul>
                </div>
            </div>
            {/* <Navbar className="mr-auto bg-light mb-2" expand="lg">
                <Navbar.Brand href="/">Seun Suberu</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/employees">Employees</Nav.Link>
                    <Nav.Link href="/rooms">Rooms</Nav.Link>
                    <Nav.Link href="/covid">Covid Cases</Nav.Link>
                    <Nav.Link href="/inbox">Inbox</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Navbar> */}
        </>
    );
  };


export default Header;