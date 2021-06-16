import React, { useEffect } from 'react'
import { Button, Jumbotron, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FullSpinner from '../../layout/FullSpinner'
import Elections from './Elections'

import { connect } from 'react-redux'
import { getAllElections } from '../../../actions/elections'
import { getCandidates } from '../../../actions/candidates'
import { CandidatesList } from '../Candidates'

const ElectionMain = ({
  elections,
  candidates,
  getAllElections,
  getCandidates,
}) => {
  useEffect(() => {
    getAllElections()
    getCandidates()
  }, [])
  return (
    <>
      {!elections ? (
        <FullSpinner />
      ) : elections.length === 0 ? (
        <Jumbotron className='mt-4'>
          <h3 className='mb-3'>Belum ada pemilu</h3>
          <p>Buat pemilu sekarang</p>
          <Link style={{ fontStyle: 'none' }} to='/dashboard/buat-pemilu'>
            <Button variant='info'>Buat pemilu</Button>
          </Link>
        </Jumbotron>
      ) : (
        <div className='dashboard-item'>
          <h3 className='mb-3'>Daftar Pemilu</h3>
          <Elections elections={elections} candidates={candidates} />
        </div>
      )}

      {candidates ? <CandidatesList candidates={candidates} /> : <Spinner />}
    </>
  )
}

const mapStateToProps = state => ({
  elections: state.elections.elections,
  candidates: state.candidates.candidates,
})

export default connect(mapStateToProps, { getAllElections, getCandidates })(
  ElectionMain
)
