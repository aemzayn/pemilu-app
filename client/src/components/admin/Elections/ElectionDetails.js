import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import queryString from 'query-string'
import EditElection from './EditElection'
import FullSpinner from '../../layout/FullSpinner'
import PieChart from '../../lib/PieChart'
import REGIONS from '../../regions'
import { CSVLink } from 'react-csv'

// redux
import { connect } from 'react-redux'
import { getElectionById, deleteVote } from '../../../actions/elections'
import BarChart from '../../lib/BarChart'
import ElectionVoters from './ElectionVoters'
import { LOGIN_FAIL } from '../../../actions/types'

const ElectionDetails = ({
  location,
  match,
  getElectionById,
  election,
  deleteVote,
}) => {
  const [mainChartData, setMainChartData] = useState({
    labels: [],
    data: [],
  })

  const [header, setHeader] = useState([])
  const [voterData, setVoterData] = useState([])

  useEffect(() => {
    getElectionById(match.params.id)
  }, [])

  console.log(election)

  // Main chart
  useEffect(() => {
    if (election) {
      const labels = election.candidates.map(
        candidate => candidate.candidateId.name
      )
      const data = election.candidates.map(candidate => candidate.totalVotes)

      setMainChartData({
        labels: labels,
        data: data,
      })
    }
  }, [election])

  // Useffect untuk file csv daftar pemilih
  useEffect(() => {
    const headerData =
      election.candidates &&
      election.candidates.map((c, i) => ({
        label: `Pemilih ${c.candidateId.name}`,
        key: c.candidateId._id,
      }))

    if (headerData) {
      setHeader([
        { label: 'Name', key: 'name' },
        { label: 'PPI', key: 'ppi' },
      ])
    }

    if (election.candidates) {
      const { candidates } = election

      candidates.forEach(c => {
        c.voters.forEach(v => {
          setVoterData(data => [
            ...data,
            {
              name: v.name,
              ppi: v.ppi,
              [c.candidateId._id]: 'v',
            },
          ])
        })
      })
    }
  }, [election.candidates])

  const { edit, voters } = queryString.parse(location.search)

  return (
    <>
      {edit && <EditElection />}
      {voters && <ElectionVoters election={election} deleteVote={deleteVote} />}
      {election && !edit && !voters && (
        <Container className='mt-4'>
          {election ? (
            <div className='bg-white p-4'>
              <div>
                <small className='text-muted'>ID: {election._id}</small>
                <h1>{election.name}</h1>
                {header && voterData && election.hasEnded && (
                  <CSVLink
                    data={voterData}
                    headers={header}
                    filename={'data-pemilu.csv'}
                  >
                    Download data pemilu
                  </CSVLink>
                )}
              </div>
              <hr />
              <div>
                <h6>Deskripsi</h6>
                <p>{election.description}</p>
              </div>
              {election.hasEnded && (
                <div>
                  <h6>Total suara: </h6>
                  <span>{election.totalVotes}</span>
                </div>
              )}
              <div className='mt-2'>
                <h6>Kandidat</h6>
                <ol>
                  {election.candidates.map(c =>
                    c.candidateId._id ? (
                      <li key={c.candidateId._id}>
                        <span>
                          {c.candidateId.name}{' '}
                          {election.hasEnded && (
                            <span className='font-italic text-muted'>
                              {c.totalVotes} suara
                            </span>
                          )}
                        </span>
                      </li>
                    ) : (
                      <li key={c._id} className='text-muted'>
                        Kandidat tidak ditemukan
                      </li>
                    )
                  )}
                </ol>
              </div>
              {election.hasEnded && (
                <div className='flexCenter full-width'>
                  <h4>Grafik suara total</h4>
                  <PieChart
                    title={election.name}
                    labels={mainChartData.labels}
                    data={mainChartData.data}
                  />
                </div>
              )}
              {election.hasEnded && (
                <div className='flexCenter full-width my mt-5'>
                  <h4>Grafik suara per kandidat</h4>
                  {election.candidates.map(candidate => {
                    const labels = REGIONS.map(r => r.fullName)
                    const data = Object.values(candidate.votesPerRegion)

                    return candidate.candidateId._id ? (
                      <div key={candidate._id} className='mb-5'>
                        <BarChart
                          title={`Kandidat: ${candidate.candidateId.name}`}
                          labels={labels}
                          data={data}
                        />
                      </div>
                    ) : (
                      <div key={candidate._id}>Kandidat tidak ditemukan</div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <FullSpinner />
          )}
        </Container>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  election: state.elections.election,
})

export default connect(mapStateToProps, { getElectionById, deleteVote })(
  ElectionDetails
)
