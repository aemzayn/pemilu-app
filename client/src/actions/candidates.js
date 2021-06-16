import api from '../utils/api'
import { addMsg } from './messages'
import {
  ADD_CANDIDATE_FAILED,
  ADD_CANDIDATE_SUCCESS,
  CANDIDATE_ERROR,
  REMOVE_CANDIDATE,
  SET_CANDIDATES,
} from './types'

export const getCandidates = () => async dispatch => {
  try {
    const res = await api.get('/candidates')

    dispatch({
      type: SET_CANDIDATES,
      payload: res.data.candidates,
    })
  } catch (error) {
    dispatch({
      type: CANDIDATE_ERROR,
      payload: error.msg,
    })
  }
}

// Menambah kandidat ke pemilu
export const addCandidate = formData => async dispatch => {
  try {
    const res = await api.post('/candidates', formData)

    dispatch({
      type: ADD_CANDIDATE_SUCCESS,
      payload: res.data.elections,
    })
  } catch (error) {
    dispatch({
      type: ADD_CANDIDATE_FAILED,
      payload: error.msg,
    })
  }
}

export const deleteCandidate = id => async dispatch => {
  try {
    const res = await api.delete(`/candidates/${id}`)

    dispatch({
      type: REMOVE_CANDIDATE,
      payload: id,
    })
  } catch (error) {
    dispatch({
      type: CANDIDATE_ERROR,
      payload: error.msg,
    })
  }
}
