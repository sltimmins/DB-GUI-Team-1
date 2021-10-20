// import closeUp from '/images/closeUp.JPG'
import React, { useState } from 'react';
import '../styles/searchBar.css';

const SearchBar = ({baseColor, placeHolder, textColor, width, height, fontSize, fontWeight, dropShadow}) => {
    const calcFontColor = () => {
        if(baseColor.length==4){
            baseColor+= baseColor.substring(1, 4);
        }
        let decimal = parseInt(baseColor.substring(1, baseColor.length), 16);
        let darkBoundary = parseInt("777777", 16)
        console.log(decimal, darkBoundary, baseColor)
        if(darkBoundary < decimal){
            return "black"
        } else {
            return "white"
        }
    }
    const setStyles = () => {
        let initialStyles = {
            backgroundColor: baseColor,
            color: textColor
        }
        if(width){
            initialStyles.width = width;
        }
        if(height){
            initialStyles.height = height;
        }
        if(fontSize){
            initialStyles.fontSize = fontSize;
        }
        if(fontWeight){
            initialStyles.fontWeight = fontWeight;
        }
        if(!dropShadow){
            initialStyles.filter = "drop-shadow(0 0 0 white)"
        }
        return initialStyles;
    }
    const [fontColor, setFontColor] = useState(textColor ? textColor : calcFontColor())
    const [dynamicStyles, setDynamicStyles] = useState(setStyles())

    return (
        <input className={"searchBar"} style={dynamicStyles} type={"text"} placeholder={placeHolder}></input>
    );
  };


export default SearchBar;