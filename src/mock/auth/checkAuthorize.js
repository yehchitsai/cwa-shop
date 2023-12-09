import getApiPrefix from '../../utils/getApiPrefix'

export default [
  {
    url: `${getApiPrefix()}/checkAuthorize`,
    method: 'get',
    timeout: 1500,
    response: () => {
      return { message: 'MOCK USER' }
    }
  }
]
