import React, { useContext, useState } from "react";
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

      const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
      

      const toggleRegisterMode = () => {
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
        axios.post(baseURL + '/users/login', { username: username, password: password }).then((res) => {
          if(res.data.success) {
            // Handle success and update state
            setJWT(res.data.data.jwt)
            setUser(res.data.data)
            redirectToHome()
            localStorage.setItem("jwt", res.data.data.jwt)
          } else {
            setBanner(res.data.message)
          }
        }).catch((e) => {
          if (e.response) {
            setBanner(e.response.data.message);
          } else {
            setBanner("We had an issue connecting to the server");
          }
        });
      }

      const doRegister = async (firstName, lastName, username, password, email, user_type, party, bio, profilePic) => {
        setBanner("");
        let cand = user_type === "Candidate"
        const formData = new FormData();
        let uuid = "";
        console.log(profilePic);
        formData.append('file', profilePic);
        formData.append('upload_preset', 'e0s8om4e');
        const options = {
          method: 'POST',
          body: formData
        };
  
        fetch('https://api.Cloudinary.com/v1_1/stimmins/image/upload', options).then(res => {
          uuid = res.public_id;
          console.log(uuid);
          console.log(res);
        })

        if(firstName === "" || lastName === "" || username === "" || password === "" || email === "") {
          setBanner("Please complete all fields")
        } else {
          axios.post(baseURL + '/users/create_account', { firstName: firstName, lastName: lastName, username: username, password: password, email: email, candidate: cand, party: party, bio: bio}).then((res) => {
            if(profilePic) {
              axios.post(baseURL + '/storage/upload', { id: res.data.id, candidateId: res.data.candidateId, name: profilePic.name }).then((res) => {
                doLogin(username, password)
              })
            } else {
              doLogin(username, password)
            }        
          }).catch((e) => {
            if(e.response) {
              setBanner(e.response.data.message)
            }
          })
        }
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
          <div className="container">
            <div className="row justify-content-center align-items-center form-group">
                <form className="col-md-4">{form}</form>
            </div>
          </div>
      )
  }