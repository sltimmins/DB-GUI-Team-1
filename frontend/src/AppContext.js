import React, { useState } from "react";
import { axiosJWTHeader } from './utils/index.js'
import axios from "axios";

export const AppContext = React.createContext("app");

export function useProvideAppContext() {
    // ENTER YOUR EC2 PUBLIC IP/URL HERE
    const ec2_url = "";
    // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
    const ec2 = false;
    // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
    const baseURL = ec2 ? ec2_url : "http://localhost:8000";

    const [JWT, setJWT] = useState(null);
    const [user, setUser] = useState({});

    const [setup, setSetup] = useState(false);

    const signout = () => {
        localStorage.setItem('jwt', "")
    }


    return {
        user,
        setUser,

        JWT,
        setJWT,

        baseURL,

        setup,
        setSetup,

        signout
    }
}

export function setupLogin(context) {
    let stored = localStorage.getItem('jwt')
    if (stored) {
        context.setJWT(stored)
        axios
            .get(context.baseURL + "/users/webtoken", { headers: axiosJWTHeader(stored) })
            .then((res) => {
                //Set the user to the object we just got
                context.setUser(res.data[0])
                context.setSetup(true);
            }).catch(() => {
                context.setSetup(true);
            })
    } else {
        context.setSetup(true);
    }
}