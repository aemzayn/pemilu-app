import React, { useEffect } from 'react'
import { Alert, Container, Jumbotron, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import { verifiyToken } from '../../actions/users'
import queryString from 'query-string'

const ConfirmToken = ({ verifiyToken, location, message }) => {
  // Url = /confirm-user?token=token
  const { token } = queryString.parse(location.search)
  useEffect(() => {
    if (token) {
      verifiyToken(token)
    }
  }, [])

  return (
    <Container className='mt-4'>
      <Jumbotron>
        <h1>Konfirmasi email</h1>
        {message ? (
          <p className='text-danger'>{message}</p>
        ) : (
          <Spinner animation='border' role='status'>
            <span className='sr-only'>Loading...</span>
          </Spinner>
        )}
      </Jumbotron>
      {alert?.map && (
        <Alert className='my-4' variant={alert.alertType}>
          {alert.msg}
        </Alert>
      )}
    </Container>
  )
}

const mapStateToProps = state => {
  return {
    message: state.users.message,
  }
}

export default connect(mapStateToProps, { verifiyToken })(ConfirmToken)
