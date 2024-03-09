import { flow, random, times } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (size, text) => {
  return `https://fakeimg.pl/${size}x${size * 3}/?text=${text}&font=lobster&font_size=50`
}

const RECOGNITION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAIL: 'fail'
}

const RECOGNITION_STATUS_LIST = [
  RECOGNITION_STATUS.PENDING,
  RECOGNITION_STATUS.FAIL,
  RECOGNITION_STATUS.SUCCESS
]

const resultError = (message = 'Request failed', { code = 0, result = null } = {}) => {
  return {
    code,
    result,
    message,
    type: 'error'
  }
}

export default [
  {
    url: `${getApiPrefix()}/getRecognition`,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        file
      } = JSON.parse(JSON.stringify(stringObject))
      const status = RECOGNITION_STATUS_LIST[random(0, RECOGNITION_STATUS_LIST.length - 1)]
      if (status === RECOGNITION_STATUS.PENDING) {
        return { status }
      }

      if (status === RECOGNITION_STATUS.FAIL) {
        return {
          status,
          ...resultError()
        }
      }

      const results = {
        itemVideo: videos[random(0, 2)],
        fishType: `FF${random(1000, 2000)}L`,
        itemSerial: `${random(100, 1000)}`,
        itemImages: flow(
          () => random(2, 3),
          (count) => times(count, (index) => {
            const size = 200 * (index + 1)
            return getFakeImage(size, `${file} ${index}`)
          })
        )()
      }
      return {
        status,
        results
      }
    }
  }
]
