import { times } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

const MOCK_SIGNED_URL = `${getApiPrefix()}/mockSignedUrl`

export default [
  {
    url: `${getApiPrefix()}/getPreSignedUrls`,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        parts = 1
      } = JSON.parse(JSON.stringify(stringObject))
      return {
        fileId: 'fileId',
        fileKey: 'mockFileKey.mov',
        parts: times(+parts, (index) => {
          const PartNumber = index + 1
          return {
            signedUrl: `${MOCK_SIGNED_URL}?part=${PartNumber}`,
            PartNumber
          }
        })
      }
    }
  },
  {
    url: MOCK_SIGNED_URL,
    method: 'put',
    timeout: 1500,
    response: () => ({})
  },
  {
    url: `${getApiPrefix()}/finalize`,
    method: 'post',
    timeout: 1500,
    response: () => ({})
  }
]
