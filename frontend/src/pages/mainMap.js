import React, { useState, useEffect, useRef, createRef } from 'react';
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import mapboxgl from 'mapbox-gl';
import MetaTags from 'react-meta-tags';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {placesPayload, statesGeoJSON, politicalColors, DEMOCRAT} from "../test_data/test_data_objects";
import {mapboxAPIKey} from "../constants/constants";

export default function MainMap({mapToCoordinates, place, polygons, mapOfAffiliation}){
    const ref = createRef();
    const map = useRef(null);
    const [setOfStates, setSetOfStates] = useState(new Set())
    useEffect(async() => {
        console.log("use effect")
        const entry = place;
        console.log(entry)
        await axios({
            method: 'get',
            url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=${entry.state == "United States" ? "country" : "region"}&access_token=${mapboxAPIKey}`
        })
        .then(function (response) {
            console.log(response.data)
            let newLat = response.data["features"][0]["center"][0]
            let newLng = response.data["features"][0]["center"][1]
            console.log(newLat, newLng)
            map.current = new mapboxgl.Map({
                    container: ref.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [newLat, newLng],
                    zoom: entry.state == "United States" ? 2 : 4,
                    setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                }
            );
            map.current.on('load', () => {
                console.log("Loaded")
                console.log(polygons, mapOfAffiliation)
                for(const stateJS of polygons){
                    if(setOfStates.has(stateJS.properties.NAME)){
                        return
                    }
                    setOfStates.add(stateJS.properties.NAME)
                    console.log(stateJS.geometry.coordinates)
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
            })
        });

    }, []);

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
        </>
    );
}