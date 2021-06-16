import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { connect } from 'react-redux'
import SignedInLinks from '../auth/SignedInLinks'
import SignedOutLinks from '../auth/SignedOutLinks'

const NavbarComponent = ({ isAuthenticated }) => {
  return (
    <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
      <Container>
        <Navbar.Brand
          href={isAuthenticated ? '/home' : '/'}
          className='flex-center'
        >
          <img
            src={require('../../img/logo.jpg')}
            width='35'
            height='35'
            className='d-inline-block align-top mr-2'
            alt='KPU PPI Turki'
          />
          KPU PPI Turki
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ml-auto'>
            {!isAuthenticated ? <SignedOutLinks /> : <SignedInLinks />}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(NavbarComponent)
