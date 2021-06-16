import React, { useEffect, useMemo, useState } from 'react'
import UsersMain from './Users/UsersMain'
import ElectionMain from './Elections/ElectionMain'
import { Button, ButtonGroup, Container } from 'react-bootstrap'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

const Dashboard = props => {
  const [activePage, setActivePage] = useState('pemilu')
  const { show } = queryString.parse(props.location.search)

  useEffect(() => {
    if (show) {
      setActivePage(show)
    } else {
      setActivePage('pemilu')
    }
  }, [show])

  return (
    <Container className='dashboard' className='fullHeight pt-4'>
      <ButtonGroup aria-label='Basic example'>
        <Button variant={activePage === 'pemilu' ? 'primary' : 'secondary'}>
          <Link className='text-white' to='/dashboard?show=pemilu'>
            Pemilu
          </Link>
        </Button>

        <Button variant={activePage === 'users' ? 'primary' : 'secondary'}>
          <Link className='text-white' to='/dashboard?show=users'>
            User
          </Link>
        </Button>
      </ButtonGroup>

      {activePage === 'users' && <UsersMain />}
      {activePage === 'pemilu' && <ElectionMain />}
    </Container>
  )
}

export default Dashboard
