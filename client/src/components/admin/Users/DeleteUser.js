import React, { useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deleteUser } from '../../../actions/users'

const DeleteUser = ({ deleteUser }) => {
  const [email, setEmail] = useState('')

  const handleChange = e => {
    setEmail(e.target.value.trim())
  }

  const handleDeleteUser = e => {
    e.preventDefault()
    deleteUser(email.trim())
    setEmail('')
  }

  return (
    <Form onSubmit={handleDeleteUser}>
      <Form.Row>
        <Col>
          <Form.Control
            type='email'
            placeholder='Masukkan Email user yang akan dihapus'
            value={email}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Button type='submit' variant='danger' disabled={!email && true}>
            Hapus user
          </Button>
        </Col>
      </Form.Row>
    </Form>
  )
}

export default connect(null, { deleteUser })(DeleteUser)
