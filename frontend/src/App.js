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

  // handle signout
  const signout = () => {
    localStorage.setItem('jwt', "");

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

  let refP = "/login";
  let loggedIn = false;
  if (context.JWT != undefined) {
    loggedIn = true;
    refP = "/UserProfile";
  }

  console.log(context.user);

  let uuid = "";
  if (context.user != undefined && context.user.uuid != null) {
    uuid = context.user.uuid;
  }
  let imagePath = "assets/userImages/default.jpg";

  if (uuid != "") {
    imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
  }


  return (
    <AppContext.Provider value={context}>
        <Router>
          <div className={"initialView"}>
            <ul className="nav">
              <li className="nav-item col">
                <Header baseColor={MAIN_BACKGROUND_COLOR}
                  routes={
                    [
                      {name: "Home", href: '/', active: (window.location.pathname === "/")},
                      {name: "Maps", href: '/maps', active: (window.location.pathname === "/maps")},
                      {name: "About", href: '/', active: (window.location.pathname === "/about") },
                      {name: "Search", href: '/search', active: (window.location.pathname == "/search") }
                    ]
                  }
                  mainTitle={MAIN_TITLE} mainImage = {{src: imagePath, width: "50px", height: '50px', borderRadius: '50%', onClick: () => {
                    return refP;  
                  }}}
                />
              </ li>
              <li className="nav-item border">
                <a className="nav-link" href=""></a>
                {
                  loggedIn && <a className="nav-link" onClick={signout} href="/home">Sign out</a>
                }
                {
                  !loggedIn && <a className="nav-link" onClick={() => {console.debug("clicked!")}} href={refP}>Sign in</a>
                }
              </li>
            </ul>
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
