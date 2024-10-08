import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/uploadquotation`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = [true, false][random(0, 1)]
      const result = isSuccess
        ? { success_count: random(100, 500) }
        : {
          fail_count: random(0, 5),
          fail_description: ['第11筆記錄FF1322L資料重複']
        }
      return {
        message: 'success',
        results: {
          category_count: random(100, 500),
          subcategory_count: random(10, 50),
          ...result
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/demandreport`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        message: 'success'
      }
    }
  }
]
