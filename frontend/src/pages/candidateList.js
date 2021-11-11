import React from 'react';
import CandidateCard from './candidateCard';

export default function CandidateList({ filteredCandidates }) {
    const filtered = filteredCandidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />);

    return (
        <>
            {filtered}
        </>
    )
}