import React, { useState } from 'react';
import '../styles/searchBar.css';
const SearchBar = ({baseColor, placeHolder, textColor, width, height, fontSize, fontWeight, dropShadow, routes, onChangeFunc}) => {
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

    const [dynamicStyles] = useState(setStyles())

    return (
        <>
            <div className={"queryContainer"}>
                <input list={"data-list"} className={"searchBar"} style={dynamicStyles} type={"text"} placeholder={placeHolder} onChange={onChangeFunc}/>
                <datalist id={"data-list"} className={"dataList"}>
                    {routes && Array.isArray(routes) ? routes.map(route => (<option key={"datalist-"+ route.name}  value={route.name} onClick={() => {window.location.href = route.href}}/>)) : []}

                </datalist>
            </div>
        </>
    );
  };


export default SearchBar;