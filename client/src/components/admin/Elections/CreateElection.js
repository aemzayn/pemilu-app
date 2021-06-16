import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// Components
import { Alert, Button, Container, Form } from 'react-bootstrap'

// Redux
import { connect } from 'react-redux'
import { createElection } from '../../../actions/elections'

const CreateElection = ({ createElection }) => {
  const [electionData, setElectionData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const [showMessage, setShowMessage] = useState({
    message: '',
    type: '',
  })

  const { name, description, startDate, endDate } = electionData

  const today = new Date()
  const pastDate = new Date(today.setDate(today.getDate()))
    .toISOString()
    .slice(0, -5)

  const handleInputChange = e => {
    setElectionData({
      ...electionData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateElection = e => {
    e.preventDefault()
    createElection(electionData)
    setShowMessage({
      message: 'Sukses membuat pemilu.',
      type: 'success',
    })

    setElectionData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    })

    setTimeout(() => {
      setShowMessage({
        message: '',
        type: '',
      })
    }, 10000)
  }

  return (
    <Container className='my-4'>
      <Link to='/home' className='mr-2'>
        <Button variant='outline-dark' size='sm'>
          Home
        </Button>
      </Link>
      <Link to='/dashboard/add-candidate'>
        <Button variant='outline-primary' size='sm'>
          Tambah kandidat
        </Button>
      </Link>
      <h1 className='mt-3'>Create Election</h1>
      <Alert variant='primary'>
        Untuk 00:00 waktu Turki, setel jam nya di 03:00 AM <br /> Untuk 00:00
        waktu Indonesia, setel jam nya di 07:00 AM
      </Alert>
      <Form onSubmit={handleCreateElection}>
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
            value={description}
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
            value={startDate || ''}
            onChange={handleInputChange}
            min={pastDate}
            step='any'
            required
          />
        </Form.Group>

        <Form.Group controlId='electionEndDate'>
          <Form.Label>Tanggal Selesai*</Form.Label>
          <Form.Control
            type='datetime-local'
            placeholder='Tanggal Selesai'
            name='endDate'
            value={endDate || ''}
            onChange={handleInputChange}
            min={pastDate}
            step='any'
            required
          />
        </Form.Group>

        <div className='d-flex'>
          <Button
            variant='info'
            type='submit'
            disabled={
              !name || !description || !startDate || !endDate ? true : false
            }
          >
            Buat pemilu
          </Button>
          {showMessage.message && (
            <p className='text-success ml-2 my-auto'>{showMessage.message}</p>
          )}
        </div>
      </Form>
    </Container>
  )
}

const mapStateToProps = state => ({
  candidates: state.elections.candidates,
})

export default connect(mapStateToProps, { createElection })(CreateElection)
