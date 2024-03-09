import getApiPrefix from '../../utils/getApiPrefix'

const MOCK_SIGNED_URL = `${getApiPrefix()}/mockSignedUrl`

export default [
  {
    url: `${getApiPrefix()}/getPreSignedUrls`,
    method: 'get',
    timeout: 1500,
    response: () => ({
      fileId: 'fileId',
      fileKey: 'mockFileKey.mov',
      parts: [{
        signedUrl: MOCK_SIGNED_URL,
        PartNumber: 1
      }]
    })
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
