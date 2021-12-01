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
import {MAPBOX_API_KEY} from "../constants/constants";
import {getElectionCandidates, getElectionData} from "../api/api";
import { useParams } from "react-router-dom";
import {transformArr} from "../utils";
mapboxgl.accessToken = MAPBOX_API_KEY;


export default function Maps(){
    let refs = useRef(placesPayload.map(() => createRef()));
    let maps = useRef(placesPayload.map(() => createRef()));
    const {mapID, queryYear} = useParams();
    const [zoom] = useState(4);
    const [placesCopy, setPlacesCopy] = useState(placesPayload);
    const [setOfStates] = useState(new Set());
    const [currentlyLoading, setCurrentlyLoading] = useState(false);
    const [mapToCoordinates, setMapToCoordinates] = useState({});
    const [mainMapPayload, setMainMapPayload] = useState(null);
    const [retrievedPayload, setRetrievedPayload] = useState(null);
    const [chosenYear, setChosenYear] = useState(queryYear ? queryYear : 2020);
    const [yearOptions, setYearOptions] = useState([]);
    const [candidates, setCandidates] = useState(null)
    const arrToMap = (arr) => {
        let mapOfNames = new Set();
        for(const place of arr) {
            mapOfNames.add(place.state);
        }
        return mapOfNames;
    }
    const [placeSelection, setPlaceSelection] = useState(arrToMap(placesPayload))
    useEffect(async() => {
        console.log(mapID)
        setCurrentlyLoading(true)
        let res = await getElectionData(queryYear ? chosenYear : null, queryYear ? null : mapID);
        setRetrievedPayload(res);
        setPlaceSelection(arrToMap(res))
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/United%20States.json?types=country&access_token=${MAPBOX_API_KEY}`
        })
        .then(function (response) {
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            let copy = JSON.parse(JSON.stringify(mapToCoordinates))
            copy[mapID ? mapID : 'United States'] = [newLat, newLng];
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
                    renderMap(entry)
                }
            })
            setPlacesCopy([{"state": mapID ? mapID : 'United States'}]);
        });
        setChosenYear(chosenYear)
        // if(mapID == "United States"){
        //     console.log("United States")
        //     await handleAllSelection()
        // }
        setCurrentlyLoading(false)

    }, [chosenYear]);

    useEffect(async () => {
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${mapID ? mapID : 'United%20States'}.json?types=country&access_token=${MAPBOX_API_KEY}`
        })
        .then(function (response) {
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            let copy = JSON.parse(JSON.stringify(mapToCoordinates))
            copy[mapID ? mapID : 'United States'] = [newLat, newLng];
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
                    renderMap(entry)
                }
            })
            setPlacesCopy([{"state": mapID ? mapID : 'United States'}]);
        });
        setChosenYear(chosenYear)
    }, [retrievedPayload])

    useEffect(async() => {

    })

    const isCountry = (name) => {
        return name == 'United States';
    }

    const getCandidates = async () => {
        let payload = await getElectionCandidates(chosenYear ? chosenYear : 2020);
        let transformedPayload = {};
        if (payload) {
            for(let obj of payload) {
                transformedPayload[obj.party] = obj;
            }
            console.log(transformedPayload)
        }
        return transformedPayload;
    }

    const renderMap = (entry) => {
        for(const stateJS of statesGeoJSON){
            let stateName = stateJS.properties.NAME;
            if(entry.state === stateName) {
                maps.current[0].addSource(entry.state.toLowerCase(), {
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
                maps.current[0].addLayer({
                    'id': entry.state.toLowerCase(),
                    'type': 'fill',
                    'source': entry.state.toLowerCase(), // reference the data source
                    'layout': {},
                    'paint': {
                        'fill-color': politicalColors[entry.status], // blue color fill
                        'fill-opacity': 0.5
                    }
                });
            }
        }
        setCandidates("Hello")
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
        setChosenYear(chosenYear)
    }

    const handleYearSelection = (newYear) => {
        setChosenYear(newYear)
    }

    return (
        <>
            <Loader loading={currentlyLoading}/>
            {
                !mainMapPayload ? (
                    <>
                        <main className={"mapMain"}>
                            <div className={"divForButton"}>
                                <div>
                                    <SearchBar routes={retrievedPayload ? transformArr(retrievedPayload) : transformArr(placesCopy)} placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true} onChangeFunc={val => handleSelection(val.target.value)}/>
                                </div>
                            </div>
                            <div className={"yearDiv"}>
                                <label htmlFor={"yearSelector"}>Election Year: </label>
                                <select id={"yearSelector"} onChange={(el => {
                                    handleYearSelection(el.target.value)
                                })}>
                                    {
                                        yearOptions.length == 0 ? <option value={2020}>2020</option> : yearOptions.map(opt => (<option value={opt}>opt</option>))
                                    }
                                </select>
                            </div>
                            <div className={"divForButton"} id={"USButton"}>
                                {/*<Button mainText={"United States"} baseColor={"black"} textColor={"white"} fontWeight={700} onButtonClick={() => {handleAllSelection()}}/>*/}
                            </div>
                        </main>
                        <section className={"assortmentOfMaps"}>

                            {placesCopy.map((el, i) => (mapID && i < 1) || (!mapID) ? (
                                    <div className={"mapWrapper "+(placesCopy.length === 1 ? "largerMap mapboxgl-map" : "")} id={`id-${el.state}`} key={"mainDiv "+el.state}>
                                        <div ref={(el) => refs.current[i] = el} className={"map-container "+(placesCopy.length === 1 ? "largerMap mapboxgl-map" : "")}>

                                        </div>
                                        <h2 style={{marginBottom: '1rem'}}>{el.state} {chosenYear}</h2>
                                        <div className={"exploreMapButton"}>
                                            <Button mainText={"Explore Map"} baseColor={"#232323"}
                                                onButtonClick={async() => {
                                                    setCurrentlyLoading(true)
                                                    if (el.state === "United States") {
                                                        let polygons = [];
                                                        let mapOfAffiliation = {};
                                                        let setOfStateNames = new Set();
                                                        for(let entry of retrievedPayload){
                                                            setOfStateNames.add(entry.state.toLowerCase())
                                                            mapOfAffiliation[entry.state.toLowerCase()] = entry.status;
                                                        }
                                                        for(const stateJS of statesGeoJSON) {
                                                            if(setOfStateNames.has(stateJS.properties.NAME.toLowerCase())) {
                                                                polygons.push(stateJS)
                                                            }
                                                        }
                                                        setMainMapPayload({
                                                            mapToCoordinates : mapToCoordinates,
                                                            place: el,
                                                            polygons: polygons,
                                                            mapOfAffiliation: mapOfAffiliation,
                                                            candidatesPayload: await getCandidates(),
                                                        })
                                                        setCurrentlyLoading(false)
                                                    } else {
                                                        let polygons = [];
                                                        await getCandidates();
                                                        let mapOfAffiliation = {
                                                            [el.state.toLowerCase()]: el.status
                                                        };
                                                        for(const stateJS of statesGeoJSON) {
                                                            if(stateJS.properties.NAME.toLowerCase() === el.state.toLowerCase()) {
                                                                polygons.push(stateJS)
                                                            }
                                                        }
                                                        setMainMapPayload({
                                                            mapToCoordinates : mapToCoordinates,
                                                            place: el,
                                                            polygons: polygons,
                                                            mapOfAffiliation: mapOfAffiliation,
                                                            candidatesPayload: await getCandidates(),
                                                        })
                                                        setCurrentlyLoading(false)
                                                    }
                                                }}
                                            />
                                        </div>
                                        {
                                            placesCopy.length == 1 ? (
                                                <></>
                                            ) : []

                                        }
                                    </div>

                                ) : []
                            )}
                        </section>
                    </>
                ) : <MainMap mapToCoordinates={mainMapPayload.mapToCoordinates} place={mainMapPayload.place} polygons={mainMapPayload.polygons} affiliations={mainMapPayload.mapOfAffiliation} placesArray={retrievedPayload} candidatesPayload={mainMapPayload.candidatesPayload} year={chosenYear}/>
            }
        </>
    );
}