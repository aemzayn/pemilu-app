import { v4 as uuidv4 } from 'uuid'
import { SET_MESSAGE, REMOVE_MESSAGE } from './types'

export const addMsg = msg => dispatch => {
  const id = uuidv4()
  dispatch({
    type: SET_MESSAGE,
    payload: { id, msg },
  })

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_MESSAGE,
        payload: id,
      }),
    5000
  )
}
