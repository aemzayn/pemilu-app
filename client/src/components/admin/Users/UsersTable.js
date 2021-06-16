import React, { useEffect, useState } from 'react'
import { Pagination, Table } from 'react-bootstrap'
import UserItem from './UserItem'

const UsersTable = ({ users }) => {
  const [showUsers, setShowUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(100)

  useEffect(() => {
    setShowUsers(users)
    setLoading(false)
  }, [])

  const indexOfLastPage = currentPage * usersPerPage
  const indexOfFirstPost = indexOfLastPage - usersPerPage
  const currentUsers = showUsers.slice(indexOfFirstPost, indexOfLastPage)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div className='dashboard-item'>
      <Table striped responsive size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>PPI Daerah</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <UserItem users={currentUsers} loading={loading} />
        </tbody>
      </Table>
      <UserPagination
        usersPerPage={usersPerPage}
        totalUsers={showUsers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  )
}

const UserPagination = ({
  usersPerPage,
  totalUsers,
  paginate,
  currentPage,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
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

export default UsersTable
