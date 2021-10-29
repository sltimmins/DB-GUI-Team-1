import React from 'react'

export default function CandidateCard ({ candidate }) {
    let name = candidate.firstName + " " + candidate.lastName;
    return (
        <div className="tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5">
            <img className="br-100 h3 w3 dib" alt={name} src={"http://placehold.it/150x150"} />
            <div>
                <h2>{name}</h2>
                <p>{candidate.party}</p>
            </div>
        </div>
    )
}