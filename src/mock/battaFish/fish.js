import {
  times, random, flow, values, concat, keyBy, get, map, size, sum, isString
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

const TYPE_KEY = {
  A: 'FF1301L',
  B: 'FF1301LF',
  C: 'FF1302L'
}
const TYPE_PRICE = {
  [TYPE_KEY.A]: 100,
  [TYPE_KEY.B]: 200,
  [TYPE_KEY.C]: 300
}
const types = [
  { fishType: TYPE_KEY.A, scientificName: 'Betta splendens' },
  { fishType: TYPE_KEY.B, scientificName: 'Betta splendens' },
  { fishType: TYPE_KEY.C, scientificName: 'Betta splendens' }
]
const fishNameMapByLang = {
  'zh-TW': {
    [TYPE_KEY.A]: '冠尾鬥魚(公)',
    [TYPE_KEY.B]: '冠尾鬥魚(母)',
    [TYPE_KEY.C]: '馬尾鬥魚(公)'
  },
  en: {
    [TYPE_KEY.A]: 'batta fish (Male)',
    [TYPE_KEY.B]: 'batta fish (Female)',
    [TYPE_KEY.C]: 'batta fish2 (Male)'
  },
  jp: {
    [TYPE_KEY.A]: 'ベタ・スプレンデンス (オス)',
    [TYPE_KEY.B]: 'ベタ・スプレンデンス (メス)',
    [TYPE_KEY.C]: 'ベタ・スプレンデンス2 (オス)'
  }
}

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (width, height, text) => {
  return `https://fakeimg.pl/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

const getFishData = (type) => times(random(10, 20), (index) => {
  const itemPrice = TYPE_PRICE[type]
  const itemSerial = `${itemPrice + index}`
  return {
    itemSerial,
    itemPrice,
    imageURL: getFakeImage(600, 400, `Batta${itemSerial}`)
  }
})
const fishDataMap = {
  [TYPE_KEY.A]: getFishData(TYPE_KEY.A),
  [TYPE_KEY.B]: getFishData(TYPE_KEY.B),
  [TYPE_KEY.C]: getFishData(TYPE_KEY.C)
}

const totalFishDataMapByItemSerial = flow(
  () => values(fishDataMap),
  (fishDatas) => concat(...fishDatas),
  (totalFishData) => keyBy(totalFishData, 'itemSerial')
)()
const getFishInfo = (itemSerial) => ({
  itemImages: [
    ...times(random(3, 6), (index) => {
      const text = `Batta${itemSerial}-item${index}`
      return {
        thumbnailImg: totalFishDataMapByItemSerial[itemSerial].imageURL,
        productImg: getFakeImage(1200, 800, text),
        zoomedImg: getFakeImage(2400, 1600, text)
      }
    })
  ],
  itemVideos: (+itemSerial % 2 === 0) ? [] : [{ productVideo: videos[random(0, 2)] }]
})

export default [
  {
    url: `${getApiPrefix()}/bettafish`,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        lang
      } = JSON.parse(JSON.stringify(stringObject))

      const convertedLang = ['en-US', 'en'].includes(lang)
        ? 'en'
        : lang
      const results = types.map(((type) => {
        return {
          ...type,
          fishName: get(
            fishNameMapByLang,
            `${convertedLang}.${type.fishType}`,
            get(fishNameMapByLang, `en.${type.fishType}`)
          ),
          fishPrice: TYPE_PRICE[type.fishType]
        }
      }))
      return { message: 'success', results }
    }
  },
  {
    url: `${getApiPrefix()}/bettafishinfo`,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        fishType
      } = JSON.parse(JSON.stringify(stringObject))
      const results = fishDataMap[fishType]
      return { message: 'success', results }
    }
  },
  {
    url: `${getApiPrefix()}/bettafishserialinfo`,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        itemSerial
      } = JSON.parse(JSON.stringify(stringObject))
      const results = getFishInfo(itemSerial)
      return { message: 'success', results }
    }
  },
  {
    url: `${getApiPrefix()}/bettafishpreorder`,
    method: 'get',
    timeout: 1500,
    response: () => {
      const results = {
        [TYPE_KEY.A]: {
          items: get(fishDataMap, TYPE_KEY.A).slice(0, 3).map((item) => item.itemSerial)
        },
        [TYPE_KEY.B]: {
          items: get(fishDataMap, TYPE_KEY.B).slice(1, 5).map((item) => item.itemSerial)
        },
        [TYPE_KEY.C]: {
          items: get(fishDataMap, TYPE_KEY.C).slice(2, 7).map((item) => item.itemSerial)
        }
      }
      return { message: 'success', results }
    }
  },
  {
    url: `${getApiPrefix()}/bettafishpreorder`,
    method: 'post',
    timeout: 1500,
    response: ({ body }) => {
      const {
        reserveItemSerials = [],
        clearItemSerials = []
      } = isString(body) ? JSON.parse(body) : body
      const reserveMap = keyBy(reserveItemSerials)
      const results = [...reserveItemSerials, ...clearItemSerials]
        .map((itemSerial) => {
          const isSuccess = (+itemSerial % 2) === 0
          return {
            itemSerial,
            done: isSuccess ? 1 : 0,
            reason: isSuccess
              ? (itemSerial in reserveMap) ? 'booked' : 'cleared'
              : 'booked by other'
          }
        })
      return { message: 'success', results }
    }
  },
  {
    url: `${getApiPrefix()}/fishorder`,
    method: 'post',
    timeout: 1500,
    response: () => {
      const result = [TYPE_KEY.A, TYPE_KEY.B, TYPE_KEY.C]
        .map(getFishData)
        .map((fishData) => fishData.slice(0, random(3, 6)))
        .map((fishData) => {
          const items = map(fishData, 'itemSerial')
          const unitPrice = get(fishData, '0.itemPrice', '0')
          const subTotal = size(items) * unitPrice
          return { items, unitPrice, subTotal }
        })
      const [resultA, resultB, resultC] = result
      const results = {
        [TYPE_KEY.A]: resultA,
        [TYPE_KEY.B]: resultB,
        [TYPE_KEY.C]: resultC,
        orderTotalQuantity: sum(map(result, (typeItem) => size(typeItem.items))),
        orderTotalPrice: sum(map(result, (typeItem) => size(typeItem.subTotal))),
        currency: 'TWD'
      }
      return { message: 'success', results }
    }
  }
]
