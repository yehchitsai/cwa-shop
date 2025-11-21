import {
  flow, get, keys, random, times
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (size, text) => {
  return `https://dummyimage.com/${size}x${size * 3}/?text=${text}&font=lobster&font_size=50`
}

const TYPE_KEY = [
  'FF1301L',
  'FF1301LF',
  'FF1302L'
]

const RECOGNITION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAIL: 'fail',
  EDIT: 'edit'
}

const RECOGNITION_STATUS_LIST = [
  RECOGNITION_STATUS.PENDING,
  RECOGNITION_STATUS.FAIL,
  RECOGNITION_STATUS.SUCCESS,
  RECOGNITION_STATUS.EDIT
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
    url: `${awsHostPrefix}/getRecognition`,
    method: 'get',
    timeout: 100,
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
        originItemImage: getFakeImage(500, 'originItemImage'),
        fishType: TYPE_KEY[random(0, 2)],
        itemSerial: `${random(100, 1000)}`,
        itemImages: flow(
          () => random(2, 3),
          (count) => times(count, (index) => {
            const size = 200 * (index + 1)
            return getFakeImage(size, `${file} ${index}`)
          })
        )()
      }

      if (status === RECOGNITION_STATUS.EDIT) {
        const omitResults = flow(
          () => keys(results),
          (resultKeys) => get(resultKeys, random(0, resultKeys.length - 1)),
          (resultKey) => ({ ...results, [resultKey]: resultKey === 'itemImages' ? [] : '' })
        )()
        return {
          status,
          results: omitResults
        }
      }
      return {
        status,
        results
      }
    }
  }
]
