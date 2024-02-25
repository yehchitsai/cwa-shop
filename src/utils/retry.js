import safeAwait from 'safe-await'
import { get } from 'lodash-es'

const retry = (errorMessage) => async (action, checker, times = 10) => {
  const [error, result] = await safeAwait(action())
  const isExpectResult = checker(result)
  if (times === 0 || isExpectResult) {
    if (isExpectResult) {
      return result
    }

    console.log(error)
    throw new Error(errorMessage || get(error, 'message', error))
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(retry(errorMessage)(action, checker, times - 1))
    }, 3000)
  })
}

export default retry
