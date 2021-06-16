import React, { Fragment } from 'react'
import { Nav } from 'react-bootstrap'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from '../../actions/auth'

const SignedInLinks = ({ isAdmin, logout }) => {
  const history = useHistory()

  const handleLogout = () => {
    history.push('/login')
    logout()
  }

  return (
    <Fragment>
      <Nav.Link href='/home'>Home</Nav.Link>
      {isAdmin && (
        <Fragment>
          <Nav.Link href='/dashboard/buat-pemilu'>Buat Pemilu</Nav.Link>
          <Nav.Link href='/dashboard'>Dashboard</Nav.Link>
        </Fragment>
      )}
      <div
        className='bg-danger p-2 flex-center rounded cursor-pointer'
        onClick={handleLogout}
      >
        <img src={require('../../img/exit.svg')} alt='' />
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  isAdmin: state.auth.isAdmin,
})

export default connect(mapStateToProps, { logout })(SignedInLinks)
