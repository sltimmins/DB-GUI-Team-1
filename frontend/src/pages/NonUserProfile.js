import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext, useProvideAppContext } from "./../AppContext.js";
import axios from 'axios';
import { Collapse } from "bootstrap";
import { loadFavorites } from './search.js'; 

export default function NonUserProfile(props) {
    const { setUser, user, setJWT, JWT, baseURL } = useContext(AppContext);
    var [toggle, setToggle] = useState(false, false, false);
    var [toggleTwo, setToggleTwo] = useState(false);
    var [toggleThree, setToggleThree] = useState(false);
    const [favCandidates, setFavCandidates] = useState(undefined);
    let candidates = [];
    const [list, setList] = useState([]);
    const [loaded, setLoaded] = useState(false);


    const loadFavorites = async() => { 
        await axios.get(baseURL + '/favorites/candidates', { params: { accountNumber: user.accountNumber } }).then(({res}) => {
            const favs = [];
            res.data.forEach((x, i) => favs.push(x.candidateID));
            setFavCandidates(favs);
        });
    }

    const isFirstRender = useRef(true);

    useEffect(() => {

        // await axios.get

    }, []);

    const loadCandidates = async(loadWho) => { 
        await axios.post(baseURL + '/users/search_user', { allUsers: loadWho }).then((res) => {
            setList(res.data);
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


    let favElects; //axios.get(baseURL + '/favorites/elections', props.user).data;
    let custElects; //axios.get(baseURL + '/customElections', props.user).data;
    let imagePath;
    if(!props.user[0].uuid) {
        imagePath = "assets/userImages/default.jpg";
    }else {
        imagePath = "https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + props.user[0].uuid;
    }

    if(loaded) {
        console.debug(favCandidates);
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
                        <div>
                            <label htmlFor="currUserBio">Bio</label>
                            <p id="currUserBio" className="border ">{props.user[0].bio}</p> 
                        
                        </div>
                        <div></div>
                        {
                            props.user[0].candidateId && <div></div>
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
                                        <ul className="list-group" style={{listStyleType: "none"}} id="list"></ul>
                                        {
                                            favCandidates && loaded && favCandidates.map(cand => {
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