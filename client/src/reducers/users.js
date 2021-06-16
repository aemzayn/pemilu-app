import {
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  RESEND_TOKEN_SUCCESS,
  RESEND_TOKEN_FAIL,
  VERIF_TOKEN_SUCCESS,
  VERIF_TOKEN_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
} from '../actions/types'

const initialState = {
  users: '',
  loading: true,
  message: '',
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: payload,
        loading: false,
      }
    case GET_USERS_FAIL:
      return {
        ...state,
        loading: false,
      }
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: true,
      }
    case DELETE_USER_FAIL:
      return {
        ...state,
        loading: false,
      }
    case RESEND_TOKEN_SUCCESS:
      return {
        ...state,
      }
    case RESEND_TOKEN_FAIL:
      return {
        ...state,
      }
    case VERIF_TOKEN_SUCCESS:
      return {
        ...state,
        message: 'Sukses konfirmasi email',
      }
    case VERIF_TOKEN_FAIL:
      return {
        ...state,
        message: 'Gagal konfirmasi email',
      }
    default:
      return state
  }
}
