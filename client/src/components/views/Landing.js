import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/home' />
  } else {
    return <Redirect to='/login' />
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Landing)
