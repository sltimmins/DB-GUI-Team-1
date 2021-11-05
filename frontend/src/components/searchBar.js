// import closeUp from '/images/closeUp.JPG'
import React, { useState } from 'react';
import '../styles/searchBar.css';
const classOptions = ["options", "inactive"];
const SearchBar = ({baseColor, placeHolder, textColor, width, height, fontSize, fontWeight, dropShadow, routes, onChangeFunc}) => {
    const calcFontColor = () => {
        if(baseColor.length==4){
            baseColor+= baseColor.substring(1, 4);
        }
        let decimal = parseInt(baseColor.substring(1, baseColor.length), 16);
        let darkBoundary = parseInt("777777", 16)
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
    const getRoutes = () => {
        if (!Array.isArray(routes)) {
            return [];
        }
        let elems = [];
        for (const route of routes) {
            elems.push(
                <option value={route.name} onClick={() => document.location.href = route.href}></option>
            );
        }
        return elems
    }
    const [fontColor, setFontColor] = useState(textColor ? textColor : calcFontColor())
    const [dynamicStyles, setDynamicStyles] = useState(setStyles())
    const [routeElems, setRouteElems] = useState(getRoutes());
    const [listClassNames, setListClassNames] = useState(classOptions[1])
    const [openOptions, setOpenOptions] = useState(false)

    return (
        <>
            <div className={"queryContainer"}>
                <input list={"data-list"} className={"searchBar"} style={dynamicStyles} type={"text"} placeholder={placeHolder} onChange={onChangeFunc}></input>
                <datalist id={"data-list"} className={"dataList"}>
                    {routes && Array.isArray(routes) ? routes.map(route => (<option key={"datalist-"+ route.name}  value={route.name} onClick={() => {window.location.href = route.href}}></option>)) : []}

                </datalist>
            </div>
        </>
    );
  };


export default SearchBar;