// import closeUp from '/images/closeUp.JPG'
import React, { useState } from 'react';
import '../styles/footer.css';
import {MainBackgroundColor} from "../constants/constants";
const Footer = ({mainTitle}) => {
    const calcFontColor = (baseColor) => {
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
    const [fontColor] = useState(calcFontColor(MainBackgroundColor))
    return (
        <>
            <section className = {"wideFooter"} style={{backgroundColor: MainBackgroundColor}}>
                <h3 className={"footerText"} style={{color: fontColor}}>
                    {mainTitle}
                </h3>
            </section>
        </>
    );
};

export default Footer;