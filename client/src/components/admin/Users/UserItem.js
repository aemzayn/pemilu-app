import React, { Fragment } from 'react'

const UserItem = ({ users, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>
  }
  return (
    <Fragment>
      {users.map((user, index) => (
        <tr key={user._id}>
          <th scope='row'>{index + 1}</th>
          <td aria-label='Nama'>{user.name}</td>
          <td aria-label='PPI Daerah'>{user.ppi}</td>
          <td aria-label='Email'>{user.email}</td>
          <td aria-label='role'>{user.isAdmin ? 'Admin' : 'Anggota'}</td>
        </tr>
      ))}
    </Fragment>
  )
}

export default UserItem
