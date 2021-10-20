import React, { useContext, useState, useEffect } from "react";
import {App} from "./App.css";
import { Login } from "./pages/login.js";
import { Register } from "./pages/register.js";
import { AppContext } from "./AppContext.js";

import {
    useHistory,
    useLocation
  } from 'react-router-dom'
  
  import axios from "axios";

  export default function Users() {
      const [registerMode, setRegister] = useState(false);
      const [bannerMessage, setBanner] = useState("");

      const { baseURL, setUser, setJWT, JWT, user } = useContext(AppContext);

      const toggleRegisterMode = () => {
        console.log("stuff")
        setBanner("");
        setRegister(!registerMode);
      }

      let history = useHistory();
      let location = useLocation();

      const redirectToHome = () => {
        let { from } = location.state || { from: { pathname: "/home"}};
        history.replace(from);
      }

      const doLogin = async (username, password) => {
        setBanner("");
        // axios.post(baseURL + "/users/login", {username, password})
        //      .then((res) => {

        //      })
      }

      const doRegister = async (username, password, user_type) => {

      }

      let banner = <></>;
      if(bannerMessage !== "") {
          banner = (
            <div className="alert alert-primary" role="alert">
                {bannerMessage}
            </div>
          );
      }

      let form = (
          <Login banner={banner} doLogin={doLogin} toggleRegisterMode={toggleRegisterMode} />
      );

      if(registerMode) {
          form = (
              <Register banner={banner} doRegister={doRegister} toggleRegisterMode={toggleRegisterMode} />
          );
      }

      return (
          <div className="container h-100">
            <div className="h-100 row justify-content-center align-items-center">
                <form className="col-md-4">{form}</form>
            </div>
          </div>
      )
  }