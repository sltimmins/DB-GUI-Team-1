import React, {useEffect} from 'react'
import Favorite from '../components/favorite.jsx'
import '../styles/profileCard.css'
import { Link } from 'react-router-dom';

export default function ProfileCard ({ candidate, favorite, baseURL }) {
    let name = candidate.firstName + " " + candidate.lastName;
    let image = ["assets/userImages/default.jpg"]

    if(candidate.uuid) {
        image = [];
        image = ["https://res.cloudinary.com/stimmins/image/upload/v1636138517/images/" + candidate.uuid];
    }

    return (
        // TODO: Take user to candidate profile page on click
        <div key={ candidate.candidateId } class="candidateCard favoriteButton" >
            <img class="candidateImage" alt={name} src={image}/>
            <div class="info">
                <h2 class="no-wrap">{name}</h2>
                <p class="party">{candidate.party}</p>
                {
                    candidate.candidateId && <Link to={'/UserProfile/' + (candidate.candidateId || candidate.accountNumber) + '/' + true}
                        className="btn btn-outline-success btn-block w-25 py-2 mb-3">View Profile</Link>
                }
                {
                    !candidate.candidateId && <Link to={'/UserProfile/' + (candidate.candidateId || candidate.accountNumber) + '/' + false}
                        className="btn btn-outline-success btn-block w-25 py-2 mb-3">View Profile</Link>
                }
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