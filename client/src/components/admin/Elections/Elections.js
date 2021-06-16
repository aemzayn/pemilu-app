import React from 'react'
import FullSpinner from '../../layout/FullSpinner'
import Election from './Election'

const Elections = ({ elections, candidates }) => {
  if (!elections) return <FullSpinner />

  return (
    <div className='mt-3'>
      {elections &&
        elections.map(election => (
          <Election
            key={election._id}
            election={election}
            candidates={candidates}
          />
        ))}
    </div>
  )
}

export default Elections
