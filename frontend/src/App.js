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
import './styles/header.css'

// React functional component
export function App () {

  // Global context
  let context = useProvideAppContext();

  // handle signout
  const signout = () => {
    localStorage.setItem('jwt', "");
    window.location.pathname = '/';
  }

  const [allStates, setAllStates] = useState([])
  const [routeData, setRouteData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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
      setRouteData(copy)
  }

  let refP = "/login";
  let loggedIn = false;

  // tell app to fetch values from db on first load (if initialized)
  useEffect(async() => {
      if (context.JWT) {
        loggedIn = true;
        refP = "/UserProfile";
      }
      if (loggedIn && window.location.pathname == '/login') {
        window.location.pathname = '/';
      }
     // let newPayload = await getElectionData(2020);
     // setAllStates(newPayload);
     setupLogin(context);
     if(context.JWT) {
         setIsLoggedIn(true)
     }
  }, [])

  if (context.JWT) {
    loggedIn = true;
    refP = "/UserProfile";
  }
  if (loggedIn && window.location.pathname == '/login') {
    window.location.pathname = '/';
  }

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
              <li className="nav-item col customHeaderLi">
                <Header baseColor={MAIN_BACKGROUND_COLOR}
                  mainTitle={MAIN_TITLE} mainImage = {{src: imagePath, width: "50px", height: '50px', borderRadius: '50%', onClick: () => {
                    return refP;  
                  }}}
                  routes={
                    [
                      {name: "Home", href: '/', active: (window.location.pathname === "/"), exact: true},
                      {name: "Maps", href: '/maps', active: (window.location.pathname === "/maps")},
                      {name: "Search", href: '/search', active: (window.location.pathname == "/search") },
                      loggedIn ? {name: "Sign out", href: '/', onClick: signout} : null
                    ]
                  }

                        showImage={loggedIn}
                  mainTitle={MAIN_TITLE} mainImage = {{src: imagePath, width: "40px", height: '40px', borderRadius: '50%', onClick: () => {
                    return refP;  
                  }}}
                />
              </ li>
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