import {
  get,
  isEmpty,
  isString, random, size, times
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const FISH_SIZES = ['M', 'L', 'XL']

const statusList = [
  { status: 'fail', message: '購買數量大於庫存' },
  { status: 'success', message: '正常' },
  { status: 'fail', message: '購買數量大於庫存2' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' }
]

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (width, height, text) => {
  return `https://dummyimage.com/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

export default [
  {
    url: `${awsHostPrefix}/prepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const order_items = get(isString(body) ? JSON.parse(body) : body, 'order_items', [])
      return {
        message: 'success',
        results: {
          items: order_items.map(({ fish_code, quantity, request = '' }) => {
            return {
              fish_code,
              quantity,
              request,
              unit_price: random(1000, 2000),
              group: random(1, 5),
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
          discounts: times(random(3, 10)).map((index) => {
            return {
              type: `優惠方案${index}`,
              discount_amt: `${random(100, 500)}`
            }
          }),
          items: times(random(2, 5)).map((index) => {
            const fish_code = `FF120L${index}`
            const quantity = random(20, 40)
            const request = ['smaller', 'bigger', ''][random(0, 2)]
            const fishName = `fish_name_${index}`
            return {
              fish_code,
              science_name: `science_name_${index}`,
              quantity,
              request,
              group: random(1, 5),
              fish_name: fishName,
              fish_size: FISH_SIZES[random(0, 2)],
              unit_price: random(10, 100),
              retail_price: random(10, 100),
              inventory: random(20, 100),
              note: ['', `note_${index}`][random(0, 1)],
              image_link: getFakeImage(100, 100, fishName),
              video_link: videos[random(0, 2)],
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
      const order_items = get(isString(body) ? JSON.parse(body) : body, 'order_items', [])
      if (isEmpty(order_items)) {
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
