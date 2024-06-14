import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

export default [
  {
    url: `${getApiPrefix()}/purchase/uploadquotation`,
    method: 'post',
    timeout: 100,
    response: () => {
      const fail_count = random(0, 5)
      return {
        message: 'success',
        results: {
          success_count: random(100, 50),
          fail_count,
          fail_description: fail_count === 0
            ? []
            : ['第11筆記錄FF1322L資料重複']
        }
      }
    }
  }
]
