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
import {MAIN_BACKGROUND_COLOR, MAIN_TITLE} from "./constants/constants";
import { AppContext, useProvideAppContext, setupLogin } from "./AppContext.js";
import Maps from "./pages/maps";
import {getElectionData} from "./api/api";
import {ROUTES} from "./routes";
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

  const [allStates, setAllStates] = useState([])
  const [routeData, setRouteData] = useState(null)

  const handleMainMapData = (mapData) => {
      let copy = routeData ? JSON.parse(JSON.stringify(routeData)) : {};
      if(copy["/maps"]){
          copy["/maps"]["from"] = mapData
      } else {
          copy["/maps"] = {from: mapData};
      }
      if(copy["/maps/:mapId"]){
          copy["/maps/:mapId"]["to"] = mapData
      } else {
          copy["/maps/:mapId"] = {to: mapData};
      }
      console.log(copy)
      setRouteData(copy)
  }

  // tell app to fetch values from db on first load (if initialized)
  useEffect(async() => {
     let newPayload = await getElectionData(2020);
     setAllStates(newPayload);
     setupLogin(context);
  }, [])

  console.log(context.user);

  return (
    <AppContext.Provider value={context}>
        <Router>
          <div className={"initialView"}>
            <Header baseColor={MAIN_BACKGROUND_COLOR}
                    routes={
                  [
                    {name: "Home", href: '/', active: (window.location.pathname === "/")},
                    {name: "Maps", href: '/maps', active: (window.location.pathname === "/maps")},
                    {name: "About", href: '/', active: (window.location.pathname === "/about") }
                  ]
                }
                    mainTitle={MAIN_TITLE} mainImage = {{src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png", width: "70px", height: '50px'}}/>
            <Switch>
              {
                ROUTES.map((route, index) => (
                    <Route path={route.path} exact={route.exact} key={"route"+index}>
                        {route.component()}
                    </Route>
                ))
              }
            </Switch>
            <Footer mainTitle={MAIN_TITLE}/>
          </div>
        </Router>
    </AppContext.Provider>
  );
}

export default App;
