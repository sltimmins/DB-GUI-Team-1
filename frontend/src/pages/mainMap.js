import React, { useState, useEffect, useRef, createRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {months, politicalColors} from "../test_data/test_data_objects";
import {DEMOCRAT, EC2_FRONTEND, EC2_URL, MAPBOX_API_KEY, REPUBLICAN, statusMap} from "../constants/constants";
import Button from "../components/genericButton";
import {Modal,SaveModal} from '../components/modal'
import {checkObjectEquality} from "../utils";
import {downloadCSV, getElectionCandidates, persistCustomElection} from "../api/api";

mapboxgl.accessToken = MAPBOX_API_KEY;

let stored = localStorage.getItem('jwt')

const ChangeRow = ({name, original, change, deleteAction}) => {
    return (
        <tr className={"changeTableRow"}>
            <td className={"changeTableRowName"} onClick={deleteAction}>{name}</td>
            <td className={"changeTableRowOriginal"}>{original}</td>
            <td className={"changeTableRowChange"}>{change}</td>
        </tr>
    )
}

export default function MainMap({place, polygons, affiliations, placesArray, year, candidatesPayload}){
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
            if(!map[statusMap.Democrat]){
                map[statusMap.Democrat] = 0;
            }
            if(!map[statusMap.Republican]){
                map[statusMap.Republican] = 0;
            }
            if(!map[statusMap.Green]){
                map[statusMap.Green] = 0;
            }
            if(!map[statusMap.Libertarian]){
                map[statusMap.Libertarian] = 0;
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
    const [deleteEntryModal, setDeleteEntryModal] = useState(false)
    const [locationToRemove, setLocationRemove] = useState("")
    const [saveOpenModal, setSaveOpenModal] = useState(false)
    const [saveName, setSaveName] = useState("")
    const [savedModal, setSavedModal] = useState(false)
    const [candidates, setCandidates] = useState(candidatesPayload)
    const [multiplier, setMultiplier] = useState(1)
    const [likedElection, setLikedElection] = useState(false)
    const [viewOption, setViewOption] = useState('map')
    useEffect(async() => {
        if(viewOption !== 'map') {
            return
        }
        const entry = place;
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/United%20States.json?types=country&access_token=${MAPBOX_API_KEY}`
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
                let baseNum = 1;
                for(const stateJS of polygons){
                    const calcNumID = baseNum * multiplier;
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
                    baseNum++;
                }
                setOfStates.clear();

            })
        });
    }, [viewOption, mapOfAffiliation]);


    const votingGradient = () => {
        let gradient = "linear-gradient(to right, "
        for(const key in electionNumbers) {
            gradient += politicalColors[key] + ", "
        }
        gradient = gradient.substring(0, gradient.length - 2) + ")";
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

    const saveCustomElection = async (name) => {
        console.log(name);
        let copy = copyArr(placesArray);
        for(const specificPlace of copy) {
            specificPlace.winner = mapOfAffiliation[specificPlace.state.toLowerCase()];
        }
        let wholePayload = {
            data: copy,
            name,
            year
        }
        let resp = await persistCustomElection(wholePayload);
    }

    const getInitialPlaceholder = () => {
        let currDate = new Date();
        let val = months[currDate.getMonth()-1] + " " + currDate.getDate() + ", " + currDate.getFullYear() + " " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds();
        return val;
    }

    const getTable = (data) => {
        let table = <table className={'electionTable'}>
            <thead>
                <tr>
                    <th>
                        State
                    </th>
                    <th>
                        Status
                    </th>
                    <th>
                        Election Votes
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map(e => <tr>
                        <td>
                            {e.state}
                        </td>
                        <td>
                            {mapOfAffiliation[e.state.toLowerCase()]}
                        </td>
                        <td>
                            {e.EV}
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
        return <div className={'electionTableWrapper'}><div className={'electionTableDiv'}>{table}</div></div>
    }

    return (
        <>
            <Modal open={deleteEntryModal} mainTitle={`Deleting ${locationToRemove} Change`} description={""} cancelButtonText={"Cancel"} confirmButtonText={"Confirm"}
                   confirmAction={() => {
                            let copy = JSON.parse(JSON.stringify(mapOfAffiliation))
                            copy[locationToRemove] = affiliations[locationToRemove];
                            setMapOfAffiliation(copy)
                            setDeleteEntryModal(false)
                    }}
                   cancelAction={() => {
                       setDeleteEntryModal(false)
                   }}
            />
            <SaveModal placeholder={getInitialPlaceholder()} inputLabelText={"Saved Map ID"} open={saveOpenModal} cancelAction={() => setSaveOpenModal(false)} saveAction={async (val) => {setSaveName(val); console.log(val); await saveCustomElection(val); setSaveOpenModal(false); setSavedModal(true)}}/>
            <Modal open={savedModal} mainTitle={"Share"} description={"Your changes have been saved and your custom map can be viewed in you profile. Share your custom elections"} confirmButtonText={"Share"}
                confirmAction={async() => {
                    await navigator.clipboard.writeText(`${EC2_FRONTEND}/maps/${encodeURIComponent(saveName)}/${year}`)
                    alert('Copied to clipboard!')
                }}
                   cancelAction={() => setSavedModal(false)}
            />
            <section className={"assortmentOfMaps"}>
                {place && viewOption == 'map' ?
                    [(<div className={"mapWrapper largerMap mapboxgl-map"} id={`id-${place.state}`}>
                            <div ref={(el) => ref.current = el} className={"map-container largerMap mapboxgl-map"}>

                            </div>
                            <h2>{place.state} {year} <span style={{cursor: 'pointer'}} onClick={() => setLikedElection(!likedElection)}>{ likedElection ? '❤️' : <>&#128420;</> }</span></h2>
                            <div className={'toggleDiv'}>
                                <button type={'button'} className={viewOption == 'map' ? 'activeToggle' : 'inactiveToggle'} onClick={() => {setViewOption('map')}}>Map</button><button type={'button'} className={viewOption == 'map' ? 'inactiveToggle' : 'activeToggle'} onClick={() => {setViewOption('table')}}>Table</button>
                            </div>
                        </div>)] :
                    []}
                {
                    viewOption == 'table' ?
                     <div>
                         {
                            getTable(placesArray ? placesArray : [])
                         }
                         <div className={'toggleDiv'}>
                              <h2>{place.state} {year} <span style={{cursor: 'pointer'}} onClick={() => setLikedElection(!likedElection)}>{ likedElection ? '❤️' : <>&#128420;</> }</span></h2>
                         </div>
                         <div className={'toggleDiv'}>
                            <button type={'button'} className={viewOption == 'map' ? 'activeToggle' : 'inactiveToggle'} onClick={() => {setViewOption('map')}}>Map</button><button type={'button'} className={viewOption == 'map' ? 'inactiveToggle' : 'activeToggle'} onClick={() => {setViewOption('table')}}>Table</button>
                        </div>
                     </div>: []
                }
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
                        Object.keys(electionNumbers).map((key, index) => {
                                if (electionNumbers[key] != 0) {
                                    return <div>
                                        <h5>
                                            {statusMap[key]} - {electionNumbers[key]} {"\n"}
                                            ({candidates[statusMap[key]].firstName} {candidates[statusMap[key]].lastName})
                                        </h5>
                                    </div>
                                }
                            }
                        ) : []
                    }
                </div>
                <div className={"resultDiv"}>
                    {
                    electionNumbers && candidatesPayload ?
                        Object.keys(electionNumbers).map((key, index) =>
                            <div>
                                <h5>
                                    {candidates[statusMap[key]].firstName} {candidates[statusMap[key]].lastName}
                                </h5>
                            </div>
                        ) : []
                    }
                </div>
                <div>
                    {/*<button onClick={async () => {await downloadCSV('2021')}}>download</button>*/}
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
                        <select id={"originalAffiliation"} className={"originalSelect"}  disabled={true}>
                            {/*<option value={""}></option>*/}
                            <option value={"D"}>
                                {affiliations[chosenChangeLocation]}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={"newAffiliation"}>
                            New Affiliation
                        </label>
                        <select id={"newAffiliation"} onChange={el => {setNewAffiliation(el.target.value)}} style={{borderColor: newAffiliation ? politicalColors[newAffiliation] : 'black', borderWidth: '2px'}}>
                            <option value={""}></option>
                            <option value={statusMap.Democrat}>
                                Democrat
                            </option>
                            <option value={statusMap.Republican}>
                                Republican
                            </option>
                            <option value={statusMap.Green}>
                                Green Party
                            </option>
                            <option value={statusMap.Libertarian}>
                                Libertarian Party
                            </option>
                        </select>
                    </div>
                    <div>
                        <label style={{color: 'transparent'}}>j </label>
                        <Button mainText={"Submit"} baseColor={chosenChangeLocation ? politicalColors[mapOfAffiliation[chosenChangeLocation]] : 'black'} textColor={"white"} paddingHorizontal={"9px"} paddingVertical={"6px"} fontSize={'.8rem'} disabled={(!chosenChangeLocation || !newAffiliation)}
                            onButtonClick={() => {
                                let copy = JSON.parse(JSON.stringify(electionNumbers))
                                for(const placeObj of placesArrayCopy){
                                    if(placeObj["state"].toLowerCase() == chosenChangeLocation.toLowerCase()){
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
                                                <ChangeRow name={key} original={affiliations[key]} change={mapOfAffiliation[key]} key = {"changeRow_"+key} deleteAction={() => {setLocationRemove(key); setDeleteEntryModal(true);}}/>
                                        }
                                    ) : []
                            }
                            {
                                checkObjectEquality(mapOfAffiliation, affiliations) ? <tr><td style={{textAlign: 'center'}}>No changes have been made</td></tr>
                                    :
                                <tr><td></td><td></td><td style={{textAlign: 'right', paddingRight: '1rem', paddingTop: '5px', paddingBottom: '5px'}}>
                                    <Button mainText={"Reset"} baseColor={politicalColors[REPUBLICAN]} textColor={"white"} paddingHorizontal={"9px"} paddingVertical={"6px"} fontSize={'.8rem'} disabled={(!chosenChangeLocation || !newAffiliation)}
                                        onButtonClick={() => {
                                            setMapOfAffiliation(affiliations);
                                        }}
                                    />
                                </td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <p>*Click on the location name to delete entry</p>
            </section>
            <section className={"saveButtonDiv"} style={{display: stored ? 'inline-flex' : 'none'}}>
                <Button mainText={"Save Map"} baseColor={politicalColors[DEMOCRAT]} textColor={"white"} paddingHorizontal={"15px"} paddingVertical={"12px"} fontSize={'.8rem'} disabled={(!chosenChangeLocation || !newAffiliation)}
                    onButtonClick={() => {
                        setSaveOpenModal(true)
                        // setMapOfAffiliation(affiliations);
                    }}
                />
            </section>
        </>
    );
}