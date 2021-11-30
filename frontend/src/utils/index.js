import axios from "axios";
import {MAPBOX_API_KEY} from "../constants/constants";
import mapboxgl from "mapbox-gl";
import {politicalColors, statesGeoJSON} from "../test_data/test_data_objects";

export const axiosJWTHeader = (jwt) => {
    return {
        Authorization: "Bearer " + jwt
    }
}

export const transformArr = (arr) => {
    let newArr = [];
    for(const elem of arr) {
        newArr.push({name: elem.state, href: '/'})
    }
    return newArr;
}

export const checkObjectEquality = (obj1, obj2) => {
    for(const key in obj1) {
        if(obj1[key] != obj2[key])
            return false
    }
    return true
}

////// CODE FOR SUPPORTING STATE RENDERING IN MAP
// for(let i = 0; i < placesCopy.length; i++){
//             const entry = placesCopy[i];
//             if(mapID && entry.state != mapID) {
//                 continue;
//             } else if (mapID) {
//                 i = 0
//             }
//             await axios({
//                 method: 'get',
//                 url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${entry.state}.json?types=${isCountry ? 'country' : 'region'}&access_token=${MAPBOX_API_KEY}`
//             })
//             .then(function (response) {
//                 let newLat = response.data["features"][0]["center"][0]
//                 let newLng = response.data["features"][0]["center"][1]
//                 let copy = JSON.parse(JSON.stringify(mapToCoordinates))
//                 copy[entry.state] = [newLat, newLng];
//                 setMapToCoordinates(copy)
//                 maps.current[i] = new mapboxgl.Map({
//                         container: refs.current[i],
//                         style: 'mapbox://styles/mapbox/streets-v11',
//                         center: [newLat, newLng],
//                         zoom: zoom,
//                     }
//                 );
//                 maps.current[i].on('load', () => {
//                     for(const stateJS of statesGeoJSON){
//                         let stateName = stateJS.properties.NAME;
//                         if(entry.state === stateName) {
//                             if(setOfStates.has(entry.state)){
//                                 return
//                             }
//                             setOfStates.add(entry.state)
//                             maps.current[i].addSource(entry.state.toLowerCase(), {
//                                 'type': 'geojson',
//                                 'data': {
//                                     'type': 'Feature',
//                                     'geometry': {
//                                         'type': stateJS.geometry.type,
//                                         // These coordinates outline the state.
//                                         'coordinates': stateJS.geometry.coordinates,
//                                     }
//                                 }
//                             });
//                             // Add a new layer to visualize the polygon.
//                             maps.current[i].addLayer({
//                                 'id': entry.state.toLowerCase(),
//                                 'type': 'fill',
//                                 'source': entry.state.toLowerCase(), // reference the data source
//                                 'layout': {},
//                                 'paint': {
//                                     'fill-color': politicalColors[entry.status], // blue color fill
//                                     'fill-opacity': 0.5
//                                 }
//                             });
//                         }
//
//                     }
//                 })
//             });
//             if (mapID) {
//                 break;
//             }
//         }