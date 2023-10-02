import useSWR from 'swr'
import { times, random } from 'lodash-es'

const images = times(4, (index) => `img${index}.jpg`)
const fishData = times(random(20, 40), (index) => {
  const fishType = random(0, 3)
  return {
    index,
    id: index * random(10, 20),
    images: [images[fishType]],
    type: `Fish ${fishType}`,
    price: random(1000, 1500) * (index + 1)
  }
})

const fetcher = () => new Promise((resolve) => {
  setTimeout(() => {
    return resolve(fishData)
  }, 2000)
})

const useFishData = () => {
  const { data, error, isLoading } = useSWR('/users', fetcher)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useFishData
