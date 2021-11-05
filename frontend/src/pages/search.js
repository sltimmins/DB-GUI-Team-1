import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext'
import Scroll from '../components/scroll.js'
import CandidateList from './candidateList';
import '../styles/candidateSearch.css'
import axios from 'axios';

export default function Search() {
    const [loadCandidates, setLoadCandidates] = useState(false)
    const [searchField, setSearchField] = useState("")
    const [candidatesList, setCandidatesList] = useState([]);

    const { baseURL } = useContext(AppContext);

    if(!loadCandidates) {
        axios.get(baseURL + '/users/search_user', { bool: false }).then((res) => {
            console.log(res.data)
            setCandidatesList(res.data);
        });
        setLoadCandidates(true);
    }

    const filteredCandidates = candidatesList.filter(candidate => {
            let name = candidate.firstName + " " + candidate.lastName;    
            return (
                name.toLowerCase().includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = e => {
        setSearchField(e.target.value);
    };

    function searchList() {
        if(filteredCandidates.length > 0) {
            return (
                <Scroll>
                    <CandidateList filteredCandidates={filteredCandidates} />
                </Scroll>
            )
        } else {
            return (
                <div class="center">
                    <div class="alert alert-primary banner" role="alert">
                        <span>No candidates found matching the search criteria.</span>
                    </div>
                </div>
            )
        }
    }



    return (
        <section>
            <div id="candidateSearchBox">
                <h2 id="title">Search:</h2>
                <input className="form-control input-lg" id="candidateSearchBar" type="search" placeholder="Search" onChange={handleChange} />
            </div>
            {searchList()}
        </section>
    )
}