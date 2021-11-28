import React, { useContext, useEffect, useState } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';
import { Collapse } from "bootstrap";

export default function NonUserProfile(props) {
    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    var [toggle, setToggle] = useState(false, false, false);
    var [toggleTwo, setToggleTwo] = useState(false);
    var [toggleThree, setToggleThree] = useState(false);

    useEffect(() => {
        var myCollapse = document.getElementById('favCands');
        var bsCollapse = new Collapse(myCollapse, {toggle: toggle[0]});
        toggle ? bsCollapse.show() : bsCollapse.hide();
    })

    useEffect(() => {
        var myCollapse = document.getElementById('favElects');
        var bsCollapse = new Collapse(myCollapse, {toggle: toggle[1]});
        toggleTwo ? bsCollapse.show() : bsCollapse.hide();
    })

    useEffect(() => {
        var myCollapse = document.getElementById('custElects');
        var bsCollapse = new Collapse(myCollapse, {toggle: toggle[2]});
        toggleThree ? bsCollapse.show() : bsCollapse.hide();
    })

    let favCands = axios.get(baseURL + '/favorites/candidates', props.user).data;
    let favElects; //axios.get(baseURL + '/favorites/elections', props.user).data;
    let custElects; //axios.get(baseURL + '/customElections', props.user).data;
    let imagePath;
    if(props.user.uuid == undefined) {
        imagePath = "assets/userImages/default.jpg";
    }else {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + props.user.uuid;
    }

    return(
        <div>
            <header className="text-center bg-secondary p-3 d-static">
                <img src={imagePath} alt="" className="rounded-circle" style={{width: "17rem", height: '17rem'}}/>                
                <h1 className="text-white pt-2">{props.user.firstName + " " + props.user.lastName}</h1>          
            </header>
            <main>
                <div className="container my-4 bg-light rounded">
                    <div className="row p-3">
                        <div>
                            <label htmlFor="currUserBio">Bio</label>
                            <p id="currUserBio" className="border ">This is my current bio!</p> 
                        
                        </div>
                        <div></div>
                        {
                            props.user.candidateId && <div></div>
                        }
                        {
                            !props.user.candidateId && <div>
                                <div className="btn-group d-flex" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" className="btn-check btn-lg w-100" type="text" name="btnradio" id="btnradio1" autoComplete="off" onClick={() => {
                                        setToggle(toggle => !toggle);
                                    }}/>
                                    <label className="btn btn-outline-primary " htmlFor="btnradio1">Favorite Candidates</label>

                                    <input type="radio" className="btn-check btn-lg w-100" type="text" name="btnradio" id="btnradio2" autoComplete="off" onClick={() => {
                                    setToggleTwo(toggleTwo => !toggleTwo);
                                    }} />
                                    <label className="btn btn-outline-primary" htmlFor="btnradio2">Favorite Elections</label>

                                    <input type="radio" className="btn-check btn-lg w-100" type="text" name="btnradio" id="btnradio3" autoComplete="off" onClick={() => {
                                        setToggleThree(toggleThree => !toggleThree);
                                    }} />
                                    <label className="btn btn-outline-primary" htmlFor="btnradio3">Custom Election</label>
                                </div>


                                <div className="collapse" id="favCands">
                                    <div className="card card-body mt-3">
                                        <label htmlFor="list" className="font-weight-bold">Favorite Candidates</label>
                                        <ul className="list-group" style={{listStyleType: "none"}} id="list"></ul>
                                        {
                                            favCands && favCands.map(cand => {
                                                <li className="list-group-item">{cand.firstName} {cand.listName}</li>
                                            })
                                        }
                                        {
                                            <li>No Favorite Candidates</li>
                                        }
                                    </div>
                                </div>
                                <div className="collapse" id="favElects">
                                    <div className="card card-body mt-3">
                                        <label htmlFor="list" className="font-weight-bold">Favorite Elections</label>
                                        <ul className="list-group" style={{listStyleType: "none"}} id="list"></ul>
                                        {
                                            favElects && favElects.map(elect => {
                                                <li className="list-group-item">{elect.electionID}</li>
                                            })
                                        }
                                        {
                                            <li>No Favorite Elections</li>
                                        }
                                    </div>
                                </div>
                                <div className="collapse" id="custElects">
                                    <div className="card card-body mt-3">
                                        <label htmlFor="list" className="font-weight-bold">Custom Elections</label>
                                        <ul className="list-group" style={{listStyleType: "none"}} id="list"></ul>
                                        {
                                            custElects && custElects.map(elect => {
                                                <li className="list-group-item">{elect}</li>
                                            })
                                        }
                                        {
                                            <li>No Custom Elections</li>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}