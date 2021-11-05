import React from 'react'
import '../styles/candidateCard.css'

export default function CandidateCard ({ candidate }) {
    let name = candidate.firstName + " " + candidate.lastName;
    let image = ["assets/userImages/default.jpg"]

    if(candidate.image) {
        image = [];
        image = [candidate.image];
    }

    console.log(image);
    return (
        // TODO: Take user to candidate profile page on click
        <div class="candidateCard">
            <img class="candidateImage" alt={name} src={image}/>
            <div class="info">
                <h2 class="no-wrap">{name}</h2>
                <p class="party">{candidate.party}</p>
            </div>
            <div class="clear"></div>
        </div>
    )
}