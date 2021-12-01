import React, { useState } from 'react';
import ProfileCard from './profileCard';

export default function ProfileList({ filteredCandidates, favoriteCandidates, baseURL }) {

    const filtered = filteredCandidates.map((candidate) => {
        if(candidate.candidateId) {
            if(favoriteCandidates.includes(candidate.candidateId, 0)) {
                return <ProfileCard key={ candidate.id } candidate={candidate} favorite={true} baseURL={baseURL} />;
            } else {
                return <ProfileCard key={ candidate.id } candidate={candidate} favorite={false} baseURL={baseURL}/>
            }
        } else {
            return <ProfileCard key={ candidate.id } candidate={candidate} favorite={null} baseURL={baseURL}/>
        }
    });

    return (
        <>
            {filtered}
        </>
    )
}