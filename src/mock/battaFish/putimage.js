import getApiPrefix from '../../utils/getApiPrefix'

const url = `${getApiPrefix()}/putimage`

export default [
  {
    url,
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
  }
]
