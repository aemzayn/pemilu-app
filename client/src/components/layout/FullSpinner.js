import React from 'react'
import { Spinner } from 'react-bootstrap'

const FullSpinner = () => {
  return (
    <div className='w-100 d-flex align-items-center justify-content-center fullHeight'>
      <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </div>
  )
}

export default FullSpinner
