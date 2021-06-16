import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import FullSpinner from '../layout/FullSpinner'

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, user },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div className='w-100 d-flex align-items-center justify-content-center fullHeight'>
            <FullSpinner />
          </div>
        ) : isAuthenticated && user ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)
