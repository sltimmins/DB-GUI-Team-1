import React, { useState, useEffect, useRef, createRef } from 'react';
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {placesPayload, statesGeoJSON, politicalColors} from "../test_data/test_data_objects";
import Loader from "../components/loader";
import MainMap from "./mainMap";
import {MAPBOX_API_KEY, statusMap} from "../constants/constants";
import {getElectionData} from "../api/api";
import { useLocation } from "react-router-dom";
import {checkObjectEquality, transformArr} from "../utils";
mapboxgl.accessToken = MAPBOX_API_KEY;

class MapData {
    constructor(location, year) {
        this.location = location;
        this.year = year;
    }
}

// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const CompareMaps = () => {
    let query = useQuery();
    let refs = useRef([createRef(), createRef()]);
    let maps = useRef([createRef(), createRef()]);
    const yearOne = query.get("yearOne")
    const yearTwo = query.get("yearTwo")
    const locationOne = query.get("locationOne")
    const locationTwo = query.get("locationTwo")
    const [zoom] = useState(4);
    const [placesCopy, setPlacesCopy] = useState([{"state" : locationOne, "year" : yearOne}, {"state" : locationTwo, "year" : yearTwo}])
    const [setOfStates] = useState(new Set())
    const [currentlyLoading, setCurrentlyLoading] = useState(false)
    const [mapToCoordinates, setMapToCoordinates] = useState({})
    const [mainMapPayload, setMainMapPayload] = useState(null)
    const [retrievedPayload, setRetrievedPayload] = useState(null)
    const [yearOptions, setYearOptions] = useState([])
    const [selections, setSelections] = useState([])
    const [chosenYear, setChosenYear] = useState(2020)
    const [currentLocation, setCurrentLocation] = useState("")
    const getElectoralVotes = () => {
        let mainArr = []
        if(retrievedPayload){
            for(let innerPayload of retrievedPayload){
                let map = {}
                for(const placeObj of innerPayload){
                    if(placeObj["EV"]){
                        map[placeObj["status"]] = map[placeObj["status"]] ? map[placeObj["status"]] + placeObj["EV"] : placeObj["EV"]
                    }
                }
                mainArr.push(map)
            }
            return mainArr;
        } else {
            return null
        }
        return null;
    }
    const [electionNumbers, setElectionNumbers] = useState(getElectoralVotes())
    const arrToMap = (arr) => {
        let mapOfNames = new Set();
        for(const place of arr) {
            mapOfNames.add(place.state);
        }
        return mapOfNames;
    }
    const [placeSelection, setPlaceSelection] = useState(arrToMap(placesPayload))
    useEffect(async() => {
        if(!(yearOne && yearTwo && locationOne && locationTwo))
            return
        setCurrentlyLoading(true)
        let res1 = await getElectionData(parseInt(yearOne));
        let res2 = await getElectionData(parseInt(yearTwo));
        console.log([res1, res2])
        setRetrievedPayload([res1, res2])
        setPlaceSelection(arrToMap(res1))
        for(let i = 0; i < placesCopy.length; i++){
            const entry = placesCopy[i];
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=country&access_token=${MAPBOX_API_KEY}`
            })
            .then(function (response) {
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                let copy = JSON.parse(JSON.stringify(mapToCoordinates))
                copy[entry.state] = [newLat, newLng];
                setMapToCoordinates(copy)
                maps.current[i] = new mapboxgl.Map({
                        container: refs.current[i],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: 2,
                    }
                );
                maps.current[i].on('load', () => {
                    for (let entry of (retrievedPayload ? retrievedPayload[i] : placesPayload)) {
                        console.log(retrievedPayload)
                        // renderMap(entry, i)
                    }
                })
            });
        }
        setCurrentlyLoading(false)

    }, []);

    useEffect(async() => {
        if(!(yearOne && yearTwo && locationOne && locationTwo))
            return
        setCurrentlyLoading(true)
        for(let i = 0; i < placesCopy.length; i++){
            const entry = placesCopy[i];
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=country&access_token=${MAPBOX_API_KEY}`
            })
            .then(function (response) {
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                let copy = JSON.parse(JSON.stringify(mapToCoordinates))
                copy[entry.state] = [newLat, newLng];
                setMapToCoordinates(copy)
                maps.current[i] = new mapboxgl.Map({
                        container: refs.current[i],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: 2,
                    }
                );
                maps.current[i].on('load', () => {
                    for (let entry of (retrievedPayload ? retrievedPayload[i] : placesPayload)) {
                        console.log(retrievedPayload)
                        renderMap(entry, i)
                    }
                })
            });
        }
        setCurrentlyLoading(false)
        setElectionNumbers(getElectoralVotes())
    }, [retrievedPayload]);

    const getWinner = (i) => {
        let max = [-Infinity, ""];
        if(!electionNumbers){
            return []
        }
        for(const prop in electionNumbers[i]){
            if(electionNumbers[i][prop] > max[0]) {
                max = [electionNumbers[i][prop], prop]
            }
        }
        return max;
    }

    const votingGradient = (i) => {
        let gradient = "linear-gradient(to right, "
        if(!electionNumbers){
            return ""
        }
        for(const key in electionNumbers[i]) {
            gradient += politicalColors[key] + ", "
        }
        gradient = gradient.substring(0, gradient.length - 2) + ")";
        return gradient;
    }

    const renderMap = (entry, index) => {
        for(const stateJS of statesGeoJSON){
            let stateName = stateJS.properties.NAME;
            if(entry.state === stateName) {
                maps.current[index].addSource(entry.state.toLowerCase()+index, {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'geometry': {
                            'type': stateJS.geometry.type,
                            // These coordinates outline Maine.
                            'coordinates': stateJS.geometry.coordinates,
                        }
                    }
                });
                // Add a new layer to visualize the polygon.
                maps.current[index].addLayer({
                    'id': entry.state.toLowerCase()+index,
                    'type': 'fill',
                    'source': entry.state.toLowerCase()+index, // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': politicalColors[entry.status], // blue color fill
                        'fill-opacity': 0.5
                    }
                });
            }
        }
    }

    const handleSelection = async(val) => {
        let entry = null;
        for(const stateObj of (retrievedPayload ? retrievedPayload : placesPayload)){
            if(stateObj.state === val){
                entry = stateObj
            }
        }
        if(placeSelection.has(val)){
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?types=region&access_token=${MAPBOX_API_KEY}`
            })
            .then(function (response) {
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                maps.current[0] = new mapboxgl.Map({
                        container: refs.current[0],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: 4,
                    }
                );
                maps.current[0].on('load', () => {
                    renderMap(entry)
                })
                setPlacesCopy([entry]);
            });
        }
    }

    const handleAllSelection = async() => {
        const val = "United States"
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?types=country&access_token=${MAPBOX_API_KEY}`
        })
        .then(function (response) {
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            let copy = JSON.parse(JSON.stringify(mapToCoordinates))
            copy[val] = [newLat, newLng];
            setMapToCoordinates(copy)
            maps.current[0] = new mapboxgl.Map({
                    container: refs.current[0],
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [newLat, newLng],
                    zoom: 2,
                }
            );
            maps.current[0].on('load', () => {
                for(let entry of (retrievedPayload ? retrievedPayload : placesPayload)){
                    console.log("load")
                    renderMap(entry)
                }
            })
            setPlacesCopy([{"state": val}]);
        });
    }

    return (
        <>
            <Loader loading={currentlyLoading}/>
            {
                (yearOne && yearTwo && locationOne && locationTwo) ? (
                    <>
                        <main className={"assortmentOfMaps"}>

                            {placesCopy.map((el, i) => (
                                    <div className={"mapWrapper "+(placesCopy.length === 1 ? "largerMap mapboxgl-map" : "")} id={`id-${el.state}`} key={"mainDiv "+el.state + i}>
                                        <div ref={(el) => refs.current[i] = el} className={"map-container "+(placesCopy.length === 1 ? "largerMap mapboxgl-map" : "")}>

                                        </div>
                                        <h2 style={{marginBottom: '1rem'}}>{el.state} {i == 0 ? yearOne : yearTwo}</h2>
                                        <section>
                                            <section className={"votingBarContainer"}>
                                                <h3>
                                                    Winner: {retrievedPayload ? statusMap[getWinner(i)[1]] : ""}
                                                </h3>
                                                <div className={"votingBar"} style={{background: retrievedPayload ? votingGradient(i) : "none"}}>

                                                </div>
                                            </section>
                                            <div className={"resultDiv"}>
                                                {
                                                electionNumbers ?
                                                    Object.keys(electionNumbers[i]).map((key, index) =>
                                                        <div>
                                                            <h5>
                                                                {statusMap[key]} - { retrievedPayload ? electionNumbers[i][key] : ""}
                                                            </h5>
                                                        </div>
                                                    ) : []
                                                }
                                            </div>
                                        </section>
                                    </div>
                                )
                            )}
                        </main>
                    </>
                )
                    :
                    (
                        <main className={"mapMain"}>
                            <div className={"divForButton"}>
                                <div>
                                    <SearchBar routes={[{name: "United States", href: '/'}]} placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true} onChangeFunc={val => setCurrentLocation(val.target.value)}/>
                                </div>
                            </div>
                            <div className={"yearDiv"}>
                                {
                                    selections.map((mapData, i) => (
                                        <>
                                            <span key={"selection"+i} className={"pill"} onClick={() => {
                                                setSelections(selections.filter(el => !checkObjectEquality(el, mapData)))
                                            }}>{mapData.location} {mapData.year}</span>
                                        </>
                                    ))
                                }
                            </div>
                            <div className={"yearDiv"}>
                                <label htmlFor={"yearSelector"}>Election Year: </label>
                                <select id={"yearSelector"} style={{marginRight: "1rem"}} onChange={(el => {
                                    setChosenYear(el.target.value)
                                })}>
                                    {
                                        yearOptions.length == 0 ? <option value={2020}>2020</option> : yearOptions.map(opt => (<option value={opt}>opt</option>))
                                    }
                                </select>
                                <Button mainText={"Add"} baseColor={"#148614"} fontSize={".8rem"} textColor={"white"} fontWeight={700} paddingVertical={".3rem"} paddingHorizontal={"1rem"} onButtonClick={() => {
                                    if(selections.length < 2) {
                                        let copy = JSON.parse(JSON.stringify(selections))
                                        let newObj = new MapData(currentLocation, chosenYear);
                                        if(selections.length == 0 || (selections.length > 0 && !checkObjectEquality(newObj, selections[0]))) {
                                            copy.push(newObj);
                                            setSelections(copy)
                                        }
                                    }
                                }}/>
                            </div>
                            <div className={"divForButton"} id={"USButton"}>
                                <Button mainText={"See Maps"} baseColor={"black"} textColor={"white"} fontWeight={700} onButtonClick={() => {
                                    if(selections.length == 2) {
                                        window.location.href = `/maps/compare?yearOne=${selections[0].year}&locationOne=${selections[0].location}&yearTwo=${selections[1].year}&locationTwo=${selections[1].location}`
                                    }
                                }}/>
                            </div>
                        </main>
                    )
            }
        </>
    );
}

export default CompareMaps;