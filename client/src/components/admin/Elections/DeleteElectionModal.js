import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deleteElection } from '../../../actions/elections'

const DeleteElectionModal = ({ show, setShow, electionId, deleteElection }) => {
  const handleClose = () => setShow(false)

  const handleDelete = id => {
    deleteElection(id)
    setShow(false)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Peringatan</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah kamu yakin ingin menghapus pemilihan ini?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Batal hapus
        </Button>
        <Button variant='danger' onClick={() => handleDelete(electionId)}>
          Ya, saya yakin
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default connect(null, { deleteElection })(DeleteElectionModal)
