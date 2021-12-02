import React, { useContext, useEffect, useState, useRef, isValidElement } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';
import { Collapse } from "bootstrap";
import { Link } from 'react-router-dom';

export default function NonUserProfile(props) {
    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    var [toggle, setToggle] = useState(false, false, false);
    var [toggleTwo, setToggleTwo] = useState(false);
    var [toggleThree, setToggleThree] = useState(false);
    const [favCandidates, setFavCandidates] = useState(undefined);
    const [list, setList] = useState([]);
    const [elects, setElects] = useState([]);
    const [custElects, setCustElects] = useState([]);

    useEffect(() => {
        loadCandidates(2);
        loadFavCandidates();
        loadFavElections();
        loadCustElections();
    }, [user]);

    const loadCandidates = async(loadWho) => { 
        await axios.post(baseURL + '/users/search_user', { allUsers: loadWho }).then((res) => {
            setList(res.data);
        });
    }

    const loadFavElections = async() => {
        await axios.get(baseURL + '/favorites/elections', {accountNumber: props.user[0].accountNumber}).then((res) => {
            const elections = [];
            res.data.forEach((x, i) => elections.push(
                <li key={i} className="list-unstyled text-secondary my-2 text-decoration-none">USA {x.year}</li>
            ))
            setElects(elections);
        })
    }

    const loadCustElections = async() => {
        await axios.get(baseURL + '/customElections', { params: {username: props.user[0].username} }).then((res) => {
            const custElections = [];
            res.data.forEach((x, i) => custElections.push(
                <li key={i} className="list-unstyled text-secondary my-2 text-decoration-none">{x.data}</li>
            ))
            setCustElects(custElections);
        })
    }

    const loadFavCandidates = async() => { 
        await axios.get(baseURL + '/favorites/candidates', { params: { accountNumber: props.user[0].accountNumber } }).then((res) => {
            const favs = [];
            res.data.forEach((x, i) => favs.push(
                <li className="list-unstyled text-primary my-2 text-decoration-none" key={i} target="_blank" onClick={() => {
                    window.location.pathname = '/UserProfile/' + x.candidateID + '/true';
                }}>Candidate ID Number: {x.candidateID}</li>  
            ));
            setFavCandidates(favs);
        });
    }

    useEffect(() => {
        if(!props.user[0].candidateId) {
            var myCollapse = document.getElementById('favCands');
            var bsCollapse = new Collapse(myCollapse, {toggle: toggle[0]});
            toggle ? bsCollapse.show() : bsCollapse.hide();
        }
    })

    useEffect(() => {
        if(!props.user[0].candidateId) {
            var myCollapse = document.getElementById('favElects');
            var bsCollapse = new Collapse(myCollapse, {toggle: toggle[1]});
            toggleTwo ? bsCollapse.show() : bsCollapse.hide();
        }
    })

    useEffect(() => {
        if(!props.user[0].candidateId) {
            var myCollapse = document.getElementById('custElects');
            var bsCollapse = new Collapse(myCollapse, {toggle: toggle[2]});
            toggleThree ? bsCollapse.show() : bsCollapse.hide();
        }
    })

    let imagePath;
    if(!props.user[0].uuid) {
        imagePath = "assets/userImages/default.jpg";
    }else {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + props.user[0].uuid;
    }
    
    return(
        <div>
            <header className="text-center bg-secondary p-3 d-static">
                <img src={imagePath} alt="" className="rounded-circle" style={{width: "17rem", height: '17rem'}}/>                
                <h1 className="text-white pt-2">{props.user[0].firstName + " " + props.user[0].lastName}</h1>          
            </header>
            <main>
                <div className="container my-4 bg-light rounded">
                    <div className="row p-3">
                        <div className="my-2">
                            <label htmlFor="currUserBio">Bio</label>
                            <p id="currUserBio" className="container border text-secondary my-2">{props.user[0].bio ? props.user[0].bio : 'User has no bio.'}</p> 
                        
                        </div>
                        <div></div>
                        {
                            props.user[0].candidateId && <div>
                                <label htmlFor="party">Political Party</label>
                                <p id="party" className="container border text-secondary my-2">{props.user[0].party ? props.user[0].party : 'No Party Affiliation.'}</p> 
                            </div>
                        }
                        {
                            !props.user[0].candidateId && <div>
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
                                        <ul className="list-group mt-2" id="list"></ul>
                                        {
                                            favCandidates && favCandidates.length > 0 && <div>{favCandidates}</div>
                                        }
                                        {
                                            !favCandidates || favCandidates.length == 0 && <li className="my-2 text-decoration-none list-unstyled">No Favorite Candidates</li>
                                        }
                                    </div>
                                </div>
                                <div className="collapse" id="favElects">
                                    <div className="card card-body mt-3">
                                        <label htmlFor="list" className="font-weight-bold">Favorite Elections</label>
                                        <ul className="list-group mt-2" id="list"></ul>
                                        {
                                            elects && elects.length > 0 && <div>{elects}</div>
                                        }
                                        {
                                            !elects || elects.length == 0 && <li className="my-2 text-decoration-none list-unstyled">No Favorite Elections</li>
                                        }
                                    </div>
                                </div>
                                <div className="collapse" id="custElects">
                                    <div className="card card-body mt-3">
                                        <label htmlFor="list" className="font-weight-bold">Custom Elections</label>
                                        <ul className="list-group mt-2" id="list"></ul>
                                        {
                                            custElects && custElects.length > 0 && <div>{custElects}</div>
                                        }
                                        {
                                            !custElects || custElects.length == 0 && <li className="my-2 text-decoration-none list-unstyled">No Custom Elections</li>
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