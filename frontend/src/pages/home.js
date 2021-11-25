import React, {useEffect, useState} from 'react';
import "../styles/home.css"
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";
import {getElectionData} from "../api/api";
import {transformArr} from "../utils";
import {placesPayload} from "../test_data/test_data_objects";

export default function Home(){
    const [retrievedPayload, setRetrievedPayload] = useState(null)
    const [placesCopy, setPlacesCopy] = useState(placesPayload)
    useEffect(async() => {
        let res = await getElectionData(2020);
        setRetrievedPayload(res);
    }, [])
    return (
        <>
            <main>
                <img className={"mainImage"} src={"https://s.abcnews.com/assets/dtci/elections/images/fantasymap-intro.png"}/>
                <h1 className={"main-description"}>Learn about political races and interact with maps to see how things can play out!</h1>
                <div className={"divForButton"}>
                    <div>
                        <SearchBar routes={retrievedPayload ? transformArr(retrievedPayload) : transformArr(placesCopy)} placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true}/>
                    </div>
                    <Button mainText={"All Maps"} baseColor={"#000"} textColor={"white"} dropShadow={true} onButtonClick={() => {window.location.href = "/maps"}}/>
                </div>
            </main>
        </>
    );
}