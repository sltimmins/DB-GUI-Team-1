import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext'
import Scroll from '../components/scroll.js'
import CandidateList from './candidateList';
import axios from 'axios';

export default function Search() {
    const [loadCandidates, setLoadCandidates] = useState(false)
    const [searchField, setSearchField] = useState("")
    const [candidatesList, setCandidatesList] = useState([]);

    const { baseURL } = useContext(AppContext);

    if(!loadCandidates) {
        axios.get(baseURL + '/users/search_user', { bool: false }).then((res) => {
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
        return (
            <Scroll>
                <CandidateList filteredCandidates={filteredCandidates} />
            </Scroll>
        )
    }



    return (
        <section>
            <div className="navy georgia ma0 grow">
                <h2 className="f2">Search for a candidate</h2>
            </div>
            <div className="pa2">
                <input className="form-control input-lg" type="search" placeholder="Search" onChange={handleChange} />
            </div>
            {searchList()}
        </section>
    )
}