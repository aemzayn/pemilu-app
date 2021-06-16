import Axios from 'axios'
import { LOGOUT } from '../actions/types'
import store from '../store'

const apiData = Axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

apiData.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT })
    }
    return Promise.reject(err)
  }
)

export default apiData
