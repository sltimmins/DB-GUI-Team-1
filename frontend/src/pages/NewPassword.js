import React, { useContext, useState, useEffect } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function NewPassword(props) {
    const [state, setState] = useState({ firstPswrd: "", secPswrd: "", same: false, wasClicked: false });
    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };
    const {isCand, setIsCand} = useState(false);
    
    useEffect(() => {
        if(user.candidateId) {
            setIsCand(true);
        }
    }, [user])

    function handleClick() {
        setState({...state, wasClicked: true});
        if (state.firstPswrd == state.secPswrd && state.firstPswrd != '') {
            axios.put(baseURL + '/user/changePassword', {password: state.firstPswrd, username: user.username});
            setState({firstPswrd: "", secPswrd: "", same: true, wasClicked: true});
        }else if (state.same != false) {
            setState({...state, same: false});
        }
    }

    return(
        <div>
            <div className="container rounded my-4">
                <Link to={'/UserProfile/' + (user.candidateId || user.accountNumber) + '/' + isCand}>
                    <div className="float-left py-4 mx-1" style={{width: "10rem"}}>
                        <button className="btn btn-outline-primary form-control p-2">Return to Profile</button>                       
                    </div>
                </Link>
                <div className="text-center">
                    <h1>Create New Password</h1>
                </div>
                <form>
                    <div className="form-group pb-5">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" onChange={handleChange} name="firstPswrd" className="form-control" value={state.firstPswrd}/>
                    </div>
                    <div className="form-group pb-5">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" onChange={handleChange} name="secPswrd" className="form-control" value={state.secPswrd}/>
                    </div>
                    <div className="form-group pb-5">
                        <button type="button" className="btn btn-outline-success form-control" onClick={handleClick}>Save</ button>
                    </div>
                    <div></div>
                    {
                        state.same && <div>
                            <h3 className="text-success text-center pb-5">Saved</h3>
                        </div>
                    }
                    {
                        !state.same && state.wasClicked && state.firstPswrd == '' && <div>
                            <h3 className="text-danger text-center pb-5">Password cannot be blank</h3>
                        </div>
                    }
                    {
                        !state.same && state.wasClicked && state.firstPswrd != '' && <div>
                            <h3 className="text-danger text-center pb-5">Passwords do not match</h3>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
}