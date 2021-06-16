import api from '../utils/api'
import { addMsg } from './messages'

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from './types'

// Load user
export const loadUser = () => async dispatch => {
  try {
    const res = await api.get('/users')

    dispatch({
      type: USER_LOADED,
      payload: res.data.user,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

// Register
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/users/register', formData)

    if (res.data.token) {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.token,
      })
      dispatch(loadUser())
    }

    dispatch(addMsg(res.data.msg))
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    })

    console.error(error.msg)
    dispatch(addMsg('Gagal mendaftar'))
  }
}

// Login
export const login = formData => async dispatch => {
  try {
    const res = await api.post('/users/login', formData)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token,
    })

    dispatch(loadUser())

    if (res.data.msg !== 'Login sukses') {
      dispatch(addMsg(res.data.msg))
    }
  } catch (err) {
    console.log(err)
    dispatch(addMsg(err.msg))
  }
}

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT })
}
