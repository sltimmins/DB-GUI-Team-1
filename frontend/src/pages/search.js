import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext'
import Scroll from '../components/scroll.js'
import ProfileList from './profileList.js';
import '../styles/profileSearch.css'
import axios from 'axios';
import { DropdownButton, Dropdown } from 'react-bootstrap';

export default function Search() {

    const [favCandidates, setFavCandidates] = useState(undefined);
    const [load, setLoad] = useState(false);
    const [searchField, setSearchField] = useState("");
    const [filterParty, setFilterParty] = useState("");
    const [list, setList] = useState([]);

    const { baseURL, user } = useContext(AppContext);

    useEffect(() => {
        loadCandidates(1);
        loadFavorites();
        setLoad(true);
    }, [user])

    const loadCandidates = loadWho => { 
        axios.post(baseURL + '/users/search_user', { allUsers: loadWho }).then((res) => {
            setList(res.data);
        });
    }
    const loadFavorites = () => { 
        axios.get(baseURL + '/favorites/candidates', { params: { accountNumber: user.accountNumber } }).then((res) => {
            const favs = [];
            res.data.forEach((x, i) => favs.push(x.candidateID));
            setFavCandidates(favs);
        });
    }
    
    var filteredCandidates = [];
    if(load && user) {
        filteredCandidates = list.filter(user => {
                let name = user.firstName + " " + user.lastName;
                if(filterParty !== "") {   
                    return (
                        name.toLowerCase().includes(searchField.toLowerCase()) && user.party === filterParty
                    );
                } else {
                    return (
                        name.toLowerCase().includes(searchField.toLowerCase())
                    );
                }
            }
        );
    }

    const handleChange = e => {
        setSearchField(e.target.value);
    };

    const filter = e => {
        console.log(e)
        if(e.target.text === "All Users") {
            loadCandidates(1);
        } else if(e.target.text === "Candidates Only") {
            loadCandidates(2);
        } else if(e.target.text === "Enthusiasts Only") {
            loadCandidates(3);
        }
    }

    function searchList() {
        if(filteredCandidates.length > 0 && favCandidates) {
            return (
                <Scroll>
                    <ProfileList filteredCandidates={filteredCandidates} favoriteCandidates={favCandidates}/>
                </Scroll>
            )
        } else {
            return (
                <div class="d-flex justify-content-center">
                    <div class="alert alert-primary banner" role="alert">
                        <span>No candidates found matching the search criteria.</span>
                    </div>
                </div>
            )
        }
    }



    return (
        <section>
            <div className="d-flex justify-content-between">
                <div className="p-2">
                    <label htmlFor="searchBar" id="search" class="userSearchBar">Search:</label>
                    <input className="form-control input-lg userSearchBar" id="searchBar" type="search" placeholder="Search" onChange={handleChange} />
                </div>
                <div className="p-2 filterMargin mt-3">
                    <DropdownButton id="dropdown-item-button" title="Filter:" size="lg" variant="secondary">
                        <DropdownButton id="dropdown-item-button" title="User Type" size="lg" variant="transparent" drop="start">
                            <Dropdown.Item onClick={ event => filter(event) }>All Users</Dropdown.Item>
                            <Dropdown.Item onClick={ event => filter(event) }>Candidates Only</Dropdown.Item>
                            <Dropdown.Item onClick={ event => filter(event) }>Enthusiasts Only</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="dropdown-item-button" title="Party" size="lg" variant="transparent" drop="start">
                            <Dropdown.Item onClick={ event => setFilterParty("") }>All Parties</Dropdown.Item>
                            <Dropdown.Item onClick={ event => setFilterParty("Republican") }>Republican</Dropdown.Item>
                            <Dropdown.Item onClick={ event => setFilterParty("Democrat") }>Democrat</Dropdown.Item>
                            <Dropdown.Item onClick={ event => setFilterParty("Independent") }>Independent</Dropdown.Item>
                            <Dropdown.Item onClick={ event => setFilterParty("Green") }>Green</Dropdown.Item>
                        </DropdownButton>
                    </DropdownButton>
                </div>
            </div>
            {searchList()}
        </section>
    )
}