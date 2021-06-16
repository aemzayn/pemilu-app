import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Image,
  Alert,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Redux
import { connect } from 'react-redux'
import { login } from '../../actions/auth'

const Login = ({ login, auth, messages }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (auth && auth.user) return <Redirect to='/home' />
  const { email, password } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    login(formData)
  }

  return (
    <Container className='fullHeight flex-center'>
      <Form
        className='authForm m-auto text-center align-middle'
        onSubmit={handleSubmit}
      >
        <Image
          className='mb-2 p-2'
          src={require('../../img/logo.jpg')}
          roundedCircle
        />
        <h3 className='font-weight-normal mb-3'>Login</h3>
        <InputGroup className='mb-3'>
          <FormControl
            type='email'
            name='email'
            placeholder='Email'
            aria-label='Email'
            required
            value={email}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className='mb-3'>
          <FormControl
            type='password'
            name='password'
            placeholder='Password'
            aria-label='Password'
            required
            value={password}
            onChange={handleChange}
          />
        </InputGroup>

        <Button
          variant='info'
          type='submit'
          disabled={!formData.email || !formData.password ? true : false}
        >
          Login
        </Button>
        <Link className='mt-2' to='/forgot-password'>
          Lupa password
        </Link>
        {messages &&
          messages.map(messages => (
            <Alert key={messages.id} variant={'danger'} className='mt-1'>
              {messages.msg}
            </Alert>
          ))}
      </Form>
    </Container>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  messages: state.messages,
})

export default connect(mapStateToProps, { login })(Login)
