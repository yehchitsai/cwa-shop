import {
  isString, isUndefined, random, reduce, times
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

const counts = times(10, (index) => index + 0.5)

export default [
  {
    url: `${getApiPrefix()}/purchase/prepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      return {
        message: 'success',
        results: {
          items: order_items.map(((id) => {
            return { [id]: `${random(10, 20)}` }
          })),
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
    url: `${getApiPrefix()}/purchase/preconfirmorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      const soldout = [
        [],
        [
          {
            reason: '庫存不足',
            soldout_items: reduce(
              [order_items[0]],
              (collect, value, key) => {
                collect.push({ [key]: `${+value - random(1, 5)}` })
                return collect
              },
              []
            )
          }
        ]
      ][random(0, 1)]
      return {
        message: 'success',
        results: {
          items: order_items.map(((id) => {
            return { [id]: `${random(10, 20)}` }
          })),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          soldout,
          waring: ['', 'xxx：庫存魚隻已銷售完畢，我們會進行新購。'][random(0, 1)],
          total_quantity: random(10, 100),
          total_price: `${random(100, 200)}.${random(1000, 2000)}`
        }
      }
    }
  },
  {
    url: `${getApiPrefix()}/purchase/confirmorder`,
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
  },
  {
    url: `${getApiPrefix()}/purchase/exportprepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      return {
        message: 'success',
        results: {
          items: order_items.map(((id) => {
            return { [id]: `${counts[random(0, 9)]},${random(5, 10)}` }
          })),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(10, 50)}`
            }
          ],
          total_quantity: `${counts[random(0, 9)]},${random(1, 10)}`,
          total_price: `${random(100, 200)}.${random(1000, 2000)}`
        }
      }
    }
  },
  {
    url: `${getApiPrefix()}/purchase/exportpreconfirmorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const {
        order_items
      } = isString(body) ? JSON.parse(body) : body
      const soldout = [
        [],
        [
          {
            reason: '庫存不足',
            soldout_items: reduce(
              [order_items[0]],
              (collect, value, key) => {
                collect.push({ [key]: `${+value - random(1, 5)}` })
                return collect
              },
              []
            )
          }
        ]
      ][random(0, 1)]
      return {
        message: 'success',
        results: {
          items: order_items.map(((id) => {
            return { [id]: `${counts[random(0, 9)]},${random(5, 10)}` }
          })),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(10, 50)}`
            }
          ],
          soldout,
          waring: ['', 'xxx：庫存魚隻已銷售完畢，我們會進行新購。'][random(0, 1)],
          total_quantity: `${counts[random(0, 9)]},${random(1, 10)}`,
          total_price: `${random(100, 200)}.${random(1000, 2000)}`
        }
      }
    }
  },
  {
    url: `${getApiPrefix()}/purchase/exportconfirmorder`,
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
