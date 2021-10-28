import React, { useState, useEffect, useRef, createRef } from 'react';
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import mapboxgl from 'mapbox-gl';
import MetaTags from 'react-meta-tags';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/maps.css"
import axios from "axios";
import {placesPayload} from "../test_data/test_data_objects";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA';

export default function Maps(props){
    const refs = useRef(placesPayload.map(() => createRef()));
    const mapContainers = useRef(new Array());
    const [renderElems, setRenderElems] = useState([<div ref={(elem) => mapContainers.current.push(elem)} className={"map-container"}></div>]);
    const maps = useRef(placesPayload.map(() => createRef()));
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(4);
    const [placesCopy, setplacesCopy] = useState(placesPayload)
    const arrToMap = () => {
        let mapOfNames = new Set();
        for(const place of placesPayload) {
            mapOfNames.add(place.state);
        }
        return mapOfNames;
    }
    const [placeselection, setplaceselection] = useState(arrToMap())
    useEffect(async() => {
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
                console.log(newLat, newLng)
                maps.current[i] = new mapboxgl.Map({
                        container: refs.current[i],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: zoom,
                        setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                    }
                );
                const poliColors = ["#ff2233", "#0055cc"];
                for(let x = .1; x < 1; x += .1){
                    const marker = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat+x, newLng+x])
                    .addTo(maps.current[i]);
                    const marker2 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat-x, newLng-x])
                    .addTo(maps.current[i]);
                    const marker3 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat+x, newLng-x])
                    .addTo(maps.current[i]);
                    const marker4 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat-x, newLng+x])
                    .addTo(maps.current[i]);
                }
            });
        }
    });

    const handleSelection = async(val) => {
        console.log(val)
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
                maps.current[0] = new mapboxgl.Map({
                        container: refs.current[0],
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLat, newLng],
                        zoom: zoom,
                        setPaintProperty: ('region', 'fill-color', 'rgb(255, 0, 0)')
                    }
                );
                const poliColors = ["#ff2233", "#0055cc"];
                for(let x = .1; x < 1; x += .1){
                    const marker = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat+x, newLng+x])
                    .addTo(maps.current[0]);
                    const marker2 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat-x, newLng-x])
                    .addTo(maps.current[0]);
                    const marker3 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat+x, newLng-x])
                    .addTo(maps.current[0]);
                    const marker4 = new mapboxgl.Marker({
                        color: poliColors[Math.floor(Math.random() * 2)],
                        draggable: false
                    }).setLngLat([newLat-x, newLng+x])
                    .addTo(maps.current[0]);
                }
                setplacesCopy([{"state": val}]);
            });
        }
    }

    (()=>{console.log(process.env.MAPBOX_ACCESS_TOKEN)})();

    const transformArr = () => {
        let newArr = [];
        for(const elem of placesPayload) {
            newArr.push({name: elem.state, href: '/'})
        }
        return newArr;
    }

    return (
        <>
            <main className={"mapMain"}>
                <div className={"divForButton"}>
                    <div>
                        <SearchBar routes={transformArr()} placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true} onChangeFunc={val => handleSelection(val.target.value)}/>
                    </div>
                </div>
            </main>
            <section className={"assortmentOfMaps"}>
                {placesCopy.map((el, i) => (
                        <div className={"mapWrapper"}><div ref={(el) => refs.current[i] = el} className={"map-container"}></div><h2>{el.state}</h2></div>
                    )
                )}
            </section>
        </>
    );
}