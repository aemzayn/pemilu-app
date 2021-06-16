import React from 'react'
import FullSpinner from '../layout/FullSpinner'
import Election from './Election'

const ShowElections = ({ elections }) => {
  if (!elections) {
    return <FullSpinner />
  }

  return elections.map(election => (
    <Election key={election._id} election={election} />
  ))
}

export default ShowElections
