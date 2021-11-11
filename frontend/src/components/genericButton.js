// import closeUp from '/images/closeUp.JPG'
import React, {useEffect, useState} from 'react';
import '../styles/generic_button.css';

const Button = ({baseColor, mainText, textColor, paddingHorizontal, paddingVertical, fontSize, fontWeight, dropShadow, onButtonClick, gradient, disabled}) => {
    const calcFontColor = () => {
        if(baseColor.length === 4){
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
            color: textColor ? textColor : calcFontColor(),
        }
        if(paddingHorizontal){
            initialStyles.paddingLeft = paddingHorizontal;
            initialStyles.paddingRight = paddingHorizontal
        }
        if(paddingVertical){
            initialStyles.paddingTop = paddingVertical;
            initialStyles.paddingBottom = paddingVertical;
        }
        if(fontSize){
            initialStyles.fontSize = fontSize;
        }
        if(fontWeight){
            initialStyles.fontWeight = fontWeight;
        }
        if(!dropShadow){
            initialStyles.filter = "drop-shadow(0 0 0 white)"
        } else {
            initialStyles.filter = dropShadow
        }
        if(gradient) {
            initialStyles.background = gradient;
        }
        return initialStyles;
    }
    const [dynamicStyles, setDynamicStyles] = useState(setStyles())
    //
    // useEffect(
    //     () => {
    //         setDynamicStyles(setStyles())
    //     }
    // )

    return (
        <button className={"genericButton"} style={dynamicStyles} type={"button"} role={"button"} onClick={onButtonClick} disabled={disabled}>{mainText}</button>
    );
  };


export default Button;