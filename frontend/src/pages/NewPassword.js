import axios from "axios";
import React, { useState } from 'react';

export default function NewPassword(props) {
    const [state, setState] = useState({ firstPswrd: "", secPswrd: "", same: false, wasClicked: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    function handleClick() {
        setState({...state, wasClicked: true});
        if (state.firstPswrd == state.secPswrd && state.firstPswrd != '') {
            setState({firstPswrd: "", secPswrd: "", same: true, wasClicked: true});
        }else if (state.same != false) {
            setState({...state, same: false});
        }
    }

    return(
        <div>
            <div className="container rounded my-4">
                <div className="float-left py-4 mx-1" style={{width: "10rem"}}>
                    <button className="btn btn-outline-primary form-control p-2" onClick={() => {window.location.pathname = '/UserProfile'}}>Return to Profile</button>                       
                </div>
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