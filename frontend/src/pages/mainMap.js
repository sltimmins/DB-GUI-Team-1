import React, { useState, useEffect, useRef, createRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {politicalColors} from "../test_data/test_data_objects";
import {mapboxAPIKey} from "../constants/constants";
import Button from "../components/genericButton";

mapboxgl.accessToken = mapboxAPIKey;

const statusMap = {
    "D" : "Democrat",
    "R" : "Republican",
}

const ChangeRow = ({name, original, change}) => {
    return (
        <tr className={"changeTableRow"}>
            <td className={"changeTableRowName"}><span className={"deleteEntry"}>-</span>{name}</td>
            <td className={"changeTableRowOriginal"}>{original}</td>
            <td className={"changeTableRowChange"}>{change}</td>
        </tr>
    )
}

export default function MainMap({place, polygons, affiliations, placesArray}){
    const copyArr = (source) => {
        return JSON.parse(JSON.stringify(source))
    }
    const [placesArrayCopy, setPlacesArrayCopy] = useState(copyArr(placesArray))
    const getElectoralVotes = () => {
        if(placesArrayCopy){
            let map = {}
            for(const placeObj of placesArrayCopy){
                if(placeObj["EV"]){
                    map[placeObj["status"]] = map[placeObj["status"]] ? map[placeObj["status"]] + placeObj["EV"] : placeObj["EV"]
                }
            }
            return map;
        } else {
            return null
        }
        return null;
    }

    const [mapOfAffiliation, setMapOfAffiliation] = useState(copyArr(affiliations))
    const ref = useRef(createRef());
    const map = useRef(null);
    const [setOfStates, setSetOfStates] = useState(new Set())
    const [electionNumbers, setElectionNumbers] = useState(getElectoralVotes())
    const [chosenChangeLocation, setChosenChangeLocation] = useState("")
    const [newAffiliation, setNewAffiliation] = useState("")
    useEffect(async() => {
        const entry = place;
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=${entry.state === "United States" ? "country" : "region"}&access_token=${mapboxAPIKey}`
        })
        .then(function (response) {
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            map.current = new mapboxgl.Map({
                    container: ref.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [newLat, newLng],
                    zoom: entry.state === "United States" ? 2 : 4,
                }
            );
            map.current.on('load', () => {
                for(const stateJS of polygons){
                    if(setOfStates.has(stateJS.properties.NAME)){
                        return
                    }
                    setOfStates.add(stateJS.properties.NAME)
                    map.current.addSource(stateJS.properties.NAME.toLowerCase(), {
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
                    map.current.addLayer({
                        'id': stateJS.properties.NAME.toLowerCase(),
                        'type': 'fill',
                        'source': stateJS.properties.NAME.toLowerCase(), // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': politicalColors[mapOfAffiliation ? mapOfAffiliation[stateJS.properties.NAME.toLowerCase()] : "white"], // blue color fill
                            'fill-opacity': 0.5
                        }
                    });
                }
                setOfStates.clear()
            })
        });
    });

    const checkObjectEquality = (obj1, obj2) => {
        for(const key in obj1) {
            if(obj1[key] != obj2[key])
                return false
        }
        return true
    }

    const votingGradient = () => {
        let gradient = "linear-gradient(to right, "
        for(const key in electionNumbers) {
            gradient += politicalColors[key] + ", "
        }
        gradient = gradient.substring(0, gradient.length - 2) + ")";
        console.log(gradient)
        return gradient;
    }

    const getWinner = () => {
        let max = [-Infinity, ""];
        for(const prop in electionNumbers){
            if(electionNumbers[prop] > max[0]) {
                max = [electionNumbers[prop], prop]
            }
        }
        return max;
    }

    return (
        <>
            <section className={"assortmentOfMaps"}>
                {place ?
                    [(<div className={"mapWrapper largerMap mapboxgl-map"} id={`id-${place.state}`}>
                            <div ref={(el) => ref.current = el} className={"map-container largerMap mapboxgl-map"}>

                            </div>
                            <h2>{place.state}</h2>
                        </div>)] :
                    []}
            </section>
            <section>
                <section className={"votingBarContainer"}>
                    <h3>
                        Winner: {statusMap[getWinner()[1]]}
                    </h3>
                    <div className={"votingBar"} style={{background: votingGradient()}}>

                    </div>
                </section>
                <div className={"resultDiv"}>
                    {
                    electionNumbers ?
                        Object.keys(electionNumbers).map((key, index) =>
                            <div>
                                <h5>
                                    {statusMap[key]} - {electionNumbers[key]}
                                </h5>
                            </div>
                        ) : []
                    }
                </div>
            </section>
            <section className={"changeAffiliationSectionContainer"}>
                <div>
                    <h3>
                        Make changes to your map!
                    </h3>
                </div>
                <section className={"changeAffiliationSection"}>
                    <div>
                        <label htmlFor={"locationAffiliation"}>
                            Location
                        </label>
                        <select id={"locationAffiliation"} onChange={(el) => {setChosenChangeLocation(el.target.value)}}>
                            <option value={""}></option>
                        {
                            mapOfAffiliation ?
                                Object.keys(mapOfAffiliation).map((key, index) =>
                                <option value={key} key={"option_"+key}>
                                    {key}
                                </option>
                            ) : []
                        }
                        </select>
                    </div>
                    <div>
                        <label htmlFor={"originalAffiliation"}>
                            Original Affiliation
                        </label>
                        <select id={"originalAffiliation"} className={"originalSelect"} style={{borderColor: chosenChangeLocation ? politicalColors[affiliations[chosenChangeLocation]] : 'black'}} value={affiliations[chosenChangeLocation]}>
                            <option value={""}></option>
                            <option value={"D"}>
                                Democrat
                            </option>
                            <option value={"R"}>
                                Republican
                            </option>
                            <option value={"G"}>
                                Green Party
                            </option>
                            <option value={"L"}>
                                Libertarian Party
                            </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={"newAffiliation"}>
                            New Affiliation
                        </label>
                        <select id={"newAffiliation"} onChange={el => {setNewAffiliation(el.target.value)}} style={{borderColor: newAffiliation ? politicalColors[newAffiliation] : 'black', borderWidth: '2px'}}>
                            <option value={""}></option>
                            <option value={"D"}>
                                Democrat
                            </option>
                            <option value={"R"}>
                                Republican
                            </option>
                            <option value={"G"}>
                                Green Party
                            </option>
                            <option value={"L"}>
                                Libertarian Party
                            </option>
                        </select>
                    </div>
                    <div>
                        <label style={{color: 'transparent'}}>j </label>
                        <Button mainText={"Submit"} baseColor={chosenChangeLocation ? politicalColors[mapOfAffiliation[chosenChangeLocation]] : 'black'} textColor={"white"} paddingHorizontal={"9px"} paddingVertical={"6px"} fontSize={'10pt'} disabled={(!chosenChangeLocation || !newAffiliation)}
                            onButtonClick={() => {
                                let copy = JSON.parse(JSON.stringify(electionNumbers))
                                for(const placeObj of placesArrayCopy){
                                    if(placeObj["state"].toLowerCase() == chosenChangeLocation.toLowerCase()){
                                        console.log(mapOfAffiliation[chosenChangeLocation], placeObj["EV"], copy)
                                        copy[mapOfAffiliation[chosenChangeLocation]] -= placeObj["EV"]
                                        copy[newAffiliation] += placeObj["EV"]
                                    }
                                }
                                setElectionNumbers(copy)
                                copy = JSON.parse(JSON.stringify(mapOfAffiliation))
                                copy[chosenChangeLocation] = newAffiliation;
                                setMapOfAffiliation(copy);
                            }}
                        />
                    </div>
                </section>
            </section>
            <section className={"tableDiv"}>
                <div className={"tableWrapper"}>
                    <table className={"changeTable"}>
                        <thead>
                            <tr className={"changeTableRow headRow"}>
                                <th className={"changeTableRowName"}>
                                    Location
                                </th>
                                <th className={"changeTableRowOriginal"}>
                                    Original Affiliation
                                </th>
                                <th className={"changeTableRowChange"}>
                                    Change Affiliation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mapOfAffiliation ?
                                    Object.keys(mapOfAffiliation).map((key, index) =>
                                        {
                                            return (mapOfAffiliation[key] == affiliations[key]) ? [] :
                                                <ChangeRow name={key} original={affiliations[key]} change={mapOfAffiliation[key]} key = {"changeRow_"+key}/>
                                        }
                                    ) : []
                            }
                            {
                                checkObjectEquality(mapOfAffiliation, affiliations) ? <tr><td>No changes have been made</td></tr> : []
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}