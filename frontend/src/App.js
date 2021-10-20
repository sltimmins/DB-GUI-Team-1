import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Users from "./Users.js"
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";
import {MainBackgroundColor, MainTitle} from "./constants/constants";
import { AppContext, useProvideAppContext, setupLogin } from "./AppContext.js";

// React functional component
export function App () {
  // Global context
  let context = useProvideAppContext();

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
      <div>
        <Router>
          <div>
            <Header baseColor={MainBackgroundColor}
                routes={
                  [
                    {name: "Home", href: '/', active: true},
                    {name: "Maps", href: '/', active: false},
                    {name: "About", href: '/', active: false}
                  ]
                } 
                mainTitle={MainTitle} mainImage = {{src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png", width: "70px", height: '50px'}}/>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/login">
                <Users />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <Footer mainTitle={MainTitle}/>
          </div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
