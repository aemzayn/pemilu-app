import React, { Fragment } from 'react'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deleteCandidate } from '../../../actions/candidates'

const AddedCandidatesFormTable = ({ candidates, deleteCandidate }) => {
  return (
    <Fragment>
      <h5>Daftar Kandidat</h5>
      <Table striped bordered hover responsive size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Link CV</th>
            <th>Foto</th>
            <th className='text-muted font-weight-normal'>Hapus</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.candidateName}</td>
              <td>{candidate.candidateDescription}</td>
              <td>{candidate.cvUrl ? candidate.cvUrl : '-'}</td>
              <td>{candidate.file.fileName}</td>
              <td className='flex-center'>
                <button
                  type='button'
                  className='flex-center'
                  style={{
                    width: '30px',
                    height: '30px',
                    outline: 'none',
                    border: 'none',
                  }}
                  onClick={() => deleteCandidate(candidates, candidate)}
                >
                  <img
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                    src={require('../../../img/remove.svg')}
                    alt='remove btn'
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default connect(null, { deleteCandidate })(AddedCandidatesFormTable)
