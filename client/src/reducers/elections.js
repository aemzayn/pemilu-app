import {
  CREATE_ELECTION_FAILED,
  CREATE_ELECTION_SUCCESS,
  GET_ELECTIONS_SUCCESS,
  DELETE_ELECTION_SUCCESS,
  GET_ELECTION_BY_ID,
  REMOVE_CANDIDATE_FROM_ELECTION_SUCCESS,
  EDIT_ELECTION_SUCCESS,
  GET_USER_ELECTION_SUCCESS,
  VOTE_SUCCESS,
  ADD_USER_VOTED_ELECTION,
  DELETE_USER_VOTE,
} from '../actions/types'

const initalState = {
  elections: [],
  election: '',
  userElections: [],
  votes: [],
}

export default function (state = initalState, action) {
  const { type, payload } = action
  switch (type) {
    case GET_ELECTIONS_SUCCESS:
      return {
        ...state,
        elections: payload,
      }
    case GET_USER_ELECTION_SUCCESS:
      return {
        ...state,
        userElections: payload,
      }
    case CREATE_ELECTION_SUCCESS:
      return {
        ...state,
      }
    case CREATE_ELECTION_FAILED:
      return {
        ...state,
      }
    case EDIT_ELECTION_SUCCESS:
      return {
        ...state,
        elections: payload,
      }
    case DELETE_ELECTION_SUCCESS:
      return {
        ...state,
        elections: state.elections.filter(election => election._id !== payload),
      }
    case GET_ELECTION_BY_ID:
      return {
        ...state,
        election: payload,
      }
    case REMOVE_CANDIDATE_FROM_ELECTION_SUCCESS:
      return {
        ...state,
      }
    case VOTE_SUCCESS:
      return {
        ...state,
        userElections: payload,
      }
    case ADD_USER_VOTED_ELECTION:
      return {
        ...state,
        votes: [...state.votes, payload],
      }
    case DELETE_USER_VOTE:
      return {
        ...state,
        election: payload,
      }
    default:
      return state
  }
}
