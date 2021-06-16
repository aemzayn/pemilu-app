import React, { useEffect, useState } from 'react'
import { Button, Container, Pagination, Table } from 'react-bootstrap'
import FullSpinner from '../../layout/FullSpinner'
import DeleteVoteModal from './DeleteVoteModal'

const ElectionVoters = ({ election, deleteVote }) => {
  const [showVoters, setShowVoters] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [votersPerPage, setVotersPerPage] = useState(100)
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    ppi: '',
  })

  useEffect(() => {
    if (election) {
      setLoading(false)
      const data = election.candidates
        .map(c => c.voters)
        .flat()
        .sort(function (a, b) {
          var nameA = a.ppi.toLowerCase(),
            nameB = b.ppi.toLowerCase()
          if (nameA < nameB)
            //sort string ascending
            return -1
          if (nameA > nameB) return 1
          return 0 //default return value (no sorting)
        })
      setShowVoters(data)
    }
  }, [election])

  const indexOfLastPage = currentPage * votersPerPage
  const indexOfFirstPost = indexOfLastPage - votersPerPage
  const currentVoters = showVoters.slice(indexOfFirstPost, indexOfLastPage)

  const handleDeleteVote = voter => {
    setFormData({
      id: voter._id,
      name: voter.name,
      ppi: voter.ppi,
    })
    setShow(true)
  }

  if (loading) {
    return <FullSpinner />
  }

  const paginate = pageNumber => setCurrentPage(pageNumber)
  return (
    <>
      <DeleteVoteModal
        show={show}
        setShow={setShow}
        deleteVote={deleteVote}
        formData={formData}
        electionId={election._id}
      />
      <Container>
        <div className='dashboard-item'>
          <div className='mb-3'>
            <h1>Daftar pemilih {election.name}</h1>
            <span>
              Total Voters:{' '}
              {currentVoters ? currentVoters.length : 'Loading...'}
            </span>
          </div>
          <Table striped responsive size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>PPI Daerah</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentVoters &&
                currentVoters.map((v, index) => (
                  <tr key={v._id}>
                    <th scope='row'>{index + 1}</th>
                    <td aria-label='Nama'>{v.name}</td>
                    <td aria-label='PPI Daerah'>{v.ppi}</td>
                    <td aria-label='Hapus vote'>
                      <Button
                        // className='text-danger'
                        variant='danger'
                        size='sm'
                        onClick={() => handleDeleteVote(v)}
                      >
                        Hapus vote
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <UserPagination
            votersPerPage={votersPerPage}
            totalVoters={showVoters.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </Container>
    </>
  )
}

const UserPagination = ({
  votersPerPage,
  totalVoters,
  paginate,
  currentPage,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalVoters / votersPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <Pagination>
      {pageNumbers.map(number => (
        <li
          className={`page-item ${currentPage === number && 'active'}`}
          key={number}
        >
          <a className='page-link' onClick={() => paginate(number)}>
            {number}
          </a>
        </li>
      ))}
    </Pagination>
  )
}

export default ElectionVoters
