import React from 'react'
import { useState } from 'react'
import { Col, Form, Row, Button, Container } from 'react-bootstrap'
import { addCandidate } from '../../../actions/candidates'
import { connect } from 'react-redux'
import FileBase64 from 'react-file-base64'

const AddCandidate = ({ addCandidate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cvUrl: '',
    image: '',
  })

  const [message, setMessage] = useState({
    text: '',
    type: 'success',
  })

  const { name, description, cvUrl } = formData

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    try {
      addCandidate(formData)
      setFormData({
        name: '',
        description: '',
        cvUrl: '',
      })
      setMessage({
        text: 'Sukses menambah kandidat',
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: 'Gagal menambah kandidat',
        type: 'danger',
      })
    }

    setTimeout(() => {
      setMessage({ text: '' })
    }, 10000)
  }

  return (
    <Container className='mt-4'>
      <h1>Add Candidate</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId='candidateName'>
          <Form.Label column sm={2}>
            Nama*
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='text'
              name='name'
              onChange={handleChange}
              value={name || ''}
              placeholder='Nama Kandidat'
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId='candidateDescription'>
          <Form.Label column sm={2}>
            Deskripsi*
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='text'
              name='description'
              onChange={handleChange}
              value={description || ''}
              placeholder='Deskripsi Kandidat'
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId='cvUrl'>
          <Form.Label column sm={2}>
            Link CV
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='url'
              name='cvUrl'
              onChange={handleChange}
              value={cvUrl || ''}
              placeholder='Link CV Kandidat'
            />
            <Form.Text className='text-muted'>
              Link ke Cv kandidat, bisa ke google drive dsb
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId='image'>
          <Form.Label column sm={2}>
            Foto kandidat
          </Form.Label>
          <Col sm={10}>
            <FileBase64
              type='file'
              multiple={false}
              onDone={({ base64 }) =>
                setFormData({ ...formData, image: base64 })
              }
            />
          </Col>
        </Form.Group>

        <div>
          <Button
            variant='info'
            type='submit'
            className='mb-2'
            disabled={(!name || !description) && true}
          >
            Tambah Kandidat
          </Button>
          {message.text && (
            <span className={`text-${message.type} ml-2`}>{message.text}</span>
          )}
        </div>
      </Form>
    </Container>
  )
}

export default connect(null, { addCandidate })(AddCandidate)
