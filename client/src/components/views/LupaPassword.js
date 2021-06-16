import React, { useState } from 'react'
import { Button, Col, Container, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { sendResetPasswordEmail } from '../../actions/users'

const LupaPassword = ({ auth, sendResetPasswordEmail }) => {
  const [formData, setFormData] = useState({
    email: '',
  })
  const { email } = formData
  const [msg, setMsg] = useState('')

  if (auth && auth.isAuthenticated) {
    return <Redirect to='/home' />
  }

  const handleChange = e => {
    setFormData({
      email: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    sendResetPasswordEmail(formData)
    setMsg(
      `Email sudah dikirim ke ${email}, jika tidak menerima email coba beberapa saat lagi`
    )
    setFormData({
      email: '',
    })
  }
  return (
    <Container>
      <div className='mt-4'>
        <h1 className='mb-3'>Lupa Password?</h1>
        <Form onSubmit={handleSubmit}>
          {msg && <p>{msg}</p>}
          <Form.Row>
            <Col>
              <Form.Control
                type='email'
                placeholder='Email'
                value={email}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Button type='submit' variant='primary' disabled={!email && true}>
                Kirim
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

export default connect(mapStateToProps, { sendResetPasswordEmail })(
  LupaPassword
)
