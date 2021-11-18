import React from 'react';
import ProfileCard from './profileCard';

export default function ProfileList({ filteredCandidates }) {
    const filtered = filteredCandidates.map((candidate) => <ProfileCard key={ candidate.id } candidate={candidate} />);

    return (
        <>
            {filtered}
        </>
    )
}