import axios from "axios";
import {BASE_URL, MAPBOX_API_KEY} from "../constants/constants";

const transformData = (arr) => {
    for(let state of arr) {
        state["status"] = state["winner"]
    }
}

// Get Election results and data for each state given a year
// currently only supports year 2020
export const getElectionData = async(year, electionName) => {
    let states = [];
    let url = BASE_URL + '/electionData'
    await axios({
        method: 'get',
        url: url,
        params: {year, electionName}
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
    let url = BASE_URL + '/elections/candidates'
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

export const downloadCSV = async (year) => {
    let candidates = null;
    let url = BASE_URL + '/elections/candidates'
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

const getSupportedYears = async() => {
    let payload = null;
    let url = BASE_URL + '/elections/years'
    await axios({
        method: 'get',
        url: url,
    })
    .then((response) => {
            if(response.status == 200){
                payload = response.data;
            } else {
                return null;
            }
        }
    ) .catch(e => {
        payload = [];
    })
    return payload;
}

export const getUserInfo = async(id, isCandidate) => {
    let url = BASE_URL + '/userReturn';
    await axios.post(url, {ID: id, bool: isCandidate}).then((res => {
        return res.data;
    }))
}