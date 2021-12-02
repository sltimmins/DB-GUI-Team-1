import axios from "axios";
import {BASE_URL, MAPBOX_API_KEY} from "../constants/constants";
export const axiosJWTHeader = (jwt) => {
    return {
        Authorization: "Bearer " + jwt
    }
}

let stored = localStorage.getItem('jwt')

const transformData = (arr) => {
    for(let state of arr) {
        state["status"] = state["winner"]
    }
}

const config = {
    headers: axiosJWTHeader(stored)

}

// Get Election results and data for each state given a year
// currently only supports year 2020
export const getElectionData = async(year, name) => {
    let states = [];
    let url = BASE_URL + '/electionData'
    let specialObj = {year}
    specialObj.name = name ==  'United States' ? null : name;
    console.log(specialObj)
    await axios({
        method: 'get',
        url: url,
        params: specialObj
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

export const downloadCSV = async (year, name) => {
    let linkElem = document.createElement('a');
    linkElem.target = '_blank';
    linkElem.download = "election.csv"
    let csv = null;
    let url = BASE_URL + '/saveCSV'
    await axios({
        method: 'get',
        url: url,
        params: {year, name},
        responseType: 'blob'

    })
    .then((response) => {
            if(response.status == 200){
                csv = new Blob([response.data], {type: 'text/csv'});
                linkElem.href = URL.createObjectURL(csv);
                linkElem.click();
            } else {
                return null;
            }
        }
    ) .catch(e => {
        csv = null;
    })
    return csv;
}

export const getSupportedYears = async() => {
    let payload = null;
    let url = BASE_URL + '/customElectionYears'
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

export const persistCustomElection = async (payload) => {
    let resp = null;
    let url = BASE_URL + '/saveCustomElection'
    console.log(payload)
    await axios.put(url, payload, config)
    .then((response) => {
            if(response.status == 200){
                resp = response.data;
            } else {
                return null;
            }
        }
    ) .catch(e => {
        resp = null;
    })
    return resp;
}