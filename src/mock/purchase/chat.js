import { random, times } from 'lodash-es'
import { add, formatISO } from 'date-fns'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const today = new Date()

const getFakeImage = (width, height, text) => {
  return `https://fakeimg.ryd.tools/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

const getRecommendations = (query = 'history') => {
  return {
    response: `下面是 ${query} 的鬥魚...`,
    results: times(random(5, 10)).map((index) => {
      return {
        name: `適合新手的鬥魚 ${index}`,
        uuid: `uuid_${index}`,
        image: getFakeImage(200, 200, 'fish'),
        description: '魚描述'.repeat(random(10, 20))
      }
    })
  }
}

export default [
  {
    url: `${awsHostPrefix}/chathistory`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        records: times(random(10, 20)).map((index) => {
          return {
            question: `This is question ${index}`,
            reply: getRecommendations(),
            lastUpdatedAt: formatISO(add(today, { minutes: 10 * index * -1 }))
          }
        }).reverse()
      }
    }
  },
  {
    url: `${awsHostPrefix}/recommendations`,
    method: 'post',
    timeout: 3000,
    response: ({ query: stringObject }) => {
      const {
        query = 'recommendations 問題'
      } = JSON.parse(JSON.stringify(stringObject))
      const error = random(0, 1)
      if (error === 1) {
        return {
          success: false
        }
      }

      return {
        success: true,
        ...getRecommendations(query)
      }
    }
  }
]
