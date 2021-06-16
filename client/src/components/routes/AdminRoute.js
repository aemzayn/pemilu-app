import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import FullSpinner from '../layout/FullSpinner'

const AdminRoute = ({
  component: Component,
  auth: { isAdmin, loading, isAuthenticated },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <FullSpinner />
        ) : isAdmin ? (
          <Component {...props} />
        ) : isAuthenticated ? (
          <Redirect to='/home' />
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

export default connect(mapStateToProps)(AdminRoute)
