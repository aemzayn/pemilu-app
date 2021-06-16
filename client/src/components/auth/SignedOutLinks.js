import React, { Fragment } from 'react'
import { Nav } from 'react-bootstrap'

const SignedOutLinks = () => {
  return (
    <Fragment>
      <Nav.Link href='/login'>Login</Nav.Link>
      <Nav.Link href='/register'>Register</Nav.Link>
    </Fragment>
  )
}

export default SignedOutLinks
