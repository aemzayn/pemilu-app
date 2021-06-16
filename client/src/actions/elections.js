import api from '../utils/api'
import { addMsg } from './messages'
import {
  CREATE_ELECTION_FAILED,
  CREATE_ELECTION_SUCCESS,
  DELETE_ELECTION_SUCCESS,
  GET_ELECTIONS_SUCCESS,
  SET_CANDIDATES,
  GET_ELECTION_BY_ID,
  VOTE_SUCCESS,
  ELECTION_ERROR,
  ADD_CANDIDATE_TO_ELECTION_SUCCESS,
  REMOVE_CANDIDATE_FROM_ELECTION_SUCCESS,
  EDIT_ELECTION_SUCCESS,
  GET_USER_ELECTION_SUCCESS,
  ADD_USER_VOTED_ELECTION,
  DELETE_USER_VOTE,
} from './types'

export const getAllElections = () => async dispatch => {
  try {
    const res = await api.get('/elections')

    dispatch({
      type: GET_ELECTIONS_SUCCESS,
      payload: res.data.elections,
    })
  } catch (error) {
    dispatch(addMsg('Gagal mendapatkan pemilu'))
  }
}

export const getUserElection = () => async dispatch => {
  try {
    const res = await api.get('/elections/me')

    if (res.data.elections) {
      dispatch({
        type: GET_USER_ELECTION_SUCCESS,
        payload: res.data.elections,
      })
    }
  } catch (error) {
    dispatch(addMsg('Gagal mendapatkan pemilu'))
  }
}

export const createElection = formData => async dispatch => {
  try {
    const res = await api.post('/elections', formData)
    dispatch({
      type: CREATE_ELECTION_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: CREATE_ELECTION_FAILED,
    })
    dispatch(addMsg('Gagal membuat pemilu'))
  }
}

export const editElection = (formData, electionId) => async (
  dispatch,
  getState
) => {
  try {
    const res = await api.put(`/elections/${electionId}`, formData)

    const {
      elections: { elections },
    } = getState()

    const newElections = elections
      .filter(election => election._id !== electionId)
      .unshift(res.data.election)

    console.log(newElections)

    dispatch({
      type: EDIT_ELECTION_SUCCESS,
      payload: newElections,
    })
  } catch (error) {
    dispatch({
      type: CREATE_ELECTION_FAILED,
    })

    dispatch(addMsg('Gagal mengedit pemilu'))
  }
}

export const getElectionById = electionId => async dispatch => {
  try {
    const res = await api.get(`/elections/${electionId}`)

    dispatch({
      type: GET_ELECTION_BY_ID,
      payload: res.data.election,
    })

    dispatch({
      type: SET_CANDIDATES,
      payload: res.data.candidates,
    })
  } catch (error) {
    dispatch(addMsg('Gagal mendapatkan pemilu'))
  }
}

export const getElectionEdit = id => (dispatch, getState) => {
  const {
    elections: { elections },
  } = getState()

  return elections.filter(election => election._id === id)
}

export const deleteElection = electionId => async dispatch => {
  try {
    const res = await api.delete(`/elections/${electionId}`)

    dispatch({
      type: DELETE_ELECTION_SUCCESS,
      payload: electionId,
    })
  } catch (error) {
    dispatch({
      type: ELECTION_ERROR,
      payload: error.msg,
    })

    dispatch(addMsg('Gagal menghapus pemilu'))
  }
}

export const makeVote = (electionId, candidateId) => async dispatch => {
  try {
    const res = await api.post(`/elections/${electionId}`, candidateId)

    if (res.data.elections) {
      dispatch({
        type: VOTE_SUCCESS,
        payload: res.data.elections,
      })

      dispatch({
        type: ADD_USER_VOTED_ELECTION,
        payload: res.data.election,
      })

      setTimeout(() => {
        dispatch(getUserElection())
      }, 5000)
    }
  } catch (error) {
    dispatch({
      type: ELECTION_ERROR,
      payload: error.msg,
    })

    dispatch(addMsg('Gagal memilih'))
  }
}

export const addCandidateToElection = (
  electionId,
  formData
) => async dispatch => {
  try {
    const res = await api.post(`/elections/${electionId}/candidates`, formData)

    dispatch({
      type: GET_ELECTIONS_SUCCESS,
      payload: res.data.elections,
    })

    dispatch({
      type: ADD_CANDIDATE_TO_ELECTION_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: ELECTION_ERROR,
      payload: error.msg,
    })
  }
}

export const removeCandidateFromElection = (electionId, candidateId) => async (
  dispatch,
  getState
) => {
  try {
    const res = await api.delete(
      `/elections/${electionId}/candidates/${candidateId}`
    )

    const {
      elections: { elections },
    } = getState()

    const candidatesLeft = elections
      .filter(election => election._id === electionId)[0]
      .candidates.filter(candidate => candidate.candidateId._id !== candidateId)

    dispatch({
      type: REMOVE_CANDIDATE_FROM_ELECTION_SUCCESS,
      payload: candidatesLeft,
    })
  } catch (error) {
    dispatch({
      type: ELECTION_ERROR,
      payload: error.msg,
    })

    dispatch(addMsg('Gagal menghapus kandidat'))
  }
}

export const setElectionToEnd = electionId => async (dispatch, getState) => {
  try {
    const res = await api.post(`/elections/${electionId}/end`)

    dispatch({
      type: EDIT_ELECTION_SUCCESS,
      payload: res.data.elections,
    })
  } catch (error) {
    dispatch({
      type: ELECTION_ERROR,
      payload: error.msg,
    })
  }
}

export const deleteVote = (formData, electionId) => async dispatch => {
  try {
    const res = await api.put(`/elections/${electionId}/vote`, formData)
    if (res.data.election) {
      dispatch({
        type: DELETE_USER_VOTE,
        payload: res.data.election,
      })
    }
  } catch (error) {
    console.log('Gagal menghapus vote', error)
  }
}
