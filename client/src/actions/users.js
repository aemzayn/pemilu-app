import api from '../utils/api'
import { addMsg } from './messages'
import {
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
  RESEND_TOKEN_SUCCESS,
  RESEND_TOKEN_FAIL,
  VERIF_TOKEN_SUCCESS,
  VERIF_TOKEN_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
} from './types'

export const getAllUsers = () => async dispatch => {
  try {
    const res = await api.get('/admin/users')

    dispatch({
      type: GET_USERS_SUCCESS,
      payload: res.data.users,
    })
  } catch (error) {
    dispatch({
      type: GET_USERS_FAIL,
    })
    dispatch(addMsg('Gagal mendapatkan user'))
  }
}

export const reSendVerifToken = () => async dispatch => {
  try {
    const res = await api.post('/confirmation/resend-token')

    dispatch({
      type: RESEND_TOKEN_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: RESEND_TOKEN_FAIL,
    })

    dispatch(addMsg('Gagal mengirim email'))
  }
}

export const verifiyToken = token => async dispatch => {
  try {
    const res = await api.post(`/confirmation/confirm/${token}`)

    dispatch({
      type: VERIF_TOKEN_SUCCESS,
    })

    dispatch(addMsg(res.data.msg))
  } catch (error) {
    dispatch({
      type: VERIF_TOKEN_FAIL,
    })

    dispatch(addMsg('Gagal mengkonfirmasi user'))
  }
}

export const deleteUser = email => async dispatch => {
  try {
    const res = await api.delete(`/admin/users/${email}`)

    dispatch(getAllUsers())

    dispatch({
      type: DELETE_USER_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
    })

    dispatch(addMsg('Gagal menghapus user'))
  }
}

export const sendResetPasswordEmail = formData => async dispatch => {
  try {
    const res = await api.post('/users/reset-password', formData)
    dispatch(addMsg(res.data.msg))
  } catch (error) {
    dispatch(addMsg('Gagal mengirim email'))
  }
}

export const changePassword = formData => async dispatch => {
  try {
    const res = await api.post('/users/change-password', formData)
    dispatch(addMsg(res.data.msg))
  } catch (error) {
    dispatch(addMsg('Gagal mengganti password'))
  }
}
