import {
  times, random
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const CATEGORY = {
  AAA: 'AAA',
  BBB: 'BBB',
  CCC: 'CCC'
}

const CATEGORIES = [
  CATEGORY.AAA,
  CATEGORY.BBB,
  CATEGORY.CCC
]

const FISH_SIZES = ['M', 'L', 'XL']

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (width, height, text) => {
  return `https://fakeimg.pl/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

export default [
  {
    url: `${awsHostPrefix}/categoryinfo`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        category
      } = JSON.parse(JSON.stringify(stringObject))
      const items = times(random(10, 30), (index) => {
        const cat = category || CATEGORIES[random(0, 2)]
        const fishName = `fish_name_${index}`
        return {
          fish_code: `FF120L${index}`,
          science_name: `science_name_${index}`,
          fish_name: fishName,
          fish_size: FISH_SIZES[random(0, 2)],
          unit_price: `${random(10, 100)}`,
          retail_price: `${random(10, 100)}`,
          inventory: `${random(10, 100)}`,
          min_purchase_quantity: `${random(10, 20)}`,
          note: ['', `note_${index}`][random(0, 1)],
          image_link: getFakeImage(100, 100, `${cat}-${fishName}`),
          video_link: videos[random(0, 2)]
        }
      })
      return {
        status: 'success',
        results: {
          update_date: '2024-05-27',
          delivery_date: '2024-06-01',
          category,
          items
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportcategoryinfo`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        category
      } = JSON.parse(JSON.stringify(stringObject))
      const items = times(random(10, 30), (index) => {
        const cat = category || CATEGORIES[random(0, 2)]
        const fishName = `fish_name_${index}`
        return {
          fish_code: `FF120L${index}`,
          science_name: `science_name_${index}`,
          fish_name: fishName,
          fish_size: FISH_SIZES[random(0, 2)],
          unit_price: `${random(10, 100)}`,
          package_qty: `${random(10, 100)}`,
          inventory: `${random(10, 100)}`,
          box_qty: `${random(10, 20)}`,
          note: ['', `note_${index}`][random(0, 1)],
          image_link: getFakeImage(100, 100, `${cat}-${fishName}`),
          video_link: videos[random(0, 2)]
        }
      })
      return {
        status: 'success',
        results: {
          update_date: '2024-05-27',
          category,
          items
        }
      }
    }
  }
]
