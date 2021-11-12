import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext'
import Scroll from '../components/scroll.js'
import ProfileList from './profileList.js';
import '../styles/profileSearch.css'
import axios from 'axios';

export default function Search() {

    const [load, setLoad] = useState(false);
    const [searchField, setSearchField] = useState("")
    const [list, setList] = useState([]);

    const { baseURL } = useContext(AppContext);

    const loadCandidates = loadWho => { 
        axios.post(baseURL + '/users/search_user', { allUsers: loadWho }).then((res) => {
            setList(res.data);
        });
    }

    if(!load) {
        loadCandidates(1);
        setLoad(true);
    }

    const filteredCandidates = list.filter(candidate => {
            let name = candidate.firstName + " " + candidate.lastName;    
            return (
                name.toLowerCase().includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = e => {
        setSearchField(e.target.value);
    };

    const filter = e => {
        if(e.target.value === "All users") {
            loadCandidates(1);
        } else if(e.target.value === "Candidates only") {
            loadCandidates(2);
        } else if(e.target.value === "Enthusiasts only") {
            loadCandidates(3);
        }
    }

    function searchList() {
        if(filteredCandidates.length > 0) {
            return (
                <Scroll>
                    <ProfileList filteredCandidates={filteredCandidates} />
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
                <div className="p-2 filterMargin">
                    <label htmlFor="candidateFilter" id="filter">Filter:</label>
                    <select id="candidateFilter" className="user" className="form-control" onChange={filter}>
                        <option>All users</option>
                        <option>Candidates only</option>
                        <option>Enthusiasts only</option>
                    </select>
                </div>
            </div>
            {searchList()}
        </section>
    )
}