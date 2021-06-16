import React, { useEffect, useMemo, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Form, Alert } from 'react-bootstrap'

// Redux
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getElectionById, editElection } from '../../../actions/elections'
import FullSpinner from '../../layout/FullSpinner'

const EditElection = ({ match, election, getElectionById, editElection }) => {
  const [electionData, setElectionData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [],
  })

  const ELECTION_ID = match.params.id

  useEffect(() => {
    if (election) {
      setElectionData({
        name: election.name,
        description: election.description,
        startDate: setDate(election.startDate),
        endDate: setDate(election.endDate),
      })
    }
  }, [election.name])

  useMemo(() => getElectionById(ELECTION_ID), [])

  const [message, setMessage] = useState({
    text: '',
    type: '',
  })

  const [show, setShow] = useState(true)

  const { name, description, startDate, endDate } = electionData

  const today = new Date()
  const pastDate = new Date(today.setDate(today.getDate() - 1))
    .toISOString()
    .slice(0, -5)
  const setDate = date => {
    return new Date(date).toISOString().slice(0, -5)
  }

  const handleInputChange = e => {
    setElectionData({
      ...electionData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditElection = e => {
    e.preventDefault()
    editElection(electionData, ELECTION_ID)
    setMessage({
      text: 'Sukses menyunting pemilu',
      type: 'success',
    })

    setTimeout(() => {
      setMessage({
        text: '',
        type: '',
      })
    }, 10000)
  }

  return (
    <Container className='my-4'>
      <Link to='/home'>
        <Button variant='dark'>Home</Button>
      </Link>
      <h1 className='mt-3'>Edit Election</h1>
      {election?.hasStarted && !election?.hasEnded && show && (
        <Alert variant='danger' onClose={() => setShow(false)} dismissible>
          Kamu sedang menyunting pemilu yang sedang berlangsung
        </Alert>
      )}
      {election?.hasStarted && election?.hasEnded && show && (
        <Alert variant='danger' onClose={() => setShow(false)} dismissible>
          Kamu sedang menyunting pemilu yang sudah berakhir
        </Alert>
      )}
      {election ? (
        <Form onSubmit={handleEditElection}>
          <Form.Group controlId='electionName'>
            <Form.Label>Nama Pemilu*</Form.Label>
            <Form.Control
              type='text'
              placeholder='Contoh: Pemilu PPI'
              onChange={handleInputChange}
              name='name'
              value={name || ''}
              required
            />
          </Form.Group>

          <Form.Group controlId='electionDescription'>
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              type='text'
              name='description'
              value={description || ''}
              onChange={handleInputChange}
              placeholder='Deskripsi pemilu'
            />
          </Form.Group>

          <Form.Group controlId='electionStartDate'>
            <Form.Label>Tanggal Mulai*</Form.Label>
            <Form.Control
              type='datetime-local'
              placeholder='Tanggal Mulai'
              name='startDate'
              value={(startDate || '').toString().substring(0, 16)}
              onChange={handleInputChange}
              min={pastDate}
              required
              step='any'
            />
          </Form.Group>

          <Form.Group controlId='electionEndDate'>
            <Form.Label>Tanggal Selesai*</Form.Label>
            <Form.Control
              type='datetime-local'
              placeholder='Tanggal Selesai'
              name='endDate'
              value={(endDate || '').toString().substring(0, 16)}
              onChange={handleInputChange}
              min={pastDate}
              step='any'
              required
            />
          </Form.Group>

          <div className='d-flex'>
            <Button variant='info' type='submit'>
              Save
            </Button>
            {message.text && (
              <p className={`text-${message.type} ml-2 my-auto`}>
                {message.text}
              </p>
            )}
          </div>
        </Form>
      ) : !election.name ? (
        <Alert variant='danger'>
          <Alert.Heading>Pemilu tidak ditemukan</Alert.Heading>
          Klik <Alert.Link href='/dashboard'>disini</Alert.Link> untuk kembali
        </Alert>
      ) : (
        <div className='mt-3'>
          <FullSpinner />
        </div>
      )}
    </Container>
  )
}

const mapStateToProps = state => ({
  election: state.elections.election,
})

export default compose(
  withRouter,
  connect(mapStateToProps, {
    getElectionById,
    editElection,
  })
)(EditElection)
