import React, { useState, useEffect, useContext } from 'react';
import '../styles/header.css';
import {NavLink, Link} from "react-router-dom";
import { AppContext } from "./../AppContext.js";

const hamburger = ["/assets/images/1024px-Hamburger_icon_white.svg.png", "/assets/images/Hamburger_icon.svg.png"]
const Header = ({routes, mainTitle, mainImage, baseColor, showImage, signInFunc, signOutFunc, signInHREF}) => {
    
    const {user} = useContext(AppContext);
    const {isCand, setIsCand} = useState(false);
    
    useEffect(() => {
        if(user.candidateId) {
            setIsCand(true);
        }
    }, [user])
    
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
            if(route) {
                elems.push(
                <li key={route.name + route.href}>
                    <NavLink exact key={route.name} to={route.href} activeClassName={"activeLink"} style={{color: fontColor}} onClick={route.onClick}>
                        {route.name}
                    </NavLink>
                </li>
            );
            }
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
                    <div className =  {["titleChild", "titleRight"].join(" ")} >
                        <li className="nav-item border signInOut signInButton" style={{display: showImage ? 'none' : 'inline-flex'}}>
                            <a className={"nav-link zeroPadding"} href=""></a>
                            {
                              showImage && <a className="nav-link" onClick={signOutFunc} href="/home">Sign out</a>
                            }
                            {
                              !showImage && <a className="nav-link" onClick={signInFunc} href={signInHREF}>Sign in</a>
                            }
                          </li>
                        <div className = {"helper"} style={{display: showImage ? 'block' : 'none'}}>
                            <div className = {"headerLogoDiv"} style={{width: mainImage.width}}>
                                <Link to={'/UserProfile/' + (user.candidateId || user.accountNumber) + '/' + isCand}>
                                    <img src={mainImage.src} className = {"headerImage"} alt="logo" style={{width: mainImage.width, height: mainImage.height}} /> 
                                </Link>
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