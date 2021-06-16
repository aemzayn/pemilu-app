import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import DeleteUser from './DeleteUser'
import UsersTable from './UsersTable'
import { CSVLink } from 'react-csv'

import { connect } from 'react-redux'
import { getAllUsers } from '../../../actions/users'

const UsersMain = ({ users: { users, loading }, getAllUsers }) => {
  const [userData, setUserData] = useState([])
  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    const data =
      users &&
      users.map((user, index) => ({
        no: index + 1,
        name: user.name,
        email: user.email,
        ppi: user.ppi,
        role: user.isAdmin ? 'Admin' : 'Anggota',
        partisipasi:
          // cek if user has participated in election(s)
          user.selection.length > 0 &&
          user.selection.filter(
            s => s.electionId !== null && s.selectedCandidate !== null
          ).length > 0
            ? user.selection
                .filter(
                  s => s.electionId !== null && s.selectedCandidate !== null
                )
                .map(s => s.electionId.name)
            : 'null',
      }))

    setUserData(data)
  }, [users])

  const headers = [
    { label: 'Nomor', key: 'no' },
    { label: 'Nama Lengkap', key: 'name' },
    { label: 'PPI Wilayah', key: 'ppi' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Partisipasi', key: 'partisipasi' },
  ]

  return (
    <div className='mt-4'>
      <div>
        <h1>Daftar user</h1>
        <p>Jumlah user: {users ? users.length : 'Loading...'}</p>
        {userData.length !== 0 ? (
          <CSVLink
            data={userData}
            headers={headers}
            filename={'data-pemilih-2020.csv'}
          >
            Download data user
          </CSVLink>
        ) : (
          <Spinner type='grow' color='warning' />
        )}
      </div>
      {!loading && users ? (
        <>
          <UsersTable users={users} className='mb-4' />
          <DeleteUser />
        </>
      ) : (
        <Spinner type='grow' color='info' />
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users,
})

export default connect(mapStateToProps, { getAllUsers })(UsersMain)
