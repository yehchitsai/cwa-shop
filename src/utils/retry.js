import safeAwait from 'safe-await'
import { get } from 'lodash-es'

const defaultGetErrorMessage = ({ error }) => {
  return get(error, 'message', error)
}

const retry = (getMessage = defaultGetErrorMessage) => async (action, checker, times = 10) => {
  const [error, result] = await safeAwait(action())
  const isExpectResult = checker(result)
  if (times === 0 || isExpectResult) {
    if (isExpectResult) {
      return result
    }

    console.log(error, result)
    throw new Error(getMessage({ error, result }))
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(retry(getMessage)(action, checker, times - 1))
    }, 3000)
  })
}

export default retry
