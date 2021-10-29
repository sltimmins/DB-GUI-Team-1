import React from 'react';
import CandidateCard from './candidateCard';

export default function CandidateList({ filteredCandidates }) {
    const filterd = filteredCandidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />);

    return (
        <div>
            {filterd}
        </div>
    )
}