import React, { useContext, useState } from "react";
import { AppContext } from "./../AppContext.js";


export default function UserProfile() {

    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    let firstName = user.firstName;
    let lastName = user.lastName;
    let Bio = user.bio;

    function handleClick() {
        setUser({
            firstName: firstName,
            lastName: lastName,
            bio: Bio
        });
    }

    let changeFName = e => {
        firstName = e.target.value;
    }

    let changeLName = e => {
        lastName = e.target.value;
    }

    let changeBio = e => {
        Bio = e.target.value;
    }

    return (
        <div>
            <header className="text-center bg-secondary p-3 d-static">
                <img src="https://via.placeholder.com/200" alt="" className="rounded-circle"/>                
                <h1 style={headerStyle}>{user.firstName + " " + user.lastName}</h1>          
            </header>
            <main>      
                <div className="container my-4 bg-light rounded">
                    <form>
                        <div className="row pt-2">
                            <div className="form-group col">
                                <label htmlFor="fName" className>First Name</label>  
                                <input type="text" id="fName" className="form-control p-2" onChange={changeFName} style={mRight} defaultValue={user.firstName}></input>   
                            </div>
                            <div className="form-group col">
                                <label htmlFor="lName">Last Name</label>
                                <input type="text" id="lName" className="form-control p-2" onChange={changeLName} defaultValue={user.lastName}></input>
                            </div>
                        </div>
                        <div className="row my-1">
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea type="text" id="bio" className="form-control col w-100" maxLength="1000" onChange={changeBio} style={{minHeight: '10rem'}} defaultValue={user.bio}></textarea>
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

const table = {
    display: "table"
}

const row = {
    display: "table-row"
}

const cell = {
    marginLeft: "10rem",
    display: "table-cell"
}

const center = {
    marginLeft: "auto",
    marginRight: "auto"
}

const bio  = {
    marginRight: "10rem",
    width: "30rem", 
    height: "8rem"
}

const mRight = {
    marginRight: "1rem",
}

const image = {
    borderRadius: "50%",
    margin: "2rem",
}

const btn = {
    padding: ".5rem .7rem",
    margin: "1rem"
}

const navStyle = {
    backgroundColor: "#3498db",
    padding: "1rem",
}

const headerStyle = {
    margin: "1rem 1rem",
    bottom: "10rem",
    color: "white"
}
