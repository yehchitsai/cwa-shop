import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/uploadnewfish`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '成功處理150筆數據',
          success_count: 150,
          download_url: 'https://s3.amazonaws.com/bucket/upload/2.arranged_tank_no/arranged_202509'
        }
        : {
          message: '文件格式錯誤',
          fail_count: 2,
          validation_errors: [
            {
              row_number: 3,
              field_name: '進貨數量',
              error_message: '必須為正整數'
            },
            {
              row_number: 5,
              field_name: '廠商代碼',
              error_message: '代碼格式不正確'
            }
          ]
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploadtankinfo`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '櫃位數據導入成功',
          success_count: 45
        }
        : {
          message: '文件格式錯誤',
          validation_errors: [
            {
              field_name: '文件格式',
              error_message: '必須為有效的Excel文件'
            }
          ]
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/recoveredata`,
    method: 'get',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          data: [
            '2025-09-24T10:00:00Z',
            '2025-09-25T10:00:00Z'
          ]
        }
        : {
          message: '找不到指定時間點的備份數據'
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/recoveredata`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '數據恢復成功',
          recovered_to: '2025-09-24T10:00:00Z'
        }
        : {
          message: '找不到指定時間點的備份數據',
          validation_errors: [{
            error_message: '備份文件不存在或已損毀'
          }]
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/bettafishsystemstate`,
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
    url: `${awsHostPrefix}/bettafishsystemstate`,
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
