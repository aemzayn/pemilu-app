import React, { Fragment, useState, useEffect } from 'react'

// Components
import { Badge, Button, Card, Form, ListGroup } from 'react-bootstrap'
import { ElectionCandidate } from '../Candidates'
import DeleteElectionModal from './DeleteElectionModal'
import Countdown from 'react-countdown'

// Redux
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  getElectionEdit,
  addCandidateToElection,
  removeCandidateFromElection,
  setElectionToEnd,
} from '../../../actions/elections'

const Election = ({
  election,
  history,
  addCandidateToElection,
  removeCandidateFromElection,
  setElectionToEnd,
}) => {
  const [formData, setFormData] = useState({
    candidateId: '',
  })
  const { candidateId } = formData
  const [show, setShow] = useState(false)
  const [electionCandidates, setElectionCandidates] = useState()
  const [electionStatus, setElectionStatus] = useState({
    status: '',
    type: '',
  })

  useEffect(() => {
    if (election && election.candidates) {
      setElectionCandidates(election.candidates)
    }

    if (!election.hasStarted && !election.hasEnded) {
      setElectionStatus({
        status: 'Belum mulai',
        type: 'secondary',
      })
    } else if (election.hasStarted && !election.hasEnded) {
      setElectionStatus({
        status: 'Sedang berlangsung',
        type: 'success',
      })
    } else if (election.hasStarted && election.hasEnded) {
      setElectionStatus({
        status: 'Sudah berakhir',
        type: 'info',
      })
    }
  }, [])

  const handleSelectChange = e => {
    setFormData({
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    addCandidateToElection(election._id, formData)
    setFormData({
      candidateId: '',
    })
  }

  const handleDeleteElection = () => {
    setShow(true)
  }

  const redirectToEditPage = async id => {
    if (!id) {
      return false
    }
    history.push(`/dashboard/election/${election._id}?edit=true`)
  }

  const handleRemoveCandidateFromElection = (electionId, candidateId) => {
    setElectionCandidates(prevState => {
      return prevState.filter(
        candidate => candidate.candidateId._id !== candidateId
      )
    })
    removeCandidateFromElection(electionId, candidateId)
  }

  return (
    <Fragment>
      <DeleteElectionModal
        show={show}
        setShow={setShow}
        electionId={election._id}
      />
      <Card style={{ width: '100%' }} className='mb-3'>
        <Card.Body>
          <Card.Title>
            {election.name[0].toUpperCase() + election.name.substring(1)}
          </Card.Title>
          <div className='mb-3'>
            <h6>Deskripsi</h6>
            <span>{election?.description}</span>
          </div>
          <div className='mb-3'>
            <h6>Status</h6>
            <Badge variant={electionStatus.type}>{electionStatus.status}</Badge>
          </div>
          <div className='mb-3'>
            <h6>Jumlah suara</h6>
            <span>{election.totalVotes}</span>
          </div>

          <ListGroup className='mb-3'>
            <h6>Kandidat</h6>
            {electionCandidates ? (
              electionCandidates.map(candidate => (
                <ElectionCandidate
                  key={candidate._id}
                  candidate={candidate}
                  handleRemoveCandidateFromElection={
                    handleRemoveCandidateFromElection
                  }
                  electionId={election._id}
                  isElectionStarted={election.hasStarted}
                  isElectionEnded={election.hasEnded}
                />
              ))
            ) : (
              <p>Tidak ada kandidat terdaftar</p>
            )}
            {!election.hasEnded && (
              <Form className='mt-2' onSubmit={handleSubmit}>
                <Form.Group controlId='candidateId' style={{ width: '300px' }}>
                  <Form.Control
                    type='text'
                    placeholder='Kandidat ID'
                    onChange={handleSelectChange}
                    name='candidateId'
                    value={candidateId || ''}
                    required
                  />
                </Form.Group>
                <Button type='submit' disabled={!candidateId && true}>
                  Tambah kandidat
                </Button>
              </Form>
            )}
          </ListGroup>

          {election.hasEnded && (
            <Button
              variant='primary'
              className='mr-1'
              size='sm'
              onClick={() =>
                history.push(`/dashboard/election/${election._id}`)
              }
            >
              Details
            </Button>
          )}

          <Button
            variant='info'
            className='mr-1'
            size='sm'
            onClick={() =>
              history.push(`/dashboard/election/${election._id}?voters=true`)
            }
          >
            Daftar pemilih
          </Button>

          <Button
            variant='success'
            className='mr-1'
            size='sm'
            onClick={() => redirectToEditPage(election._id)}
          >
            Edit
          </Button>
          <Button
            variant='danger'
            className='mr-1'
            size='sm'
            onClick={() => handleDeleteElection(election._id)}
          >
            Hapus
          </Button>
          {/* <Button
            variant='warning'
            size='sm'
            disabled={election.hasEnded}
            onClick={() => setElectionToEnd(election._id)}
          >
            Akhiri
          </Button> */}
        </Card.Body>
        <Card.Footer className='flex-space-between'>
          <div>
            {!election.hasStarted && !election.hasEnded && (
              <>
                <span>Akan dimulai dalam: </span>
                <Countdown date={election.startDate} />
              </>
            )}
            {election.hasStarted && !election.hasEnded && (
              <>
                <span>Berakhir dalam: </span>
                <Countdown date={election.endDate} />
              </>
            )}
          </div>
          <div>
            <span className='text-muted'>
              {election.startDate &&
                election.endDate &&
                `${new Date(election.startDate).toLocaleString(
                  'id-ID'
                )} - ${new Date(election.endDate).toLocaleString('id-ID')}`}
            </span>
          </div>
        </Card.Footer>
      </Card>
    </Fragment>
  )
}

export default compose(
  withRouter,
  connect(null, {
    getElectionEdit,
    addCandidateToElection,
    removeCandidateFromElection,
    setElectionToEnd,
  })
)(Election)
