import React, { useState, useEffect, useRef } from 'react';
import "../styles/home.css"
import Button from "../components/genericButton";

export default function Home(props){
    return (
        <>
            <main>
                <img className={"mainImage"} src={"https://s.abcnews.com/assets/dtci/elections/images/fantasymap-intro.png"}/>
                <h1 className={"main-description"}>Learn about political races and interact with maps to see how things can play out!</h1>
                <div className={"divForButton"}>
                    <Button mainText={"Maps"} baseColor={"black"} textColor={"white"}/>
                </div>
            </main>
        </>
    );
}