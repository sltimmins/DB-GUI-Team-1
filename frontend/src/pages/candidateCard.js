import React from 'react'
import '../styles/candidateCard.css'

export default function CandidateCard ({ candidate }) {
    let name = candidate.firstName + " " + candidate.lastName;
    return (
        <div class="candidateCard">
            <img class="candidateImage" alt={name} src={"http://placehold.it/250x250"}/>
            <div class="info">
                <h2>{name}</h2>
                <p class="party">{candidate.party}</p>
            </div>
            <div class="clear"></div>
        </div>
    )
}