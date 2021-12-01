import React, { useContext, useState, useEffect } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import '../styles/header.css';
const hamburger = ["/assets/images/1024px-Hamburger_icon_white.svg.png", "/assets/images/Hamburger_icon.svg.png"]
const Header = ({routes, mainTitle, mainImage, baseColor, showImage}) => {
    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    const calcFontColor = () => {
        if(baseColor.length === 4){
            baseColor+= baseColor.substring(1, 4);
        }
        let decimal = parseInt(baseColor.substring(1, baseColor.length), 16);
        let darkBoundary = parseInt("777777", 16)
        if(darkBoundary < decimal){
            return "black"
        } else {
            return "white"
        }
    }
    const [fontColor] = useState(calcFontColor())
    let getRoutes = () => {
        if(!Array.isArray(routes)){
            return [];
        }
        let elems = [];
        for(const route of routes){
            elems.push(
                <li key={route.name + route.href}>
                    <a key={route.name} href={route.href} className={(route.active ? " active" : "")} style={{color: fontColor}}>
                        {route.name}
                    </a>
                </li>
            );
        }
        return elems;
    }

    const [open, openClose] = useState(true);
    const [routeElems] = useState(getRoutes());

    let slideDownDiv = () => {
        if(open){
            const slideDown = element => element.style.height = `fit-content`;
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
                        <img alt={"hamburger menu"} src={fontColor === "white" ? hamburger[0] : hamburger[1]} className={"toggleImage"}/>
                    </button>
                </div>
                <div className = {"titleContainer"}>
                    <div className="titleChild titleRight" style={{marginRight: window.location.pathname == '/' ? '2rem' : '0'}} >
                        <div className="my-auto" style={{display: showImage ? 'block' : 'none'}}>
                            <div>
                                <img src={mainImage.src} className = {"rounded-circle"} alt="logo" style={{width: '3.5rem', height: '3.5rem'}} onClick={() => {
                                    let refP = mainImage.onClick();
                                    let candId = user.candidateId;
                                    if (candId == null) {
                                        candId = false;
                                    }
                                    if (window.location.pathname == "/" || "/true") {
                                        window.location.pathname = refP + '/' + user.accountNumber + '/' + candId;
                                    }
                                }}/>
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