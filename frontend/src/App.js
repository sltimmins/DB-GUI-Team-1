import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Users from "./Users.js"
import Home from "./pages/home";
import UserProfile from './pages/UserProfile';
import Header from "./components/header";
import Footer from "./components/footer";
import {MainBackgroundColor, MainTitle} from "./constants/constants";
import { AppContext, useProvideAppContext, setupLogin } from "./AppContext.js";
import Maps from "./pages/maps";
require('dotenv').config()

// React functional component
export function App () {

  // Global context
  let context = useProvideAppContext();

  console.log(context.user);

  // handle signout
  const signout = () => {
    localStorage.setItem('jwt', "")
  }

  // tell app to fetch values from db on first load (if initialized)
  useEffect(() => {
    setupLogin(context);
  }, [])

  let refP = "/login";
  let loggedIn = false;
  if (context.JWT != undefined) {
    loggedIn = true;
    refP = "/UserProfile";
  }

  return (
    <AppContext.Provider value={context}>
        <Router>
          <div className={"initialView"}>

            <ul className="nav">
              <li className="nav-item col">
                <Header className="col" baseColor={MainBackgroundColor} 
                  routes={
                    [
                      {name: "Home", href: '/', active: (window.location.pathname == "/" ? true: false)},
                      {name: "Maps", href: '/maps', active: (window.location.pathname == "/maps" ? true: false)},
                      {name: "About", href: '/', active: (window.location.pathname == "/about" ? true: false) }
                    ]
                  }
                  mainTitle={MainTitle} mainImage = {{src: "https://via.placeholder.com/200", width: "50px", height: '50px', href: {refP}, borderRadius: '50%', onClick: () => {  
                    return refP;  
                  }}}
                />
              </li>
              <li className="nav-item border">
                <a className="nav-link" href=""></a>
                {
                  loggedIn && <a className="nav-link" onClick={context.signout} href={refP}>Sign out</a>
                }
                {
                  !loggedIn && <a className="nav-link" onClick={() => {console.debug("clicked!")}} href={refP}>Sign in</a>
                }
              </li>
            </ul>

            <Switch>
              <Route path="/login">
                <Users />
              </Route>
              <Route path="/maps">
                <Maps />
              </Route>
              <Route path="/UserProfile">
                <UserProfile />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <Footer mainTitle={MainTitle}/>
          </div>
        </Router>
    </AppContext.Provider>
  );
}

export default App;
