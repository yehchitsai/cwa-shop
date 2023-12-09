import { get, isEmpty } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

export default [
  {
    url: `${getApiPrefix()}/checkAuthorize`,
    method: 'get',
    timeout: 1500,
    response: (response) => {
      const authorization = get(response, 'headers.authorization')
      if (isEmpty(authorization)) {
        return { message: 'Unauthorized' }
      }
      return { message: 'MOCK USER' }
    }
  }
]
