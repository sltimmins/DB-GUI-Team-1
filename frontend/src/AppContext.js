import React, { useState } from "react";
import { axiosJWTHeader } from './utils/index.js'
import axios from "axios";
import {EC2_URL, EC2, BASE_URL} from './constants/constants'
export const AppContext = React.createContext("app");

export function useProvideAppContext() {


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

        baseURL: BASE_URL,

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