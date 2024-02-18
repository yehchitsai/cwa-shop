import { useState } from 'react'
import { random, times } from 'lodash-es'
import wait from '../../../../utils/wait'

const getFakeImage = (width, height, text) => {
  return `https://fakeimg.pl/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

const useRowInfo = (url) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})

  if (!isLoading) {
    return { isLoading, data }
  }

  wait(1000).then(() => {
    setIsLoading(false)
    const id = url.slice(30, 50)
    const newData = {
      id,
      fishType: 'test type',
      images: times(random(2, 5), () => ({
        isVideo: false,
        url: getFakeImage(300, 700, id)
      }))
    }
    setData(newData)
  })

  return {
    isLoading,
    data
  }
}

export default useRowInfo
