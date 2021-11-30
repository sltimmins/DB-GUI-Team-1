import React from 'react'
import '../styles/profileCard.css'

export default function ProfileCard ({ candidate }) {
    let name = candidate.firstName + " " + candidate.lastName;
    let image = ["assets/userImages/default.jpg"]

    if(candidate.uuid) {
        image = [];
        image = ["https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + candidate.uuid];
    }

    return (
        // TODO: Take user to candidate profile page on click
        <div key={ candidate.id } class="candidateCard">
            <img class="candidateImage" alt={name} src={image}/>
            <div class="info">
                <h2 class="no-wrap">{name}</h2>
                <p class="party">{candidate.party}</p>
                <Link className="btn btn-outline-success btn-block w-25 py-2 mb-3">View Profile</Link>
            </div>
            {
                favorite !== null && 
                    <div className="favorite">
                        <Favorite isFav={favorite} candidateId={candidate.candidateId}/>   
                    </div>
            }
            <div class="clear"></div>
        </div>
    )
}