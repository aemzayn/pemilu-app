import React, { useEffect, useState } from 'react'
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Image,
  Alert,
  Jumbotron,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { register } from '../../actions/auth'
import regions from '../regions'

const Register = ({ register, auth, messages }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ppi: 'PPI Ankara',
    password: '',
  })

  if (auth && auth.user) return <Redirect to='/' />

  const { name, email, password } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    register(formData)
  }

  return (
    <Container className='fullHeight'>
      <div className='mt-4'>
        <Jumbotron>
          <h1>
            Pemilu Ketua PPI Turki periode 2021/2022 sudah berakhir Terima
            Kasih.
          </h1>
        </Jumbotron>
      </div>
      {/* <Form
        className='authForm m-auto text-center align-middle'
        onSubmit={handleSubmit}
      >
        <Image
          className='mb-2 p-2'
          src={require('../../img/logo.jpg')}
          roundedCircle
        />
        <h3 className='font-weight-normal'>Daftar</h3>
        <p className='text-muted'>
          Daftar untuk mendapatkan hak pilih di pemilu PPI Turki 2020
        </p>
        <InputGroup className='mb-3'>
          <FormControl
            type='text'
            name='name'
            placeholder='Nama Lengkap'
            aria-label='Name Lengkap'
            onChange={handleChange}
            value={name}
            id='name'
            required
          />
        </InputGroup>
        <InputGroup className='mb-3'>
          <FormControl
            type='email'
            name='email'
            placeholder='Email'
            aria-label='Email'
            onChange={handleChange}
            value={email}
            id='email'
            required
          />
        </InputGroup>

        <InputGroup className='mb-3'>
          <InputGroup.Prepend>
            <InputGroup.Text>PPI Wilayah</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl name='ppi' id='ppi' as='select' onChange={handleChange}>
            {regions.map((region, index) => (
              <option key={index} value={region.fullName}>
                {region.fullName}
              </option>
            ))}
          </FormControl>
        </InputGroup>

        <InputGroup className='mb-3'>
          <FormControl
            type='password'
            name='password'
            placeholder='Password min 6 karakter'
            aria-label='Password'
            onChange={handleChange}
            value={password}
            id='password'
            min={6}
            required
          />
        </InputGroup>
        <Button
          type='submit'
          variant='info'
          disabled={
            !formData.name ||
            !formData.email ||
            !formData.ppi ||
            !formData.password
              ? true
              : false
          }
        >
          Register
        </Button>
        {messages &&
          messages.map(messages => (
            <Alert key={messages.id} variant={'danger'} className='mt-1'>
              {messages.msg}
            </Alert>
          ))}
      </Form> */}
    </Container>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  messages: state.messages,
})

export default connect(mapStateToProps, { register })(Register)
