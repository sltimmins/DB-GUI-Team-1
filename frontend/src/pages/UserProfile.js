import React, { useContext, useState, useEffect } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';
import NonUserProfile from "./NonUserProfile.js";


export default function UserProfile(props) {

    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    var currUser = user;
    var isUser = true;
    var uuid = user.uuid;

    const [state, setState] = useState({});

    //temp
    // isUser = false;
    //end temp

    var picChange = false;
    let profilePic = {};

    function updatePic() {
        if (uuid != undefined) {
            imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
        }
    }

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
        if (state.firstName != currUser.firstName) {
            axios.put(baseURL + '/user/firstname', {firstName: state.firstName, username: state.username});
        }
        if (state.lastName != currUser.lastName) {
            axios.put(baseURL + '/user/lastname', {lastName: state.lastName, username: state.username});
        }
        if (state.bio != currUser.bio) {
            axios.put(baseURL + "/user/bio", { bio: state.bio, username: state.username });
        }
        picChange = false;

        setUser(state);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    let changeProfilePic = e => {
        picChange = true;
        profilePic = e.target.files[0];
        uuid = profilePic.name;
    }

    let imagePath = "assets/userImages/default.jpg";

    if (uuid != undefined) {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
    }

    useEffect(() => {
        setState(currUser);
    }, [currUser]);

    useEffect(() => {
        if (props.user != undefined) {
            uuid = currUser.uuid;
        }
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
    }, [uuid, imagePath]);

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
                                    <div className="from-group col">
                                        <label className="custom-file-label" htmlFor="imageFile">Profile picture <label htmlFor="imageFile" className="text-primary">(reload after save)</label></label>
                                        <input className="file form-control text-secondary" name="uuid" type="file" id="imageFile" name="img[]" accept="image/*" onChange={changeProfilePic}/>
                                    </div>
                                    <div className="form-group col mt-auto">
                                        <button className="btn btn-outline-primary form-control p-2" type="button" onClick={() => {window.location.pathname = '/NewPassword'}}>Set New Password</button>   
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="form-group col">
                                        <label htmlFor="fName">First Name</label>  
                                        <input type="text" id="fName" name="firstName" className="form-control p-2 text-secondary" onChange={handleChange} defaultValue={user.firstName}></input>   
                                    </div>
                                    <div className="form-group col">
                                        <label htmlFor="lName">Last Name</label>
                                        <input type="text" id="lName" name="lastName" className="form-control p-2 text-secondary" onChange={handleChange} defaultValue={user.lastName}></input>
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