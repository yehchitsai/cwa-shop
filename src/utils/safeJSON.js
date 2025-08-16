import { isObject } from 'lodash-es'

const safeJSON = (input) => {
  if (isObject(input)) {
    return JSON.stringify(input, null, 2)
  }

  try {
    return JSON.stringify(input, null, 2)
  } catch (e) {
    console.log('safeJSON error', e, input)
    return toString(input)
  }
}

export default safeJSON
