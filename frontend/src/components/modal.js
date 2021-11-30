// import closeUp from '/images/closeUp.JPG'
import React, {useState} from 'react';
import '../styles/modal.css';
import Button from "./genericButton";
import {politicalColors} from "../test_data/test_data_objects";
import {GREEN} from "../constants/constants";

export const Modal = ({mainTitle, description, confirmButtonText, cancelButtonText, cancelAction, confirmAction, open}) => {
    return (
        <section className={"specialModal"} style={{display: open ? 'block' : 'none'}}>
            <div className={"closerDiv"}>
                <h3 style={{paddingRight: '1rem'}}>
                    {mainTitle}
                </h3>
                <span className={"closer"} onClick={cancelAction}>
                </span>
            </div>
            <p>
                {description}
            </p>
            <div className={"buttonsDiv"}>
                {cancelButtonText ? <Button mainText={cancelButtonText} baseColor={"#b4b4b4"} textColor={"black"} marginRight={"1rem"} onButtonClick={cancelAction}/> : []}
                {confirmButtonText ? <Button mainText={confirmButtonText} baseColor={"black"} textColor={"white"} onButtonClick={confirmAction}/> : []}
            </div>
        </section>
    );
  };


export const SaveModal = ({placeholder, saveAction, inputLabelText, open, cancelAction}) => {
    const [saveName, setSaveName] = useState("")
    return (
        <section className={"specialModal"} style={{display: open ? 'block' : 'none'}}>
            <div className={"closerDiv"}>
                <h3 style={{paddingRight: '1rem'}}>
                    Save
                </h3>
                <span className={"closer"} onClick={cancelAction}>
                </span>
            </div>
            <div className={"inputAndButtonWrapper"}>
                <div className={"inputDiv"}>
                    <label htmlFor={"saveInput"}>{inputLabelText}</label>
                    <input id={"saveInput"} type={"text"} defaultValue={placeholder} className={"saveInput"} onChange={(el) => setSaveName(el.target.value)}/>
                </div>
                <div className={"inputDiv"}>
                    <label style={{color: 'transparent'}}>l</label>
                    <Button mainText={"Save"} baseColor={politicalColors[GREEN]} textColor={"white"} paddingHorizontal={"9px"} paddingVertical={"7px"} fontSize={'10pt'} onButtonClick={() => saveAction(saveName)} />
                </div>
            </div>
        </section>
    );
}
