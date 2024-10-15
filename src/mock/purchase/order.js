import {
  isString, isUndefined, random, size, times
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

// const counts = times(10, (index) => index + 0.5)

const statusList = [
  { status: 'fail', message: '購買數量大於庫存' },
  { status: 'success', message: '正常' },
  { status: 'fail', message: '購買數量大於庫存2' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' }
]

export default [
  {
    url: `${awsHostPrefix}/prepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      return {
        message: 'success',
        results: {
          items: order_items.map(({ fish_code, quantity, request = '' }) => {
            return {
              fish_code,
              quantity,
              request,
              unit_price: random(1000, 2000),
              ...(statusList[random(0, size(statusList - 1))])
            }
          }),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          total_quantity: random(10, 100),
          total_price: `${random(100, 200)}.${random(1000, 2000)}`
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/prepurchaseorder`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        message: 'success',
        results: {
          total_quantity: random(5, 10),
          total_price: `${random(10, 20)}.${random(1000, 2000)}`,
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          items: times(random(1, 3)).map((index) => {
            const fish_code = `FF120L${index}`
            const quantity = random(100, 500)
            const request = ['smaller', 'bigger'][random(0, 1)]
            return {
              fish_code,
              quantity,
              request,
              unit_price: random(1000, 2000),
              ...(statusList[random(0, size(statusList - 1))])
            }
          })
        }
      }
    }
  },
  // function duplicated of post-prepurchaseorder
  // {
  //   url: `${awsHostPrefix}/preconfirmorder`,
  //   method: 'post',
  //   timeout: 100,
  //   response: ({ body }) => {
  //     const {
  //       order_items
  //     } = isString(body) ? JSON.parse(body) : body
  //     const soldout = [
  //       [],
  //       [
  //         {
  //           reason: '庫存不足',
  //           soldout_items: reduce(
  //             [order_items[0]],
  //             (collect, value, key) => {
  //               collect.push({ [key]: `${+value - random(1, 5)}` })
  //               return collect
  //             },
  //             []
  //           )
  //         }
  //       ]
  //     ][random(0, 1)]
  //     return {
  //       message: 'success',
  //       results: {
  //         items: order_items.map((id) => {
  //           return { [id]: `${random(10, 20)}` }
  //         }),
  //         discounts: [
  //           {
  //             type: '優惠方案',
  //             discount_amt: `${random(100, 500)}`
  //           }
  //         ],
  //         soldout,
  //         waring: ['', 'xxx：庫存魚隻已銷售完畢，我們會進行新購。'][random(0, 1)],
  //         total_quantity: random(10, 100),
  //         total_price: `${random(100, 200)}.${random(1000, 2000)}`
  //       }
  //     }
  //   }
  // },
  {
    url: `${awsHostPrefix}/confirmorder`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        SendMessageResponse: {
          ResponseMetadata: {
            RequestId: 'f9195ba7-e29d-58d5-9fbe-04813cd03769'
          },
          SendMessageResult: {
            MD5OfMessageAttributes: null,
            MD5OfMessageBody: 'f7da2aca7114f1b6ff07d516d57bdac7',
            MD5OfMessageSystemAttributes: null,
            MessageId: '41fc42e3-6416-4f0b-8c66-fae9cc18668b',
            SequenceNumber: null
          }
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportprepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      return {
        message: 'success',
        results: {
          items: order_items.map(({ fish_code, quantity, request }) => {
            return {
              fish_code,
              quantity,
              request,
              unit_price: random(1000, 2000),
              ...(statusList[random(0, size(statusList - 1))])
            }
          }),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          total_quantity: random(10, 100),
          total_price: `${random(100, 200)}.${random(1000, 2000)}`
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportprepurchaseorder`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        message: 'success',
        results: {
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          items: times(random(10, 20)).map((index) => {
            const fish_code = `FF120L${index}`
            const quantity = random(100, 500)
            const request = ['smaller', 'bigger'][random(0, 1)]
            return {
              fish_code,
              quantity,
              request,
              unit_price: random(1000, 2000),
              ...(statusList[random(0, size(statusList - 1))])
            }
          })
        }
      }
    }
  },
  // function duplicated of post-exportprepurchaseorder
  // {
  //   url: `${awsHostPrefix}/exportpreconfirmorder`,
  //   method: 'post',
  //   timeout: 100,
  //   response: ({ body }) => {
  //     const {
  //       order_items
  //     } = isString(body) ? JSON.parse(body) : body
  //     const soldout = [
  //       [],
  //       [
  //         {
  //           reason: '庫存不足',
  //           soldout_items: reduce(
  //             [order_items[0]],
  //             (collect, value, key) => {
  //               collect.push({ [key]: `${+value - random(1, 5)}` })
  //               return collect
  //             },
  //             []
  //           )
  //         }
  //       ]
  //     ][random(0, 1)]
  //     return {
  //       message: 'success',
  //       results: {
  //         items: order_items.map(((id) => {
  //           return { [id]: `${counts[random(0, 9)]},${random(5, 10)}` }
  //         })),
  //         discounts: [
  //           {
  //             type: '優惠方案',
  //             discount_amt: `${random(10, 50)}`
  //           }
  //         ],
  //         soldout,
  //         waring: ['', 'xxx：庫存魚隻已銷售完畢，我們會進行新購。'][random(0, 1)],
  //         total_quantity: `${counts[random(0, 9)]},${random(1, 10)}`,
  //         total_price: `${random(100, 200)}.${random(1000, 2000)}`
  //       }
  //     }
  //   }
  // },
  {
    url: `${awsHostPrefix}/exportconfirmorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      if (isUndefined(order_items)) {
        return {
          message: 'fail',
          results: 'no order_items'
        }
      }
      return {
        message: 'success',
        results: ''
      }
    }
  }
]
