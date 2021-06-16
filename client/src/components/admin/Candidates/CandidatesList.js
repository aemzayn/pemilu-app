import React, { Fragment, useState } from 'react'
import { Button, Col, Form, Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteCandidate } from '../../../actions/candidates'

const CandidatesList = ({ candidates, deleteCandidate }) => {
  const [selectedId, setSelectedId] = useState('')
  const handleChange = event => {
    setSelectedId(event.target.value)
  }

  const handleDeleteCandidateSubmit = e => {
    e.preventDefault()
    deleteCandidate(selectedId)
    setSelectedId('')
  }

  return (
    <div className='dashboard-item'>
      <h3 className='mb-2'>Daftar Kandidat</h3>
      <Link to='/dashboard/add-candidate'>
        <Button size='sm' variant='outline-primary'>
          Buat kandidat
        </Button>
      </Link>
      {candidates.length > 0 ? (
        <>
          <Table striped responsive size='sm' className='mt-2'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Link CV</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              <CandidateListItem candidates={candidates} />
            </tbody>
          </Table>
          <Form onSubmit={handleDeleteCandidateSubmit}>
            <Form.Row>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Masukkan ID kandidat yang akan dihapus'
                  value={selectedId}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Button
                  type='submit'
                  variant='danger'
                  disabled={!selectedId && true}
                >
                  Hapus Kandidat
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </>
      ) : (
        <div className='my-2'>
          <span>Tidak ada kandidat terdaftar</span>
        </div>
      )}
    </div>
  )
}

const CandidateListItem = ({ candidates }) => {
  return (
    <Fragment>
      {candidates.map((candidate, index) => (
        <tr key={candidate._id}>
          <th scope='row'>{index + 1}</th>
          <td aria-label='Candidate Name'>{candidate.name}</td>
          {candidate.name && (
            <td aria-label='Candidate description'>
              {candidate.description ? (
                candidate.description
              ) : (
                <span className='text-muted'>No description</span>
              )}
            </td>
          )}
          <td aria-label='Candidate CV Url'>
            {candidate.cvUrl ? (
              candidate.cvUrl
            ) : (
              <span className='text-muted'>-</span>
            )}
          </td>
          <td>{candidate._id}</td>
        </tr>
      ))}
    </Fragment>
  )
}

export default connect(null, { deleteCandidate })(CandidatesList)
