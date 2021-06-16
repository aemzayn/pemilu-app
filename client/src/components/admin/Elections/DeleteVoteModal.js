import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const DeleteVoteModal = ({
  show,
  setShow,
  deleteVote,
  formData,
  electionId,
}) => {
  const isValid = formData.name || formData.ppi || formData.id

  const handleDelete = () => {
    deleteVote(formData, electionId)
    setShow(false)
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Peringatan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formData.name ? (
          <span>
            Apakah kamu yakin ingin menghapus suara{' '}
            <span className='font-weight-bold'>
              {formData.name} {formData.ppi}
            </span>
          </span>
        ) : (
          'Nama tidak ditemukan'
        )}
      </Modal.Body>
      <Modal.Footer>
        {isValid ? (
          <>
            <Button variant='secondary' onClick={() => setShow(false)}>
              Batal hapus
            </Button>
            <Button variant='danger' onClick={handleDelete}>
              Ya, saya yakin
            </Button>
          </>
        ) : (
          <Button variant='primary' onClick={() => setShow(false)}></Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteVoteModal
