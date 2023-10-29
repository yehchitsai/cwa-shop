import {
  isUndefined, times, random, flow, values, concat, keyBy, get
} from 'lodash-es'

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

const getFishData = (type) => times(random(10, 20), (index) => {
  const itemPrice = TYPE_PRICE[type]
  const itemSerial = `${itemPrice + index}`
  return {
    itemSerial,
    itemPrice,
    imageURL: `https://fakeimg.pl/640x640/?text=Batta${itemSerial}&font=lobster&font_size=50`
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
    totalFishDataMapByItemSerial[itemSerial].imageURL,
    ...times(random(1, 4), (index) => {
      return `https://fakeimg.pl/1280x640/?text=Batta${itemSerial}-item${index}&font=lobster&font_size=50`
    })
  ],
  itemVideos: []
})

let apiPrefix
if (typeof window === 'object') {
  apiPrefix = window.VITE_AWS_HOST_PREFIX
} else {
  apiPrefix = process.env.VITE_AWS_HOST_PREFIX
}
const url = `${apiPrefix}/battafish`

export default [
  {
    url,
    method: 'get',
    timeout: 1500,
    response: ({ query: stringObject }) => {
      const {
        lang,
        fishType,
        itemSerial
      } = JSON.parse(JSON.stringify(stringObject))

      if (!isUndefined(lang)) {
        const convertedLang = ['en-US', 'en'].includes(lang)
          ? 'en'
          : lang
        const fishTypes = types.map(((type) => {
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
        return fishTypes
      }

      if (!isUndefined(fishType)) {
        const fishData = fishDataMap[fishType]
        return fishData
      }

      if (!isUndefined(itemSerial)) {
        const fishData = getFishInfo(itemSerial)
        return fishData
      }

      return []
    }
  }
]
