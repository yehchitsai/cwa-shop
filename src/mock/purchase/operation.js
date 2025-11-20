import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/systemstate`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        system_type = 'empty'
      } = JSON.parse(JSON.stringify(stringObject))
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          systems: system_type === 'empty'
            ? ['external', 'internal'].map((type) => {
              return {
                system_type: type,
                status: ['on', 'off'][random(0, 1)]
              }
            })
            : [{
              system_type,
              status: ['on', 'off'][random(0, 1)]
            }]
        }
        : {
          message: '獲取系統狀態失敗'
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/systemstate`,
    method: 'post',
    timeout: 100,
    response: ({ body = {} }) => {
      const {
        system_type,
        action
      } = body
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '鬥魚系統狀態更新成功',
          systems: [{
            system_type,
            status: action
          }]
        }
        : {
          message: '系統忙線中，請稍後再試'
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  }
]
