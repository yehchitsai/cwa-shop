import { useState, useEffect } from 'react'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent =
      typeof navigator === 'undefined' ? '' : navigator.userAgent

    const mobileRegex =
      /Android|iPhone|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry/i

    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return isMobile
}

export default useIsMobile
