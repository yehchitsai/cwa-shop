import { times } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const MOCK_SIGNED_URL = `${awsHostPrefix}/mockSignedUrl`

export default [
  {
    url: `${awsHostPrefix}/presignedurls`,
    method: 'get',
    timeout: 100,
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
    timeout: 100,
    response: () => ({})
  },
  {
    url: `${awsHostPrefix}/uploadfinalize`,
    method: 'post',
    timeout: 100,
    response: () => ({})
  }
]
