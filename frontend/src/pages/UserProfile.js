import React, { useContext, useState } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';


export default function UserProfile() {

    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
  
    let firstName = user.firstName;
    let lastName = user.lastName;
    let Bio = user.bio;
    let profilePic = {};

    function handleClick() {
        const formData= new FormData();
        console.log(profilePic);
        formData.append('file', profilePic);
        formData.append('upload_preset', 'e0s8om4e');
        const options = {
            method: "POST",
            body: formData
        };

        fetch("https://api.Cloudinary.com/v1_1/stimmins/image/upload", options);
        axios.post(baseURL + "/storage/upload", { id: user.accountNumber, candidateId: user.candidateId, name: profilePic.name });
        axios.post()
        setUser({
            firstName: firstName,
            lastName: lastName,
            bio: Bio,
            uuid: profilePic.name
        });
    }

    const handleInputChange =(e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    let changeProfilePic = e => {
        profilePic = e.target.files[0];
    }

    let uuid = "";
    if (user.uuid != null) {
        uuid = user.uuid;
    }
    let imagePath = "assets/userImages/default.jpg";

    if (uuid != "") {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + uuid;
    }

    return (
        <div>
            <header className="text-center bg-secondary p-3 d-static">
                <img src={imagePath} alt="" className="rounded-circle" style={{width: "17rem", height: '17rem'}}/>                
                <h1 className="text-white pt-2">{user.firstName + " " + user.lastName}</h1>          
            </header>
            <main>      
                <div className="container my-4 bg-light rounded">
                    <form>
                        <div className="row pt-2">
                            <div className="from-group col">
                                <label className="custom-file-label" htmlFor="imageFile">Profile picture</label>
                                <input className="file form-control" type="file" id="imageFile" name="img[]" accept="image/*" onChange={changeProfilePic}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="form-group col">
                                <label htmlFor="fName">First Name</label>  
                                <input type="text" id="fName" className="form-control p-2" onChange={handleInputChange} defaultValue={user.firstName}></input>   
                            </div>
                            <div className="form-group col">
                                <label htmlFor="lName">Last Name</label>
                                <input type="text" id="lName" className="form-control p-2" onChange={handleInputChange} defaultValue={user.lastName}></input>
                            </div>
                        </div>
                        <div className="row my-1">
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea type="text" id="bio" className="form-control col w-100" maxLength="1000" onChange={handleInputChange} style={{minHeight: '10rem', maxHeight: '30rem'}} defaultValue={user.bio}></textarea>
                            </div>
                        </div>
                        <div className="form-group py-3">
                            <button className="btn btn-outline-success form-control col p-3" type="button" onClick={handleClick}>Save</button>   
                        </div>
                    </form>
                </div>
            </main>
        </div>    
    );
}

const headerStyle = {
    margin: "1rem 1rem",
    bottom: "10rem",
    color: "white"
}