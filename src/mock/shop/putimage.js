import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/putimage`,
    method: 'post',
    timeout: 100,
    response: () => ({
      message: 'success',
      results: {
        itemImages: [
          'https://serverless-resize.s3.ap-southeast-1.amazonaws.com/origin/aaa.png'
        ],
        itemVideos: [
          'https://serverless-resize.s3.ap-southeast-1.amazonaws.com/origin/bbb.mp4'
        ],
        itemSerial: '456',
        fishType: 'FF1322L',
        onSite: '2023/10/29, 12:48:29',
        booked: ''
      }
    })
  },
  {
    url: `${awsHostPrefix}/zipvideo`,
    method: 'post',
    timeout: 100,
    response: () => ({
      status: 'success',
      reason: '已傳送'
    })
  }
]
