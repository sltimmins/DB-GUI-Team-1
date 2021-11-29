import axios from "axios";
import {MAPBOX_API_KEY} from "../constants/constants";

const transformData = (arr) => {
    for(let state of arr) {
        state["status"] = state["winner"]
    }
}

// Get Election results and data for each state given a year
// currently only supports year 2020
export const getElectionData = async(year) => {
    let states = [];
    let url = 'http://localhost:8000/electionData'
    await axios({
        method: 'get',
        url: url,
        params: {year}
    })
    .then((response) => {
            if(response.status == 200){
                states = response.data;
                transformData(states)
            } else {
                return null;
            }
        }
    ) .catch(e => {
        states = [];
    })
    return states
}

export const getElectionCandidates = async (year) => {
    let candidates = null;
    let url = 'http://localhost:8000/elections/candidates'
    await axios({
        method: 'get',
        url: url,
        params: {year}
    })
    .then((response) => {
            if(response.status == 200){
                candidates = response.data;
            } else {
                return null;
            }
        }
    ) .catch(e => {
        candidates = [];
    })
    return candidates;
}