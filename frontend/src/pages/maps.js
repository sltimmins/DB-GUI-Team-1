import React, { useState, useEffect, useRef, createRef } from 'react';
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import mapboxgl from 'mapbox-gl';
import MetaTags from 'react-meta-tags';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA';

const coordinates = [{"state": "Texas"}, {"state": "California"}];

export default function Maps(props){
    const refs = useRef(coordinates.map(() => createRef()));
    const mapContainers = useRef(new Array());
    const [renderElems, setRenderElems] = useState([<div ref={(elem) => mapContainers.current.push(elem)} className={"map-container"}></div>]);
    const maps = useRef(coordinates.map(() => createRef()));
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(4);
    useEffect(async() => {
        for(let i = 0; i < coordinates.length; i++){
            const entry = coordinates[i];
            await axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=region&access_token=pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA`
            })
            .then(function (response) {
                console.log(refs)
                let newLat = response.data["features"][0]["center"][0]
                let newLng = response.data["features"][0]["center"][1]
                console.log(newLat, newLng)
                maps.current[i] = new mapboxgl.Map({
                        container: refs.current[i],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: zoom
                    }
                );
            });
        }
    });
    (()=>{console.log(process.env.MAPBOX_ACCESS_TOKEN)})();
    return (
        <>
            <main className={"mapMain"}>
                <div className={"divForButton"}>
                    <div>
                        <SearchBar placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true}/>
                    </div>
                </div>
            </main>
            <section className={"assortmentOfMaps"}>
                {coordinates.map((el, i) => (
                        <div className={"mapWrapper"}><div ref={(el) => refs.current[i] = el} className={"map-container"}></div><h2>{el.state}</h2></div>
                    )
                )}
            </section>
        </>
    );
}