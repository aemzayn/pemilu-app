import { combineReducers } from 'redux'
import auth from './auth'
import users from './users'
import elections from './elections'
import candidates from './candidates'
import messages from './messages'

export default combineReducers({
  auth,
  users,
  elections,
  candidates,
  messages,
})
