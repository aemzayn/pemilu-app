import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Jumbotron } from 'react-bootstrap'
import { getUserElection } from '../../actions/elections'
import { reSendVerifToken } from '../../actions/users'
import Election from '../elections/Election'

const Home = ({
  auth,
  userElections,
  reSendVerifToken,
  getUserElection,
  votes,
}) => {
  const [buttonDisable, setButtonDisable] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => {
    getUserElection()
  }, [])

  const handleClick = () => {
    reSendVerifToken()
    setButtonDisable(true)
    setMsg('Email konfirmasi sudah dikirim!')
  }

  return (
    <Container>
      <div className='mt-4'>
        <Jumbotron>
          {auth && auth.user && auth.user.hasVoted ? (
            <>
              <h1>
                Terima kasih, anda telah menggunakan hak suara anda pada Pemilu
                Ketua PPI Turki 2021/2022.
              </h1>
              <h4 className='text-muted font-weight-normal'>
                {auth.user.email}
              </h4>
            </>
          ) : (
            <h1>Selamat Datang di Pemilu PPI Turki 2020/2021</h1>
          )}
        </Jumbotron>

        {auth.user &&
          userElections &&
          userElections.map(election => (
            <Election key={election._id} election={election} />
          ))}
      </div>
    </Container>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  userElections: state.elections.userElections,
  votes: state.elections.votes,
})

export default connect(mapStateToProps, { getUserElection, reSendVerifToken })(
  Home
)
