import React, { Fragment, useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { makeVote } from '../../actions/elections'
import defaultCandidateImage from '../../img/no-image.jpg'

const Election = ({ election, makeVote }) => {
  const [formData, setFormData] = useState({
    candidateId: '',
    id: '',
  })

  const [agree, setAgree] = useState(false)
  const [message, setMessage] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    if (agree && formData.candidateId) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [agree, formData.candidateId])

  const handleClick = (candidateId, id) => {
    setFormData({
      candidateId,
      id,
    })
  }

  const handleSubmit = electionId => {
    setButtonDisabled(true)
    makeVote(electionId, formData)
    // setShowVoteButton(false)
    setHasVoted(true)
    setMessage('Suara diterima terima kasih sudah berpartisipasi')
  }

  const handleAgree = e => {
    setAgree(e.target.checked)
  }

  return (
    <div key={election._id} className='home-election'>
      {election.name && <h2>{election.name}</h2>}
      {election.description && <h5>{election.description}</h5>}

      {!election.hasStarted && !election.hasEnded ? (
        <div className='flex-center countdown mx-auto'>
          <span>
            Dimulai dalam: {'  '}
            <Countdown date={election.startDate} />
          </span>
        </div>
      ) : election.hasStarted && !election.hasEnded ? (
        <div className='flex-center countdown mx-auto'>
          <span>
            Akan berakhir dalam: {'  '}
            <Countdown date={election.endDate} />
          </span>
        </div>
      ) : null}
      {election.hasEnded && (
        <div className='flex-center countdown mx-auto'>
          <span>{election.name} sudah berakhir</span>
        </div>
      )}
      <Fragment>
        <main>
          {election.candidates.map(({ candidateId }, index) => (
            <div
              key={candidateId._id}
              className={`candidate d-flex ${
                formData.id === candidateId._id && 'selected'
              }`}
              onClick={() => handleClick(index + 1, candidateId._id)}
            >
              <div className='id flex-center'>
                {candidateId._id && <h1>{index + 1}</h1>}
              </div>
              <div className='profile'>
                {candidateId.name && (
                  <h2 className='name'>{candidateId.name}</h2>
                )}
                {candidateId.description && (
                  <p className='desc'>{candidateId.description}</p>
                )}
                {candidateId.cvUrl && (
                  <a
                    href={candidateId.cvUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {candidateId.cvUrl}
                  </a>
                )}
              </div>
              <div className='pic flex-center'>
                <img
                  src={candidateId.image || defaultCandidateImage}
                  alt={candidateId.name}
                  loading='lazy'
                />
              </div>
            </div>
          ))}
        </main>
        {election.hasStarted && !election.hasEnded && !hasVoted && (
          <Fragment>
            <p>*Untuk memilih klik di salah satu kandidat</p>
            <div className='check'>
              <input
                type='checkbox'
                name='valid'
                id='valid'
                value={agree}
                onChange={handleAgree}
              />
              <label htmlFor='valid' className='ml-1'>
                Saya yakin dengan pilihan saya
              </label>
            </div>
            <Button
              variant='primary'
              type='submit'
              disabled={buttonDisabled}
              onClick={() => handleSubmit(election._id)}
            >
              Submit
            </Button>
          </Fragment>
        )}
        {message && <h3>{message}</h3>}
      </Fragment>
    </div>
  )
}

const mapStateToProps = state => ({
  selection: state.auth.user.selection,
})

export default connect(mapStateToProps, { makeVote })(Election)
