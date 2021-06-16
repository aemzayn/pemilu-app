import React, { useEffect, useState } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const ElectionCandidate = ({
  candidate,
  handleRemoveCandidateFromElection,
  electionId,
  isElectionStarted,
  isElectionEnded,
}) => {
  const [regionalVotes, setRegionalVotes] = useState([])

  useEffect(() => {
    const votes = []
    for (const [key, value] of Object.entries(candidate.votesPerRegion)) {
      votes.push({
        name: key,
        votes: value.toString(),
      })
    }
    setRegionalVotes(votes)
  }, [])

  return candidate.candidateId._id ? (
    <ListGroup.Item key={candidate.candidateId._id} className='mb-1 py-1'>
      <div>
        {candidate.candidateId.name}{' '}
        {isElectionEnded && (
          <span className='text-muted ml-1'>{candidate.totalVotes} suara</span>
        )}
      </div>
      {isElectionEnded && (
        <div className='d-flex flex-wrap'>
          {regionalVotes.map((region, index) => (
            <div key={region.name} className='mr-2'>
              {region.name}: {region.votes}
            </div>
          ))}
        </div>
      )}
      {!isElectionStarted && (
        <span
          className='ml-auto text-danger'
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() =>
            handleRemoveCandidateFromElection(
              electionId,
              candidate.candidateId._id
            )
          }
        >
          Hapus
        </span>
      )}
    </ListGroup.Item>
  ) : (
    <ListGroup.Item key={candidate._id}>
      <div className='text-muted'>Kandidat tidak ditemukan (sudah dihapus)</div>
    </ListGroup.Item>
  )
}

export default ElectionCandidate
