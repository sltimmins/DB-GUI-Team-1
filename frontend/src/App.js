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
import Header from "./components/header";
import Footer from "./components/footer";
import Search from "./pages/search";
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

  return (
    <AppContext.Provider value={context}>
        <Router>
          <div className={"initialView"}>
            <Header baseColor={MainBackgroundColor}
                routes={
                  [
                    {name: "Home", href: '/', active: (window.location.pathname == "/" ? true: false)},
                    {name: "Maps", href: '/maps', active: (window.location.pathname == "/maps" ? true: false)},
                    {name: "About", href: '/', active: (window.location.pathname == "/about" ? true: false) }
                  ]
                }
                mainTitle={MainTitle} mainImage = {{src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png", width: "70px", height: '50px'}}/>
            <Switch>
              <Route path="/login">
                <Users />
              </Route>
              <Route path="/candidateSearch">
                <Search />
              </Route>
              <Route path="/maps">
                <Maps />
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
