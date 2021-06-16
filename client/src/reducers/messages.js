import { SET_MESSAGE, REMOVE_MESSAGE } from '../actions/types'

const initialState = []

export default function (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_MESSAGE:
      return [...state, payload]
    case REMOVE_MESSAGE:
      return state.filter(msg => msg.id !== payload)
    default:
      return state
  }
}
