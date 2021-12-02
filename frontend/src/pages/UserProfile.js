import React, { useContext, useState, useEffect } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';
import NonUserProfile from "./NonUserProfile.js";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../api/api";
import {
    useHistory,
    useLocation
  } from 'react-router-dom'


export default function UserProfile(props) {

    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    const [currUser, setCurrUser] = useState(undefined);
    const [isUser, setIsUser] = useState(true);
    const [loaded, setLoaded] = useState(false);
    var uuid = user.uuid;
    const {id, isCandidateString} = useParams();
    const isCandidate = (isCandidateString == "true");

    useEffect(() => {
        if(props.user === undefined) {
            getUserInfo(id, isCandidate);
        }
    }, [isUser])

    const getUserInfo = (id, isCandidate) => {
        axios.post(baseURL + '/userReturn', { id: id, isCandidate: isCandidate }).then((res => {
            setCurrUser(res.data);
        }))
    }

    //temp
    // currUser = user;
    // isUser = false;
    //end temp

    let history = useHistory();
    let location = useLocation();

    const redirectToLogin = () => {
        let { from } = location.state || { from: { pathname: "/login"}};
        history.replace(from);
    }

    if(!id) {
        redirectToLogin();
    }

    console.debug(user)

    if (props.user === undefined) {
        if (id == user.accountNumber && !(isCandidate && user.candidateId)) {
            console.debug("entered");
        } else if (currUser === undefined && !loaded) {
            getUserInfo(id, isCandidate);
            setIsUser(false);
            setLoaded(true);
        }
    }

    if(!currUser && !props.user) {
        return <div>Loading...</div>
    }

    var picChange = false;
    let profilePic = {};

    function handleClick() {
        const formData= new FormData();
        formData.append('file', profilePic);
        formData.append('upload_preset', 'e0s8om4e');
        const options = {
            method: "POST",
            body: formData
        };
        fetch("https://api.Cloudinary.com/v1_1/stimmins/image/upload", options);
        if (picChange) {
            axios.post(baseURL + "/storage/upload", { id: user.accountNumber, candidateId: user.candidateId, name: profilePic.name});
        }else {
            axios.post(baseURL + "/storage/upload", { id: user.accountNumber, candidateId: user.candidateId, name: uuid});
        }
        if (user.firstName != currUser.firstName) {
            axios.put(baseURL + '/user/firstname', {firstName: user.firstName, username: user.username});
        }
        if (user.lastName != currUser.lastName) {
            axios.put(baseURL + '/user/lastname', {lastName: user.lastName, username: user.username});
        }
        if (user.bio != currUser.bio) {
            axios.put(baseURL + "/user/bio", { bio: user.bio, username: user.username });
        }
        if(user.email != currUser.email) {
            axios.get(baseURL + '/user/email', { username: user.username, email: user.email })
        }
        picChange = false;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    let changeProfilePic = e => {
        picChange = true;
        profilePic = e.target.files[0];
        uuid = profilePic.name;
    }

    let imagePath = "assets/userImages/default.jpg";

    if (uuid !== undefined) {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
    }

    return (
        <div>
            <div></div> 
            {
                isUser && <div>
                    <header className="text-center bg-secondary p-3 d-static">
                        <img src={imagePath} alt="" className="rounded-circle" style={{width: "17rem", height: '17rem'}}/>                
                        <h1 className="text-white pt-2">{user.firstName + " " + user.lastName}</h1>          
                    </header>
                    <main>      
                        <div className="container my-4 bg-light rounded">
                            <form>
                                <div className="row pt-2">
                                    <div className="form-group col">
                                        <label htmlFor="fName">First Name</label>  
                                        <input type="text" id="fName" name="firstName" className="form-control p-2 text-secondary" onChange={handleChange} defaultValue={user.firstName}></input>   
                                    </div>
                                    <div className="form-group col">
                                        <label htmlFor="lName">Last Name</label>
                                        <input type="text" id="lName" name="lastName" className="form-control p-2 text-secondary" onChange={handleChange} defaultValue={user.lastName}></input>
                                    </div>
                                    <div className="form-group col">
                                        <label htmlFor="email">Email</label>
                                        <input type="text" id="email" name="email" className="form-control p-2 text-secondary" onChange={handleChange} defaultValue={user.email}></input>
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="from-group col">
                                        <label className="custom-file-label" htmlFor="imageFile">Profile picture <label htmlFor="imageFile" className="text-primary">(reload after save)</label></label>
                                        <input className="file form-control text-secondary" name="uuid" type="file" id="imageFile" name="img[]" accept="image/*" onChange={changeProfilePic}/>
                                    </div>
                                    <div className="form-group col mt-auto">
                                        <button className="btn btn-outline-primary form-control p-2" type="button" onClick={() => {window.location.pathname = '/NewPassword'}}>Set New Password</button>   
                                    </div>
                                </div>
                                <div className="row my-1">
                                    <div className="form-group">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea type="text" id="bio" name="bio" className="form-control text-secondary" maxLength="1000" onChange={handleChange} style={{minHeight: '10rem', maxHeight: '30rem'}} defaultValue={user.bio}></textarea>
                                    </div>
                                </div>
                                <div className="form-group py-3">
                                    <button className="btn btn-outline-success form-control col p-3" type="button" onClick={handleClick}>Save</button>   
                                </div>
                            </form>
                        </div>
                    </main>
                </div>    
            }
            {
                !isUser && <div>
                    <NonUserProfile user={currUser} />
                </div>
            }
        </div>
    );
}