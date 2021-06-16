import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Col, Container, Form } from 'react-bootstrap'

// redux
import { connect } from 'react-redux'
import { changePassword } from '../../actions/users'

const ResetPassword = ({ auth, changePassword, match }) => {
  const [formData, setFormData] = useState({
    password: '',
    jwtToken: match.params.token,
  })
  const { password } = formData
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (match.params.token) {
      setFormData({
        ...formData,
        jwtToken: match.params.token,
      })
    }
  }, [match.params.token])

  if (auth && auth.isAuthenticated) {
    return <Redirect to='/home' />
  }

  const handleChange = e => {
    setFormData({
      ...formData,
      password: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await changePassword(formData)
    if (res.status === 200) {
      setMsg(res.data.msg)
    } else {
      setMsg('Gagal mengganti password')
    }
    setFormData({
      password: '',
    })
  }

  return (
    <Container>
      <div className='mt-4'>
        <Form onSubmit={handleSubmit}>
          <h1>Ganti password</h1>
          {msg && <p>{msg}</p>}
          <Form.Row>
            <Col>
              <Form.Control
                type='password'
                placeholder='Password baru min. 6 karakter'
                min={6}
                value={password}
                name='password'
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Button
                type='submit'
                variant='primary'
                disabled={!password && true}
              >
                Ganti password
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </div>
    </Container>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, { changePassword })(ResetPassword)
