import React, { useState, useEffect, useRef, createRef } from 'react';
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import mapboxgl from 'mapbox-gl';
import MetaTags from 'react-meta-tags';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {placesPayload, statesGeoJSON, politicalColors, DEMOCRAT} from "../test_data/test_data_objects";
import Loader from "../components/loader";
import MainMap from "./mainMap";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA';

export default function Maps(props){
    const refs = useRef(placesPayload.map(() => createRef()));
    const maps = useRef(placesPayload.map(() => createRef()));
    const [zoom, setZoom] = useState(4);
    const [placesCopy, setPlacesCopy] = useState(placesPayload)
    const [setOfStates, setSetOfStates] = useState(new Set())
    const [currentlyLoading, setCurrentlyLoading] = useState(false)
    const [mapToCoordinates, setMapToCoordinates] = useState({})
    const [showMainMap, setShowMainMap] = useState(false)
    const [mainMapPayload, setMainMapPayload] = useState(null)
    const arrToMap = () => {
        let mapOfNames = new Set();
        for(const place of placesPayload) {
            mapOfNames.add(place.state);
        }
        return mapOfNames;
    }
    const [placeselection, setplaceselection] = useState(arrToMap())
    useEffect(async() => {
        console.log("use effect")
        setCurrentlyLoading(true)
        for(let i = 0; i < placesCopy.length; i++){
            const entry = placesCopy[i];
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=region&access_token=pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA`
            })
            .then(function (response) {
                console.log(refs)
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                let copy = JSON.parse(JSON.stringify(mapToCoordinates))
                console.log(copy)
                copy[entry.state] = [newLat, newLng];
                setMapToCoordinates(copy)
                console.log(newLat, newLng, entry)
                maps.current[i] = new mapboxgl.Map({
                        container: refs.current[i],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: zoom,
                        setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                    }
                );
                maps.current[i].on('load', () => {
                    console.log("Loaded")
                    for(const stateJS of statesGeoJSON){
                        let stateName = stateJS.properties.NAME;
                        if(entry.state == stateName) {
                            if(setOfStates.has(entry.state)){
                                return
                            }
                            setOfStates.add(entry.state)
                            console.log(stateJS.geometry.coordinates)
                            maps.current[i].addSource(entry.state.toLowerCase(), {
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
                            maps.current[i].addLayer({
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
                })
            });

        }
        setCurrentlyLoading(false)

    }, []);

    const renderMap = (entry) => {
        for(const stateJS of statesGeoJSON){
            let stateName = stateJS.properties.NAME;
            if(entry.state == stateName) {
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
    }

    const handleSelection = async(val) => {
        console.log(val)
        let entry = null;
        for(const stateObj of placesPayload){
            if(stateObj.state == val){
                entry = stateObj
            }
        }
        if(placeselection.has(val)){
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?types=region&access_token=pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA`
            })
            .then(function (response) {
                console.log(refs)
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                console.log(newLat, newLng)
                setZoom(2);
                maps.current[0] = new mapboxgl.Map({
                        container: refs.current[0],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: zoom,
                        setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                    }
                );
                maps.current[0].on('load', () => {
                    console.log("Loaded")
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
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?types=country&access_token=pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA`
        })
        .then(function (response) {
            console.log(refs)
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            let copy = JSON.parse(JSON.stringify(mapToCoordinates))
            copy[val] = [newLat, newLng];
            setMapToCoordinates(copy)
            console.log(mapToCoordinates)
            maps.current[0] = new mapboxgl.Map({
                    container: refs.current[0],
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [newLat, newLng],
                    zoom: 2,
                    setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                }
            );
            maps.current[0].on('load', () => {
                console.log("Loaded")
                for(let entry of placesPayload){
                    renderMap(entry)
                }
            })
            setPlacesCopy([{"state": val}]);
        });
    }

    const transformArr = () => {
        let newArr = [];
        for(const elem of placesPayload) {
            newArr.push({name: elem.state, href: '/'})
        }
        return newArr;
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
                                    <SearchBar routes={transformArr()} placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true} onChangeFunc={val => handleSelection(val.target.value)}/>
                                </div>
                            </div>
                            <div className={"divForButton"} id={"USButton"}>
                                <Button mainText={"United States"} baseColor={"black"} textColor={"white"} fontWeight={700} onButtonClick={() => {handleAllSelection()}} gradient={"linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1) , rgba(0, 0, 255, 1) , rgba(0, 0, 255, 0))"}/>
                            </div>
                        </main>
                        <section className={"assortmentOfMaps"}>

                            {placesCopy.map((el, i) => (
                                    <div className={"mapWrapper "+(placesCopy.length == 1 ? "largerMap mapboxgl-map" : "")} id={`id-${el.state}`}>
                                        <div ref={(el) => refs.current[i] = el} className={"map-container "+(placesCopy.length == 1 ? "largerMap mapboxgl-map" : "")}>

                                        </div>
                                        <h2>{el.state}</h2>
                                        <div className={"exploreMapButton"}>
                                            <Button mainText={"Explore Map"} baseColor={"#232323"}
                                                onButtonClick={() => {
                                                    setCurrentlyLoading(true)
                                                    if (el.state == "United States") {
                                                        let polygons = [];
                                                        let mapOfAffiliation = {};
                                                        let setOfStateNames = new Set();
                                                        for(let entry of placesPayload){
                                                            setOfStateNames.add(entry.state.toLowerCase())
                                                            mapOfAffiliation[entry.state.toLowerCase()] = entry.status;
                                                        }
                                                        for(const stateJS of statesGeoJSON) {
                                                            if(setOfStateNames.has(stateJS.properties.NAME.toLowerCase())) {
                                                                polygons.push(stateJS)
                                                                console.log(mapOfAffiliation)
                                                            }
                                                        }
                                                        setMainMapPayload({
                                                            mapToCoordinates : mapToCoordinates,
                                                            place: el,
                                                            polygons: polygons,
                                                            mapOfAffiliation: mapOfAffiliation
                                                        })
                                                        console.log({
                                                            mapToCoordinates : mapToCoordinates,
                                                            place: el,
                                                            polygons: polygons,
                                                            mapOfAffiliation: mapOfAffiliation
                                                        })
                                                        setCurrentlyLoading(false)
                                                    } else {
                                                        let polygons = [];
                                                        let mapOfAffiliation = {
                                                            [el.state.toLowerCase()]: el.status
                                                        };
                                                        for(const stateJS of statesGeoJSON) {
                                                            if(stateJS.properties.NAME.toLowerCase() == el.state.toLowerCase()) {
                                                                polygons.push(stateJS)
                                                            }
                                                        }
                                                        setMainMapPayload({
                                                            mapToCoordinates : mapToCoordinates,
                                                            place: el,
                                                            polygons: polygons,
                                                            mapOfAffiliation: mapOfAffiliation
                                                        })
                                                        setCurrentlyLoading(false)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </section>
                    </>
                ) : <MainMap mapToCoordinates={mainMapPayload.mapToCoordinates} place={mainMapPayload.place} polygons={mainMapPayload.polygons} mapOfAffiliation={mainMapPayload.mapOfAffiliation}/>
            }
        </>
    );
}