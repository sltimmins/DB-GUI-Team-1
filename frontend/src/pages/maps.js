import React, { useState, useEffect, useRef } from 'react';
import "../styles/home.css"
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";

export default function Maps(props){
    return (
        <>
            <script src='https://api.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.js'></script>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.css' rel='stylesheet' />
            <main>
                <div className={"divForButton"}>
                    <div>
                        <SearchBar placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true}/>
                    </div>
                    <Button mainText={"All Maps"} baseColor={"black"} textColor={"white"} dropShadow={true}/>
                </div>
            </main>
            <section>

            </section>
        </>
    );
}