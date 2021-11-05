import React, { useState, useEffect, useRef } from 'react';
import "../styles/home.css"
import Button from "../components/genericButton";
import SearchBar from "../components/searchBar";

export default function Home(){
    return (
        <>
            <main>
                <img className={"mainImage"} src={"https://s.abcnews.com/assets/dtci/elections/images/fantasymap-intro.png"}/>
                <h1 className={"main-description"}>Learn about political races and interact with maps to see how things can play out!</h1>
                <div className={"divForButton"}>
                    <div>
                        <SearchBar placeHolder={"Search for Locations"} baseColor={"white"} textColor={"black"} dropShadow={true}/>
                    </div>
                    <Button mainText={"All Maps"} baseColor={"#000"} textColor={"white"} dropShadow={true} onButtonClick={() => {window.location.href = "/maps"}}/>
                </div>
            </main>
        </>
    );
}