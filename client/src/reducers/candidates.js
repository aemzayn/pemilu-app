import {
  ADD_CANDIDATE_FAILED,
  ADD_CANDIDATE_SUCCESS,
  CANDIDATE_ERROR,
  REMOVE_CANDIDATE,
  SET_CANDIDATES,
} from '../actions/types'

const initialState = {
  candidates: [],
  loading: true,
  error: [],
}

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case ADD_CANDIDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        candidates: [...state.candidates, payload],
      }
    case ADD_CANDIDATE_FAILED:
      return {
        ...state,
        loading: false,
      }
    case SET_CANDIDATES:
      return {
        ...state,
        loading: false,
        candidates: payload,
      }
    case REMOVE_CANDIDATE:
      return {
        ...state,
        loading: false,
        candidates: state.candidates.filter(
          candidate => candidate._id !== payload
        ),
      }
    case CANDIDATE_ERROR:
      return {
        ...state,
        loading: false,
        error: state.error.unshift(payload),
      }
    default:
      return state
  }
}
